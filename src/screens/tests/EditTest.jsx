import React, { useContext, useState, useEffect } from 'react'
import '../../styles/EditTest.css'
import { dataContext } from '../../contexts/store'
import OptionsDropdown from '../../components/OptionsDropdown'
import Questions from '../../components/Questions'
import IconSelectModal from '../../components/IconSelectModal'
import { papers, testTypes, subjects } from '../../constants/Constants'
import { DatePicker, TimePicker } from 'antd'
import moment from 'moment'
import { useLocation, useNavigate } from 'react-router-dom'
import { getQuizById } from '../../services/Quiz'

const EditTest = () => {
  const { editTest, updateEditTest, editTestAlert, updateEditTestAlert } = useContext(dataContext)

  const [selectedSubject, setSelectedSubject] = useState(editTest.class)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [quizData, setQuizData] = useState([])
  const navigate = useNavigate()
  const location = useLocation();
  const getQuizDetails = async(id) => {
    const quizInformation =  await getQuizById(id)
    setQuizData(quizInformation)
    updateEditTest((editTest) => ({ ...editTest, quizInformation }))
  }
  useEffect(() => {
    getQuizDetails(location.state._id)
  },[location])
  const range = (start, end) => {
    const result = []
    for (let i = start; i < end; i++) {
      result.push(i)
    }
    return result
  }

  const disabledStartDate = (current) => {
    return current && current < moment()-1
  }

  const disabledEndDate = (current) => {
    return current && (editTest.quizStartDateTimeObject ? current < moment(new Date(editTest.quizStartDateTimeObject)) : current < moment())
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
    let comparableDateObject = editTest.quizStartDateTimeObject ? new Date(editTest.quizStartDateTimeObject) : new Date()
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
    updateEditTest((editTest) => ({ ...editTest, [e.target.name]: e.target.value }))
  }

  const onDurationChange = (value, timeString) => {
    updateEditTest((editTest) => ({ ...editTest, quizDurationObject: value, quizDuration: timeString }))
  }

  const onStartTimeChange = (value, timeString) => {
    updateEditTest((editTest) => ({ ...editTest, quizStartDateTimeObject: value, quizStartDateTime: timeString }))
  }

  const onEndTimeChange = (value, timeString) => {
    updateEditTest((editTest) => ({ ...editTest, quizEndDateTimeObject: value, quizEndDateTime: timeString }))
  }

  const selectSubject = (value) => {
    setSelectedSubject(value)
    if (!Object.keys(editTest.quiz).includes(value)) {
      updateEditTest((prev) => ({ ...prev, quiz: { ...prev.quiz, [value]: [] } }))
    }
  }


  const addQuestion = () => {
    let newQuiz = { ...editTest.quiz }
    newQuiz[selectedSubject] = 
        [
        ...newQuiz[selectedSubject],
        {
            question: "",
            options: ["", "", "", ""],
            answer: ""
        }
    ]
    updateEditTest((prev) => ({ ...prev, quiz: newQuiz }))
}

  const removeQuestion = (question) => {
    let newQuiz = { ...editTest.quiz }
    newQuiz[selectedSubject] = newQuiz[selectedSubject].filter((element) => element !== question)
    updateEditTest((prev) => ({ ...prev, quiz: newQuiz }))
  }

  const handleQuestionChange = (e, questionIndex) => {
    let newQuiz = { ...editTest.quiz }
    newQuiz[selectedSubject][questionIndex].question = e.target.value
    updateEditTest((prev) => ({ ...prev, quiz: newQuiz }))
  }

  const handleOptionChange = (e, questionIndex, optionIndex) => {
    let newQuiz = { ...editTest.quiz }
    newQuiz[selectedSubject][questionIndex].options[optionIndex] = e.target.value
    updateEditTest((prev) => ({ ...prev, quiz: newQuiz }))
  }

  const handleSelectAnswer = (questionIndex, option) => {
    let newQuiz = { ...editTest.quiz }
    newQuiz[selectedSubject][questionIndex].answer = option
    updateEditTest((prev) => ({ ...prev, quiz: newQuiz }))
  }

  const addOption = (questionIndex) => {
    let newQuiz = { ...editTest.quiz }
    newQuiz[selectedSubject][questionIndex].options = [...newQuiz[selectedSubject][questionIndex].options, '']
    updateEditTest((prev) => ({ ...prev, quiz: newQuiz }))
  }

  const removeOption = (questionIndex, optionIndex) => {
    let newQuiz = { ...editTest.quiz }
    newQuiz[selectedSubject][questionIndex].options.splice(optionIndex, 1)
    updateEditTest((prev) => ({ ...prev, quiz: newQuiz }))
  }

  const dismissModal = () => {
    updateEditTestAlert((prev) => ({ ...prev, quizIcon: '' }))
    setIsModalOpen(false)
  }

  const handleIconSelect = (selectedIcon) => {
    updateEditTest((editTest) => ({ ...editTest, quizIcon: selectedIcon }))
  }

  const handleOnOk = () => {
    if (editTest.quizIcon === "") {
      updateEditTestAlert((prev) => ({ ...prev, quizIcon: 'Please select an icon' }))
    } else {
      dismissModal()
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      setIsModalOpen(true)
    }
  }

  const validateForm = () => {
    let valid = true
    if (editTest.name === "") {
      updateEditTestAlert((prev) => ({ ...prev, name: 'Please enter test name' }))
      valid = false
    }
    if (editTest.type === "") {
      updateEditTestAlert((prev) => ({ ...prev, type: 'Please select test type' }))
      valid = false
    }
    if (editTest.class === "") {
      updateEditTestAlert((prev) => ({ ...prev, class: 'Please select test class' }))
      valid = false
    }
    if (editTest.quizDuration === "" || editTest.quizDuration === "00:00") {
      updateEditTestAlert((prev) => ({ ...prev, quizDuration: 'Please select a valid test duration' }))
      valid = false
    }
    if (editTest.type === "Live" && editTest.quizEndDateTime === "") {
      updateEditTestAlert((prev) => ({ ...prev, quizEndDateTime: 'Please select test end time' }))
      valid = false
    }
    if (Object.keys(editTest.quiz).length !== subjects[editTest.class].length || !subjects[editTest.class].every((value) => Object.keys(editTest.quiz).includes(value)) || !Object.values(editTest.quiz).every((value) => value.length > 0)) {
      updateEditTestAlert((prev) => ({ ...prev, general: 'Please upload at least one question for all subjects' }))
      valid = false
      return valid
    }
    if (Object.values(editTest.quiz).some((value) => value.some((question) => question.question === ""))) {
      updateEditTestAlert((prev) => ({ ...prev, general: 'No question can be left empty' }))
      valid = false
      return valid
    }
    if (Object.values(editTest.quiz).some((value) => value.some((question) => question.options.filter((option) => option !== "").length < 2))) {
      updateEditTestAlert((prev) => ({ ...prev, general: 'Each question must have at least two valid options' }))
      valid = false
      return valid
    }
    if (Object.values(editTest.quiz).some((value) => value.some((question) => question.answer === "" || !question.options.includes(question.answer)))) {
      updateEditTestAlert((prev) => ({ ...prev, general: 'Each question must have a valid correct answer' }))
      valid = false
    }
    return valid
  }

  useEffect(() => {
    if (editTest.name !== "") {
      updateEditTestAlert((prev) => ({ ...prev, name: '' }))
    }
    if (editTest.type !== "") {
      updateEditTestAlert((prev) => ({ ...prev, type: '' }))
    }
    if (editTest.class !== "") {
      updateEditTestAlert((prev) => ({ ...prev, class: '' }))
    }
    if (editTest.quizDuration !== "" && editTest.quizDuration !== "00:00") {
      updateEditTestAlert((prev) => ({ ...prev, quizDuration: '' }))
    }
    if (editTest.type === "Live" && editTest.quizEndDateTime !== "") {
      updateEditTestAlert((prev) => ({ ...prev, quizEndDateTime: '' }))
    }
    // if (Object.keys(editTest.quiz).length > 0 && Object.keys(editTest.quiz).length === subjects[editTest.class].length && subjects[editTest.class].every((value) => Object.keys(editTest.quiz).includes(value)) && Object.values(editTest.quiz).every((value) => value.length > 0)) {
    //   updateEditTestAlert((prev) => ({ ...prev, general: '' }))
    // }
    // if (Object.values(editTest.quiz).every((value) => value.every((question) => question.question !== ""))) {
    //   updateEditTestAlert((prev) => ({ ...prev, general: '' }))
    // }
    // if (Object.values(editTest.quiz).every((value) => value.every((question) => question.options.filter((option) => option !== "").length >= 2))) {
    //   updateEditTestAlert((prev) => ({ ...prev, general: '' }))
    // }
    // if (Object.values(editTest.quiz).every((value) => value.every((question) => question.answer !== "" && question.options.includes(question.answer)))) {
    //   updateEditTestAlert((prev) => ({ ...prev, general: '' }))
    // }
  }, [editTest.name, editTest.type, editTest.class, editTest.quizDuration, editTest.quizEndDateTime, editTest.quiz])

  return (
    editTest.quizID ? <>
      <h1 className='page-heading fxlarge fbolder mb1'>Edit Test</h1>
      <form className='card' id="manual-upload" autoComplete='on' onSubmit={handleSubmit}>
        <div className="card-heading">Test Details</div>
        <hr className="hr-break" />
        <div className='manual-upload-details d-grid-cols twelve-columns gap1 mv1'>
          <div className="form-group col-4">
            <label htmlFor="name">Test Name<span className='mandatory'> *</span></label><br />
            <input
              type="text"
              className="form-input"
              name="name"
              id="name"
              placeholder='Name'
              value={editTest.name}
              onChange={handleChange}
            />
            <br />
            {editTestAlert.name && <div className='alert mthalf'>{editTestAlert.name}</div>}
          </div>
          <div className="form-group col-4">
            <label htmlFor="type">Test Type<span className='mandatory'> *</span></label><br />
            <OptionsDropdown
              placeholder='Type'
              dropOptions={testTypes}
              nameOfLabel='type'
              selectedOption={editTest.type}
              handleChange={(value) => updateEditTest((editTest) => ({ ...editTest, type: value }))}
            />
            {editTestAlert.type && <div className='alert mthalf'>{editTestAlert.type}</div>}
          </div>
          <div className="form-group col-4">
            <label htmlFor="class">Class<span className='mandatory'> *</span></label><br />
            <OptionsDropdown
              placeholder='Class'
              dropOptions={papers}
              nameOfLabel='class'
              selectedOption={editTest.class}
              disabled={true}
              handleChange={(value) => updateEditTest((editTest) => ({ ...editTest, class: value }))}
            />
            {editTestAlert.class && <div className='alert mthalf'>{editTestAlert.class}</div>}
          </div>
          <div className="form-group col-4">
            <label htmlFor="duration">Test Duration<span className='mandatory'> *</span></label><br />
            <TimePicker
              getPopupContainer={() => document.getElementById('date-picker-container')}
              placeholder="Duration"
              format='HH:mm'
              onChange={onDurationChange}
              value={editTest.quizDurationObject}
              name='duration'
              showNow={false}
              suffixIcon={null}
              className='w100 bdr bg-white mthalf'
            />
            {editTestAlert.quizDuration && <div className='alert mthalf'>{editTestAlert.quizDuration}</div>}
          </div>
          <div className="form-group col-4">
            <label htmlFor="quizStartDateTime">Test Start Time</label><br />
            <DatePicker
              getPopupContainer={() => document.getElementById('date-picker-container')}
              format='DD/MM/YYYY HH:mm'
              disabledDate={disabledStartDate}
              disabledTime={disabledStartDateTime}
              onChange={onStartTimeChange}
              value={editTest.quizStartDateTimeObject}
              name='quizStartDateTime'
              showNow={false}
              showTime={true}
              suffixIcon={null}
              disabled
              className='w100 bdr bg-white mthalf'
            />
            {editTestAlert.quizStartDateTime && <div className='alert mthalf'>{editTestAlert.quizStartDateTime}</div>}
          </div>
          <div className="form-group col-4">
            {editTest.type === "Live" &&
              <>
                <label htmlFor="quizEndDateTime">Test End Time</label><br />
                <DatePicker
                  getPopupContainer={() => document.getElementById('date-picker-container')}
                  format='DD/MM/YYYY HH:mm'
                  disabledDate={disabledEndDate}
                  disabledTime={disabledEndDateTime}
                  onChange={onEndTimeChange}
                  value={editTest.quizEndDateTimeObject}
                  name='quizEndDateTime'
                  showNow={false}
                  showTime={true}
                  suffixIcon={null}
                  disabled={editTest.quizEndDateTimeObject ? moment(new Date(editTest.quizEndDateTimeObject)).isBefore(moment()) : false}
                  className='w100 bdr bg-white mthalf'
                />
                {editTestAlert.quizEndDateTime && <div className='alert mthalf'>{editTestAlert.quizEndDateTime}</div>}
              </>
            }
          </div>
          <div className="form-group col-4">
            <label htmlFor="selected-subject">Subject</label><br />
            <OptionsDropdown
              placeholder={editTest.class ? '' : 'Please select class first'}
              dropOptions={editTest.class ? subjects[editTest.class] : []}
              nameOfLabel='selected-subject'
              selectedOption={selectedSubject}
              handleChange={(value) => selectSubject(value)}
            />
          </div>
        </div>
        {editTest.quiz ? (
            <Questions
              questions={editTest.quiz}
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
        {/* {!selectedSubject && (
          <div className='text-center mv2'>
            Please select a subject to see questions
          </div>
        )} */}
        <div className='text-right mvhalf d-flex-row justify-end align-center'>
          {editTestAlert.general && <div className='flex-1 text-center alert'>{editTestAlert.general}</div>}
          {selectedSubject && <button className='btn mr1' type='button' onClick={addQuestion}>Add Question</button>}
          <button className='btn' type='submit'>Save</button>
        </div>
        <IconSelectModal
          isModalOpen={isModalOpen}
          onOk={handleOnOk}
          onCancel={dismissModal}
          handleSelect={handleIconSelect}
          uploadType="manual"
        />
      </form>
    </>
      : navigate('/tests')
  )
}

export default EditTest