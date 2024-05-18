import React, { useContext, useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/ManualUpload.css'
import OptionsDropdown from './OptionsDropdown'
import Questions from './Questions'
import IconSelectModal from './IconSelectModal'
import { papers, testTypes, subjects } from '../constants/Constants'
import { DatePicker, TimePicker } from 'antd'
import moment from 'moment'
import { dataContext } from '../contexts/store'
import { addQuiz } from '../services/Quiz'
import { useSelector } from 'react-redux'

const ManualUpload = () => {
    const { manualUploadTest, updateManualUploadTest, manualUploadTestAlert, updateManualUploadTestAlert } = useContext(dataContext)
    const [selectedSubject, setSelectedSubject] = useState(manualUploadTest.class ? subjects[manualUploadTest.class][0] : "")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const { teacherInfo}  = useSelector((state) => state.teacher)
    const filteredPapers = papers.filter(paper => Object.keys(teacherInfo.subjects).includes(paper)) || [];
// Filter subjects based on keys present in the API response
    const  getSubjectsForPaper = (selectedClass) => {
        return teacherInfo.subjects[selectedClass] || [];
    }
    const range = (start, end) => {
        const result = []
        for (let i = start; i < end; i++) {
            result.push(i)
        }
        return result
    }

    const disabledStartDate = (current) => {
        return current && current < moment()
    }

    const disabledEndDate = (current) => {
        return current && (manualUploadTest.quizStartDateTimeObject ? current < moment(new Date(manualUploadTest.quizStartDateTimeObject)) : current < moment())
    }

    const disabledStartDateTime = (current) => {
        if (moment(new Date(current)).startOf('day').format('DD/MM/YYYY') === moment(new Date()).startOf('day').format('DD/MM/YYYY')) {
            if (moment(new Date(current)).hour() === moment(new Date()).hour()) {
                return {
                    disabledHours: () => range(0, moment().hour()),
                    disabledMinutes: () => range(0, moment().minute() + 1)
                }
            } else {
                return {
                    disabledHours: () => range(0, moment().hour())
                }
            }
        }
    }

    const disabledEndDateTime = (current) => {
        let comparableDateObject = manualUploadTest.quizStartDateTimeObject ? new Date(manualUploadTest.quizStartDateTimeObject) : new Date()
        if (moment(new Date(current)).startOf('day').format('DD/MM/YYYY') === moment(comparableDateObject).startOf('day').format('DD/MM/YYYY')) {
            if (moment(new Date(current)).hour() === moment(comparableDateObject).hour()) {
                return {
                    disabledHours: () => range(0, moment(comparableDateObject).hour()),
                    disabledMinutes: () => range(0, moment(comparableDateObject).minute() + 1)
                }
            } else {
                return {
                    disabledHours: () => range(0, moment(comparableDateObject).hour()),
                }
            }
        }
    }

    const handleChange = (e) => {
        updateManualUploadTest((manualUploadTest) => ({ ...manualUploadTest, [e.target.name]: e.target.value }))
    }

    const onDurationChange = (value, timeString) => {
        updateManualUploadTest((manualUploadTest) => ({ ...manualUploadTest, quizDurationObject: value, quizDuration: timeString }))
    }

    const onStartTimeChange = (value, timeString) => {
        updateManualUploadTest((manualUploadTest) => ({ ...manualUploadTest, quizStartDateTimeObject: value, quizStartDateTime: timeString }))
    }

    const onEndTimeChange = (value, timeString) => {
        updateManualUploadTest((manualUploadTest) => ({ ...manualUploadTest, quizEndDateTimeObject: value, quizEndDateTime: timeString }))
    }

    const selectSubject = (value) => {
        setSelectedSubject(value)
        if (!Object.keys(manualUploadTest.quiz).includes(value)) {
            updateManualUploadTest((prev) => ({ ...prev, quiz: { ...prev.quiz, [value]: [] } }))
        }
    }

    const addQuestion = () => {
        let newQuiz = { ...manualUploadTest.quiz }
        newQuiz[selectedSubject] = 
            [
            ...newQuiz[selectedSubject],
            {
                question: "",
                options: ["", "", "", ""],
                answer: ""
            }
        ]
        updateManualUploadTest((prev) => ({ ...prev, quiz: newQuiz }))
    }
    const removeQuestion = (question) => {
        let newQuiz = { ...manualUploadTest.quiz };
        const filterQuestions = newQuiz[question.id].filter(item =>
            !isQuestionEqual(item, question)
        );
        const indexToRemove = newQuiz[question.id].findIndex(element => isQuestionEqual(element, question));
        if (indexToRemove !== -1) {
            newQuiz[question.id].splice(indexToRemove, 1);
        }
        updateManualUploadTest(prev => ({ ...prev, quiz: newQuiz }));
    }
    
    function isQuestionEqual(question1, question2) {
        return (
            question1.question === question2.question &&
            arraysEqual(question1.options, question2.options) &&
            question1.answer === question2.answer
        );
    }
    
    function arraysEqual(arr1, arr2) {
        if (arr1.length !== arr2.length) {
            return false;
        }
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }
        return true;
    }
    
    // const removeQuestion = (subject, index) => {
    //     let newQuiz = { ...manualUploadTest.quiz };
    //     newQuiz[subject] = newQuiz[subject].filter((_, i) => i !== index);
    //     updateManualUploadTest((prev) => ({ ...prev, quiz: newQuiz }));
    // };

    const handleQuestionChange = (e, questionIndex) => {
        let newQuiz = { ...manualUploadTest.quiz }
        newQuiz[selectedSubject][questionIndex].question = e.target.value
        updateManualUploadTest((prev) => ({ ...prev, quiz: newQuiz }))
    }

    const handleOptionChange = (e, questionIndex, optionIndex) => {
        let newQuiz = { ...manualUploadTest.quiz }
        newQuiz[selectedSubject][questionIndex].options[optionIndex] = e.target.value
        updateManualUploadTest((prev) => ({ ...prev, quiz: newQuiz }))
    }

    const handleSelectAnswer = (questionIndex, option) => {
        let newQuiz = { ...manualUploadTest.quiz }
        newQuiz[selectedSubject][questionIndex].answer = option
        updateManualUploadTest((prev) => ({ ...prev, quiz: newQuiz }))
    }

    const addOption = (questionIndex) => {
        let newQuiz = { ...manualUploadTest.quiz }
        newQuiz[selectedSubject][questionIndex].options = [...newQuiz[selectedSubject][questionIndex].options, '']
        updateManualUploadTest((prev) => ({ ...prev, quiz: newQuiz }))
    }

    const removeOption = (questionIndex, optionIndex) => {
        let newQuiz = { ...manualUploadTest.quiz }
        newQuiz[selectedSubject][questionIndex].options.splice(optionIndex, 1)
        updateManualUploadTest((prev) => ({ ...prev, quiz: newQuiz }))
    }

    const dismissModal = () => {
        updateManualUploadTestAlert((prev) => ({ ...prev, quizIcon: '' }))
        setIsModalOpen(false)
    }

    const handleIconSelect = (selectedIcon) => {
        updateManualUploadTest((manualUploadTest) => ({ ...manualUploadTest, quizIcon: selectedIcon }))
    }

    const handleOnOk = () => {
        if (manualUploadTest.quizIcon === "") {
            updateManualUploadTestAlert((prev) => ({ ...prev, quizIcon: 'Please select an icon' }))
        } else {
            dismissModal()
        }
    }

    const handleSubmit = async (isDraft, e) => {
        e.preventDefault();
        setIsLoading(true);
        if (validateForm()) {


            const quizData = {
                "name": manualUploadTest.name,
                "type": manualUploadTest.type,
                "programme": manualUploadTest.class,
                "duration": manualUploadTest.quizDuration,
                "start_time": new Date(manualUploadTest.quizStartDateTime),
                "end_time": manualUploadTest.quizEndDateTime,
                "quiz": [],
                "icon": "globe",
                "teacher_id": "6575effc13906711ea001bed",
                "draft": isDraft
            }
            quizData.quiz = manualUploadTest.quiz;

            try {
                const response = await addQuiz(quizData);

            } catch (e) {

                console.error(e.message);

            }
            finally {
                if (isDraft) {
                    setMessage("Saved as Draft.");
                }
                if (!isDraft) {
                    setMessage("Test Uploaded Successfully.");
                }
                setIsLoading(false);
            }
        }
    }

    const validateForm = () => {
        let valid = true
        if (manualUploadTest.name === "") {
            updateManualUploadTestAlert((prev) => ({ ...prev, name: 'Please enter test name' }))
            valid = false
        }
        if (manualUploadTest.type === "") {
            updateManualUploadTestAlert((prev) => ({ ...prev, type: 'Please select test type' }))
            valid = false
        }
        if (manualUploadTest.class === "") {
            updateManualUploadTestAlert((prev) => ({ ...prev, class: 'Please select test class' }))
            valid = false
        }
        if (manualUploadTest.quizDuration === "" || manualUploadTest.quizDuration === "00:00") {
            updateManualUploadTestAlert((prev) => ({ ...prev, quizDuration: 'Please select a valid test duration' }))
            valid = false
        }
        if (manualUploadTest.type === "Live" && manualUploadTest.quizEndDateTime === "") {
            updateManualUploadTestAlert((prev) => ({ ...prev, quizEndDateTime: 'Please select test end time' }))
            valid = false
        }
        // if (Object.keys(manualUploadTest.quiz).length !== subjects[manualUploadTest.class].length || !subjects[manualUploadTest.class].every((value) => Object.keys(manualUploadTest.quiz).includes(value)) || !Object.values(manualUploadTest.quiz).every((value) => value.length > 0)) {
        //     updateManualUploadTestAlert((prev) => ({ ...prev, general: 'Please upload at least one question for all subjects' }))
        //     valid = false
        //     return valid
        // }
        if (Object.values(manualUploadTest.quiz).some((value) => value.some((question) => question.question === ""))) {
            updateManualUploadTestAlert((prev) => ({ ...prev, general: 'No question can be left empty' }))
            valid = false
            return valid
        }
        if (Object.values(manualUploadTest.quiz).some((value) => value.some((question) => question.options.filter((option) => option !== "").length < 2))) {
            updateManualUploadTestAlert((prev) => ({ ...prev, general: 'Each question must have at least two valid options' }))
            valid = false
            return valid
        }
        if (Object.values(manualUploadTest.quiz).some((value) => value.some((question) => question.answer === "" || !question.options.includes(question.answer)))) {
            updateManualUploadTestAlert((prev) => ({ ...prev, general: 'Each question must have a valid correct answer' }))
            valid = false
        }
        return valid
    }

    useEffect(() => {
        if (manualUploadTest.name !== "") {
            updateManualUploadTestAlert((prev) => ({ ...prev, name: '' }))
        }
        if (manualUploadTest.type !== "") {
            updateManualUploadTestAlert((prev) => ({ ...prev, type: '' }))
        }
        if (manualUploadTest.class !== "") {
            updateManualUploadTestAlert((prev) => ({ ...prev, class: '' }))
        }
        if (manualUploadTest.quizDuration !== "" && manualUploadTest.quizDuration !== "00:00") {
            updateManualUploadTestAlert((prev) => ({ ...prev, quizDuration: '' }))
        }
        if (manualUploadTest.type === "Live" && manualUploadTest.quizEndDateTime !== "") {
            updateManualUploadTestAlert((prev) => ({ ...prev, quizEndDateTime: '' }))
        }
        if (Object.keys(manualUploadTest.quiz).length > 0 && Object.keys(manualUploadTest.quiz).length === subjects[manualUploadTest.class].length && subjects[manualUploadTest.class].every((value) => Object.keys(manualUploadTest.quiz).includes(value)) && Object.values(manualUploadTest.quiz).every((value) => value.length > 0)) {
            updateManualUploadTestAlert((prev) => ({ ...prev, general: '' }))
        }
        if (Object.values(manualUploadTest.quiz).every((value) => value.every((question) => question.question !== ""))) {
            updateManualUploadTestAlert((prev) => ({ ...prev, general: '' }))
        }
        if (Object.values(manualUploadTest.quiz).every((value) => value.every((question) => question.options.filter((option) => option !== "").length >= 2))) {
            updateManualUploadTestAlert((prev) => ({ ...prev, general: '' }))
        }
        if (Object.values(manualUploadTest.quiz).every((value) => value.every((question) => question.answer !== "" && question.options.includes(question.answer)))) {
            updateManualUploadTestAlert((prev) => ({ ...prev, general: '' }))
        }
    }, [manualUploadTest.name, manualUploadTest.type, manualUploadTest.class, manualUploadTest.quizDuration, manualUploadTest.quizEndDateTime, manualUploadTest.quiz])


    return (
        <div>

            <form className='card' id="manual-upload" autoComplete='on' onSubmit={handleSubmit}>
                <div className="card-heading">Test Details</div>
                <hr className="hr-break" />
                <div className='manual-upload-details d-grid-cols twelve-columns gap1 mv1'>
                    <div className="form-group col-4">
                        <label htmlFor="name">Test Name<span className='mandatory'> *</span></label><br />
                        <input type="text" className="form-input" name="name" id="name" placeholder='Name' value={manualUploadTest.name} onChange={handleChange} /><br />
                        {manualUploadTestAlert.name && <div className='alert mthalf'>{manualUploadTestAlert.name}</div>}
                    </div>
                    <div className="form-group col-4">
                        <label htmlFor="type">Test Type<span className='mandatory'> *</span></label><br />
                        <OptionsDropdown
                            placeholder='Type'
                            dropOptions={testTypes}
                            nameOfLabel='type'
                            selectedOption={manualUploadTest.type}
                            handleChange={(value) => updateManualUploadTest((manualUploadTest) => ({ ...manualUploadTest, type: value }))}
                        />
                        {manualUploadTestAlert.type && <div className='alert mthalf'>{manualUploadTestAlert.type}</div>}
                    </div>
                    <div className="form-group col-4">
                        <label htmlFor="class">Class<span className='mandatory'> *</span></label><br />
                        
                        <OptionsDropdown
                            placeholder='Class'
                            dropOptions={filteredPapers}
                            nameOfLabel='class'
                            selectedOption={manualUploadTest.class}
                            handleChange={(value) => updateManualUploadTest((manualUploadTest) => ({ ...manualUploadTest, class: value }))}
                        />
                        {manualUploadTestAlert.class && <div className='alert mthalf'>{manualUploadTestAlert.class}</div>}
                    </div>
                    <div className="form-group col-4">
                        <label htmlFor="duration">Test Duration<span className='mandatory'> *</span></label><br />
                        <TimePicker
                            getPopupContainer={() => document.getElementById('date-picker-container')}
                            placeholder="Duration"
                            format='HH:mm'
                            onChange={onDurationChange}
                            value={manualUploadTest.quizDurationObject}
                            name='duration'
                            showNow={false}
                            suffixIcon={null}
                            className='w100 bdr bg-white mthalf'
                        />
                        {manualUploadTestAlert.quizDuration && <div className='alert mthalf'>{manualUploadTestAlert.quizDuration}</div>}
                    </div>
                    <div className="form-group col-4">
                        <label htmlFor="quizStartDateTime">Test Start Time</label><br />
                        <DatePicker
                            getPopupContainer={() => document.getElementById('date-picker-container')}
                            // format='MM/DD/YYYY HH:mm'
                            disabledDate={disabledStartDate-1}
                            disabledTime={disabledStartDateTime}
                            onChange={onStartTimeChange}
                            value={manualUploadTest.quizStartDateTimeObject}
                            name='quizStartDateTime'
                            showNow={false}
                            showTime={true}
                            suffixIcon={null}
                            className='w100 bdr bg-white mthalf'
                        />
                        {manualUploadTestAlert.quizStartDateTime && <div className='alert mthalf'>{manualUploadTestAlert.quizStartDateTime}</div>}
                    </div>
                    <div className="form-group col-4">
                        {manualUploadTest.type === "Live" &&
                            <>
                                <label htmlFor="quizEndDateTime">Test End Time</label><br />
                                <DatePicker
                                    getPopupContainer={() => document.getElementById('date-picker-container')}
                                    format='DD/MM/YYYY HH:mm'
                                    disabledDate={disabledEndDate}
                                    disabledTime={disabledEndDateTime}
                                    onChange={onEndTimeChange}
                                    value={manualUploadTest.quizEndDateTimeObject}
                                    name='quizEndDateTime'
                                    showNow={false}
                                    showTime={true}
                                    suffixIcon={null}
                                    className='w100 bdr bg-white mthalf'
                                />
                                {manualUploadTestAlert.quizEndDateTime && <div className='alert mthalf'>{manualUploadTestAlert.quizEndDateTime}</div>}
                            </>
                        }
                    </div>
                    <div className="form-group col-4 mt1">
                        <label htmlFor="selected-subject">Subject</label><br />
                        <OptionsDropdown
                            placeholder={manualUploadTest.class ? '' : 'Please select class first'}
                            dropOptions={manualUploadTest.class ? getSubjectsForPaper([manualUploadTest.class]) : []}
                            nameOfLabel='selected-subject'
                            selectedOption={selectedSubject}
                            handleChange={(value) => selectSubject(value)}
                        />
                    </div>
                </div>
                {selectedSubject  ? (
                        <Questions
                            questions={manualUploadTest.quiz}
                            removeQuestion={removeQuestion}
                            handleQuestionChange={handleQuestionChange}
                            handleOptionChange={handleOptionChange}
                            handleSelectAnswer={handleSelectAnswer}
                            addOption={addOption}
                            removeOption={removeOption}
                        />
                    ) : (
                        <div className='text-center mv2'>
                            Please add the first question of {selectedSubject}
                        </div>
                    )}
                {!selectedSubject && (
                    <div className='text-center mv2'>
                        Please select a subject to see questions
                    </div>
                )}

                <div className='text-right mvhalf d-flex-row justify-end align-center'>
                    {manualUploadTestAlert.general && <div className='flex-1 text-center alert'>{manualUploadTestAlert.general}</div>}
                    {selectedSubject && <button className='btn mr1' type='button' onClick={addQuestion}>Add Question</button>}
                    <button className='btn' style={{ marginRight: ".9rem" }} onClick={(e) => handleSubmit(true, e)} type='submit'>Save As Draft</button>
                    <button className='btn' onClick={(e) => handleSubmit(false, e)} type='submit'>Upload</button>

                </div>
                <IconSelectModal
                    isModalOpen={isModalOpen}
                    onOk={handleOnOk}
                    onCancel={dismissModal}
                    handleSelect={handleIconSelect}
                    uploadType="manual"
                />
            </form>
        </div>
    )
}

export default ManualUpload