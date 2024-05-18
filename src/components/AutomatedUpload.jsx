import React, { useContext, useEffect, useState } from 'react'
import '../styles/AutomatedUpload.css'
import { dataContext } from '../contexts/store'
import data from '../../api.json'
import OptionsDropdown from './OptionsDropdown'
import { papers, testTypes, subjects } from '../constants/Constants'
import { DatePicker, TimePicker } from 'antd'
import moment from 'moment'
import FileUpload from './FileUpload'
import IconSelectModal from './IconSelectModal'
import { useNavigate } from 'react-router-dom'

const AutomatedUpload = () => {
    const { automatedUploadTest, updateAutomatedUploadTest, automatedUploadTestAlert, updateAutomatedUploadTestAlert } = useContext(dataContext)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const navigate = useNavigate()

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
        return current && (automatedUploadTest.quizStartDateTimeObject ? current < moment(new Date(automatedUploadTest.quizStartDateTimeObject)) : current < moment())
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
        let comparableDateObject = automatedUploadTest.quizStartDateTimeObject ? new Date(automatedUploadTest.quizStartDateTimeObject) : new Date()
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
        updateAutomatedUploadTest((automatedUploadTest) => ({ ...automatedUploadTest, [e.target.name]: e.target.value }))
    }

    const handleFileChange = (e) => {
        let newQuiz = { ...automatedUploadTest.quizFiles }
        newQuiz[e.target.name] = e.target.files[0]
        updateAutomatedUploadTest((automatedUploadTest) => ({ ...automatedUploadTest, quizFiles: newQuiz }))
    }

    const handleDeleteFile = (subject) => {
        let newQuiz = { ...automatedUploadTest.quizFiles }
        delete newQuiz[subject]
        updateAutomatedUploadTest((automatedUploadTest) => ({ ...automatedUploadTest, quizFiles: newQuiz }))
    }

    const onDurationChange = (value, timeString) => {
        updateAutomatedUploadTest((automatedUploadTest) => ({ ...automatedUploadTest, quizDurationObject: value, quizDuration: timeString }))
    }

    const onStartTimeChange = (value, timeString) => {
        updateAutomatedUploadTest((automatedUploadTest) => ({ ...automatedUploadTest, quizStartDateTimeObject: value, quizStartDateTime: timeString }))
    }

    const onEndTimeChange = (value, timeString) => {
        updateAutomatedUploadTest((automatedUploadTest) => ({ ...automatedUploadTest, quizEndDateTimeObject: value, quizEndDateTime: timeString }))
    }

    const dismissModal = () => {
        updateAutomatedUploadTestAlert((prev) => ({ ...prev, quizIcon: '' }))
        setIsModalOpen(false)
    }

    const handleIconSelect = (selectedIcon) => {
        updateAutomatedUploadTest((automatedUploadTest) => ({ ...automatedUploadTest, quizIcon: selectedIcon }))
    }

    const handleOnOk = () => {
        if (automatedUploadTest.quizIcon === "") {
            updateAutomatedUploadTestAlert((prev) => ({ ...prev, quizIcon: 'Please select an icon' }))
        } else {
            dismissModal()
        }
    }

    const validateForm = () => {
        let valid = true
        if (automatedUploadTest.name === "") {
            updateAutomatedUploadTestAlert((prev) => ({ ...prev, name: 'Please enter test name' }))
            valid = false
        }
        if (automatedUploadTest.type === "") {
            updateAutomatedUploadTestAlert((prev) => ({ ...prev, type: 'Please select test type' }))
            valid = false
        }
        if (automatedUploadTest.class === "") {
            updateAutomatedUploadTestAlert((prev) => ({ ...prev, class: 'Please select test class' }))
            valid = false
        }
        if (automatedUploadTest.quizDuration === "") {
            updateAutomatedUploadTestAlert((prev) => ({ ...prev, quizDuration: 'Please select test duration' }))
            valid = false
        }
        if (automatedUploadTest.type === "Live" && automatedUploadTest.quizEndDateTime === "") {
            updateAutomatedUploadTestAlert((prev) => ({ ...prev, quizEndDateTime: 'Please select test end time' }))
            valid = false
        }
        if (Object.keys(automatedUploadTest.quizFiles).length !== subjects[automatedUploadTest.class].length || !subjects[automatedUploadTest.class].every((value) => Object.keys(automatedUploadTest.quizFiles).includes(value))) {
            updateAutomatedUploadTestAlert((prev) => ({ ...prev, general: 'Please upload questions for all subjects' }))
            valid = false
        }
        return valid
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        updateAutomatedUploadTest((prev) => ({ ...prev, quiz: data["post-quiz/get-quiz"].quiz }))
        navigate('/upload/preview')
        if (validateForm()) {
            // console.log('Form submitted')
            // updateAutomatedUploadTest((prev) => ({ ...prev, quiz: data["post-quiz/get-quiz"].quiz }))
            // navigate('/upload/preview')
        }
    }

    useEffect(() => {
        if (automatedUploadTest.name !== "") {
            updateAutomatedUploadTestAlert((prev) => ({ ...prev, name: '' }))
        }
        if (automatedUploadTest.type !== "") {
            updateAutomatedUploadTestAlert((prev) => ({ ...prev, type: '' }))
        }
        if (automatedUploadTest.class !== "") {
            updateAutomatedUploadTestAlert((prev) => ({ ...prev, class: '' }))
        }
        if (automatedUploadTest.quizDuration !== "") {
            updateAutomatedUploadTestAlert((prev) => ({ ...prev, quizDuration: '' }))
        }
        if (automatedUploadTest.type === "Live" && automatedUploadTest.quizEndDateTime !== "") {
            updateAutomatedUploadTestAlert((prev) => ({ ...prev, quizEndDateTime: '' }))
        }
        if (Object.keys(automatedUploadTest.quizFiles).length > 0 && Object.keys(automatedUploadTest.quizFiles).length === subjects[automatedUploadTest.class].length && subjects[automatedUploadTest.class].every((value) => Object.keys(automatedUploadTest.quizFiles).includes(value))) {
            updateAutomatedUploadTestAlert((prev) => ({ ...prev, general: '' }))
        }
    }, [automatedUploadTest.name, automatedUploadTest.type, automatedUploadTest.class, automatedUploadTest.quizDuration, automatedUploadTest.quizEndDateTime, automatedUploadTest.quizFiles])

    // console.log(automatedUploadTest)

    return (
        <form className='card d-grid-cols twelve-columns gap0' id="automated-upload" autoComplete='on' onSubmit={handleSubmit}>
            <div className="card-heading col-12">Test Details</div>
            <hr className="hr-break col-12" />
            <div className='auto-upload-left col-6 d-grid-cols twelve-columns gap1 mv1 pr2'>
                <div className="form-group col-6">
                    <label htmlFor="name">Test Name<span className='mandatory'> *</span></label><br />
                    <input type="text" className="form-input" name="name" id="name" placeholder='Name' value={automatedUploadTest.name} onChange={handleChange} /><br />
                    {automatedUploadTestAlert.name && <div className='alert mthalf'>{automatedUploadTestAlert.name}</div>}
                </div>
                <div className="form-group col-6">
                    <label htmlFor="type">Test Type<span className='mandatory'> *</span></label><br />
                    <OptionsDropdown
                        placeholder='Type'
                        dropOptions={testTypes}
                        nameOfLabel='type'
                        selectedOption={automatedUploadTest.type}
                        handleChange={(value) => updateAutomatedUploadTest((automatedUploadTest) => ({ ...automatedUploadTest, type: value }))}
                    />
                    {automatedUploadTestAlert.type && <div className='alert mthalf'>{automatedUploadTestAlert.type}</div>}
                </div>
                <div className="form-group col-6">
                    <label htmlFor="class">Class<span className='mandatory'> *</span></label><br />
                    <OptionsDropdown
                        placeholder='Class'
                        dropOptions={papers}
                        nameOfLabel='class'
                        selectedOption={automatedUploadTest.class}
                        handleChange={(value) => updateAutomatedUploadTest((automatedUploadTest) => ({ ...automatedUploadTest, class: value }))}
                    />
                    {automatedUploadTestAlert.class && <div className='alert mthalf'>{automatedUploadTestAlert.class}</div>}
                </div>
                <div className="form-group col-6">
                    <label htmlFor="duration">Test Duration<span className='mandatory'> *</span></label><br />
                    <TimePicker
                        getPopupContainer={() => document.getElementById('date-picker-container')}
                        placeholder="Duration"
                        format='HH:mm'
                        onChange={onDurationChange}
                        value={automatedUploadTest.quizDurationObject}
                        name='duration'
                        showNow={false}
                        suffixIcon={null}
                        className='w100 bdr bg-white mthalf'
                    />
                    {automatedUploadTestAlert.quizDuration && <div className='alert mthalf'>{automatedUploadTestAlert.quizDuration}</div>}
                </div>
                <div className="form-group col-6">
                    <label htmlFor="quizStartDateTime">Test Start Time</label><br />
                    <DatePicker
                        getPopupContainer={() => document.getElementById('date-picker-container')}
                        format='DD/MM/YYYY HH:mm'
                        disabledDate={disabledStartDate}
                        disabledTime={disabledStartDateTime}
                        onChange={onStartTimeChange}
                        value={automatedUploadTest.quizStartDateTimeObject}
                        name='quizStartDateTime'
                        showNow={false}
                        showTime={true}
                        suffixIcon={null}
                        className='w100 bdr bg-white mthalf'
                    />
                    {automatedUploadTestAlert.quizStartDateTime && <div className='alert mthalf'>{automatedUploadTestAlert.quizStartDateTime}</div>}
                </div>
                {automatedUploadTest.type === "Live" &&
                    <div className="form-group col-6">
                        <label htmlFor="quizEndDateTime">Test End Time</label><br />
                        <DatePicker
                            getPopupContainer={() => document.getElementById('date-picker-container')}
                            format='DD/MM/YYYY HH:mm'
                            disabledDate={disabledEndDate}
                            disabledTime={disabledEndDateTime}
                            onChange={onEndTimeChange}
                            value={automatedUploadTest.quizEndDateTimeObject}
                            name='quizEndDateTime'
                            showNow={false}
                            showTime={true}
                            suffixIcon={null}
                            className='w100 bdr bg-white mthalf'
                        />
                        {automatedUploadTestAlert.quizEndDateTime && <div className='alert mthalf'>{automatedUploadTestAlert.quizEndDateTime}</div>}
                    </div>}
            </div>
            <div className='col-6 pl2 pv1 d-flex-row justify-center align-center'>
                {automatedUploadTest.class ?
                    <div className='flex-1 d-grid-cols twelve-columns gap1'>
                        {subjects[automatedUploadTest.class].map((subject) => {
                            return (
                                <FileUpload
                                    key={subject}
                                    subject={subject}
                                    filename={automatedUploadTest.quizFiles[subject]?.name}
                                    handleUpload={(e) => handleFileChange(e)}
                                    handleRemove={(subject) => handleDeleteFile(subject)}
                                />
                            )
                        })}
                    </div>
                    : <div className='text-center'>Please select test class first to upload questions</div>}
            </div>
            <div className='col-12 text-right mbhalf d-flex-row justify-end align-center'>
                {automatedUploadTestAlert.general && <div className='flex-1 text-center alert'>{automatedUploadTestAlert.general}</div>}
                <button className='btn' type='submit'>Preview and Upload</button>
            </div>
            <IconSelectModal
                isModalOpen={isModalOpen}
                onOk={handleOnOk}
                onCancel={dismissModal}
                handleSelect={handleIconSelect}
                uploadType="automated"
            />
        </form>
    )
}

export default AutomatedUpload