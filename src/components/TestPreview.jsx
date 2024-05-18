import React, { useContext, useState, useEffect } from 'react'
import '../styles/TestPreview.css'
import { dataContext } from '../contexts/store'
import OptionsDropdown from './OptionsDropdown'
import Questions from './Questions'
import IconSelectModal from './IconSelectModal'
import { initialUploadTest, papers, testTypes, subjects } from '../constants/Constants'
import { DatePicker, TimePicker } from 'antd'
import moment from 'moment'
import { isEqual } from 'lodash'
import { useNavigate } from 'react-router-dom'

const TestPreview = () => {
  const { automatedUploadTest, updateAutomatedUploadTest, automatedUploadTestAlert, updateAutomatedUploadTestAlert } = useContext(dataContext)
  const [selectedSubject, setSelectedSubject] = useState(automatedUploadTest.class ? subjects[automatedUploadTest.class][0] : "")
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

  const onDurationChange = (value, timeString) => {
    updateAutomatedUploadTest((automatedUploadTest) => ({ ...automatedUploadTest, quizDurationObject: value, quizDuration: timeString }))
  }

  const onStartTimeChange = (value, timeString) => {
    updateAutomatedUploadTest((automatedUploadTest) => ({ ...automatedUploadTest, quizStartDateTimeObject: value, quizStartDateTime: timeString }))
  }

  const onEndTimeChange = (value, timeString) => {
    updateAutomatedUploadTest((automatedUploadTest) => ({ ...automatedUploadTest, quizEndDateTimeObject: value, quizEndDateTime: timeString }))
  }

  const selectSubject = (value) => {
    setSelectedSubject(value)
    if (!Object.keys(automatedUploadTest.quiz).includes(value)) {
      updateAutomatedUploadTest((prev) => ({ ...prev, quiz: { ...prev.quiz, [value]: [] } }))
    }
  }

  const addQuestion = () => {
    let newQuiz = { ...automatedUploadTest.quiz }
    newQuiz[selectedSubject] = [
      ...newQuiz[selectedSubject],
      {
        question: "",
        options: ["", "", "", ""],
        answer: ""
      }
    ]
    updateAutomatedUploadTest((prev) => ({ ...prev, quiz: newQuiz }))
  }

  const removeQuestion = (question) => {
    let newQuiz = { ...automatedUploadTest.quiz }
    newQuiz[selectedSubject] = newQuiz[selectedSubject].filter((element) => element !== question)
    updateAutomatedUploadTest((prev) => ({ ...prev, quiz: newQuiz }))
  }

  const handleQuestionChange = (e, questionIndex) => {
    let newQuiz = { ...automatedUploadTest.quiz }
    newQuiz[selectedSubject][questionIndex].question = e.target.value
    updateAutomatedUploadTest((prev) => ({ ...prev, quiz: newQuiz }))
  }

  const handleOptionChange = (e, questionIndex, optionIndex) => {
    let newQuiz = { ...automatedUploadTest.quiz }
    newQuiz[selectedSubject][questionIndex].options[optionIndex] = e.target.value
    updateAutomatedUploadTest((prev) => ({ ...prev, quiz: newQuiz }))
  }

  const handleSelectAnswer = (questionIndex, option) => {
    let newQuiz = { ...automatedUploadTest.quiz }
    newQuiz[selectedSubject][questionIndex].answer = option
    updateAutomatedUploadTest((prev) => ({ ...prev, quiz: newQuiz }))
  }

  const addOption = (questionIndex) => {
    let newQuiz = { ...automatedUploadTest.quiz }
    newQuiz[selectedSubject][questionIndex].options = [...newQuiz[selectedSubject][questionIndex].options, '']
    updateAutomatedUploadTest((prev) => ({ ...prev, quiz: newQuiz }))
  }

  const removeOption = (questionIndex, optionIndex) => {
    let newQuiz = { ...automatedUploadTest.quiz }
    newQuiz[selectedSubject][questionIndex].options.splice(optionIndex, 1)
    updateAutomatedUploadTest((prev) => ({ ...prev, quiz: newQuiz }))
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

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      // console.log('Form submitted')
      setIsModalOpen(true)
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
    if (automatedUploadTest.quizDuration === "" || automatedUploadTest.quizDuration === "00:00") {
      updateAutomatedUploadTestAlert((prev) => ({ ...prev, quizDuration: 'Please select a valid test duration' }))
      valid = false
    }
    if (automatedUploadTest.type === "Live" && automatedUploadTest.quizEndDateTime === "") {
      updateAutomatedUploadTestAlert((prev) => ({ ...prev, quizEndDateTime: 'Please select test end time' }))
      valid = false
    }
    if (Object.keys(automatedUploadTest.quiz).length !== subjects[automatedUploadTest.class].length || !subjects[automatedUploadTest.class].every((value) => Object.keys(automatedUploadTest.quiz).includes(value)) || !Object.values(automatedUploadTest.quiz).every((value) => value.length > 0)) {
      updateAutomatedUploadTestAlert((prev) => ({ ...prev, general: 'Please upload at least one question for all subjects' }))
      valid = false
      return valid
    }
    if (Object.values(automatedUploadTest.quiz).some((value) => value.some((question) => question.question === ""))) {
      updateAutomatedUploadTestAlert((prev) => ({ ...prev, general: 'No question can be left empty' }))
      valid = false
      return valid
    }
    if (Object.values(automatedUploadTest.quiz).some((value) => value.some((question) => question.options.filter((option) => option !== "").length < 2))) {
      updateAutomatedUploadTestAlert((prev) => ({ ...prev, general: 'Each question must have at least two valid options' }))
      valid = false
      return valid
    }
    if (Object.values(automatedUploadTest.quiz).some((value) => value.some((question) => question.answer === "" || !question.options.includes(question.answer)))) {
      updateAutomatedUploadTestAlert((prev) => ({ ...prev, general: 'Each question must have a valid correct answer' }))
      valid = false
    }
    return valid
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
    if (automatedUploadTest.quizDuration !== "" && automatedUploadTest.quizDuration !== "00:00") {
      updateAutomatedUploadTestAlert((prev) => ({ ...prev, quizDuration: '' }))
    }
    if (automatedUploadTest.type === "Live" && automatedUploadTest.quizEndDateTime !== "") {
      updateAutomatedUploadTestAlert((prev) => ({ ...prev, quizEndDateTime: '' }))
    }
    if (Object.keys(automatedUploadTest.quiz).length > 0 && Object.keys(automatedUploadTest.quiz).length === subjects[automatedUploadTest.class].length && subjects[automatedUploadTest.class].every((value) => Object.keys(automatedUploadTest.quiz).includes(value)) && Object.values(automatedUploadTest.quiz).every((value) => value.length > 0)) {
      updateAutomatedUploadTestAlert((prev) => ({ ...prev, general: '' }))
    }
    if (Object.values(automatedUploadTest.quiz).every((value) => value.every((question) => question.question !== ""))) {
      updateAutomatedUploadTestAlert((prev) => ({ ...prev, general: '' }))
    }
    if (Object.values(automatedUploadTest.quiz).every((value) => value.every((question) => question.options.filter((option) => option !== "").length >= 2))) {
      updateAutomatedUploadTestAlert((prev) => ({ ...prev, general: '' }))
    }
    if (Object.values(automatedUploadTest.quiz).every((value) => value.every((question) => question.answer !== "" && question.options.includes(question.answer)))) {
      updateAutomatedUploadTestAlert((prev) => ({ ...prev, general: '' }))
    }
  }, [automatedUploadTest.name, automatedUploadTest.type, automatedUploadTest.class, automatedUploadTest.quizDuration, automatedUploadTest.quizEndDateTime, automatedUploadTest.quiz])

  // console.log(automatedUploadTest)

  return (
    !isEqual(initialUploadTest, automatedUploadTest) ? <>
      <h1 className='page-heading fxlarge fbolder mb1'>Preview</h1>
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
              value={automatedUploadTest.name}
              onChange={handleChange}
            />
            <br />
            {automatedUploadTestAlert.name && <div className='alert mthalf'>{automatedUploadTestAlert.name}</div>}
          </div>
          <div className="form-group col-4">
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
          <div className="form-group col-4">
            <label htmlFor="class">Class<span className='mandatory'> *</span></label><br />
            <OptionsDropdown
              placeholder='Class'
              dropOptions={papers}
              nameOfLabel='class'
              selectedOption={automatedUploadTest.class}
              disabled={true}
              handleChange={(value) => updateAutomatedUploadTest((automatedUploadTest) => ({ ...automatedUploadTest, class: value }))}
            />
            {automatedUploadTestAlert.class && <div className='alert mthalf'>{automatedUploadTestAlert.class}</div>}
          </div>
          <div className="form-group col-4">
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
          <div className="form-group col-4">
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
          <div className="form-group col-4">
            {automatedUploadTest.type === "Live" &&
              <>
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
              </>
            }
          </div>
          <div className="form-group col-4">
            <label htmlFor="selected-subject">Subject</label><br />
            <OptionsDropdown
              placeholder={automatedUploadTest.class ? '' : 'Please select class first'}
              dropOptions={automatedUploadTest.class ? subjects[automatedUploadTest.class] : []}
              nameOfLabel='selected-subject'
              selectedOption={selectedSubject}
              handleChange={(value) => selectSubject(value)}
            />
          </div>
        </div>
        {selectedSubject &&
          (automatedUploadTest.quiz[selectedSubject]?.length > 0 ? (
            <Questions
              questions={automatedUploadTest.quiz[selectedSubject]}
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
          ))}
        {!selectedSubject && (
          <div className='text-center mv2'>
            Please select a subject to see questions
          </div>
        )}
        <div className='text-right mvhalf d-flex-row justify-end align-center'>
          {automatedUploadTestAlert.general && <div className='flex-1 text-center alert'>{automatedUploadTestAlert.general}</div>}
          {selectedSubject && <button className='btn mr1' type='button' onClick={addQuestion}>Add Question</button>}
          <button className='btn' type='submit'>Upload</button>
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
    : navigate('/upload')
  )
}

export default TestPreview