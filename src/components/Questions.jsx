import React, { useContext, useState } from 'react'
import '../styles/Questions.css'
import { colors } from '../constants/Constants'
import HandlerButtons from './HandlerButtons'

const itemsPerView = 10

const Questions = ({ questions, removeQuestion, handleQuestionChange, handleOptionChange, handleSelectAnswer, addOption, removeOption }) => {
    const [visibleItems, setVisibleItems] = useState(itemsPerView)
    // console.log(questions)
    const showMore = () => {
        setVisibleItems(visibleItems + itemsPerView)
    }
      
      const transformedResponse = Object.entries(questions).flatMap(([id, items]) =>
        items.map(item => ({ id, ...item }))
      );
      console.log(transformedResponse)
      
    //   console.log(transformedResponse);
      
    const showLess = () => {
        setVisibleItems(itemsPerView)
    }

    return (
        <div className='transformedResponse phhalf'>
            {transformedResponse.slice(0, visibleItems).map((question, questionIndex) => (
                <div className='mvhalf' key={questionIndex}>
                    <div className='question-container d-flex-col justify-sb'>
                        <div className='d-flex-row justify-sb align-center'>
                            <label htmlFor={`question-${questionIndex}`}>Question {questionIndex + 1} ({question.id})</label>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"
                                fill={colors.quaternaryTextColor}
                                className='remove-icon br5 cp'
                                style={{ background: 'red' }}
                                
                                onClick={() =>  removeQuestion(question)}
                            >
                                {/* {console.log(question)} */}
                                <path d="m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z" />
                            </svg>
                        </div>
                        <textarea
                            className="form-input-ta"
                            type="text"
                            id={`question-${questionIndex}`}
                            name={`question-${questionIndex}`}
                            rows={4}
                            value={question.question}
                            onChange={(e) => handleQuestionChange(e, questionIndex)}
                        />
                    </div>
                    {/* {console.log(transformedResponse)} */}
                    <div className="options-container-outer d-flex-row justify-sb align-center">
                        {transformedResponse[questionIndex].options.map((option, optionIndex) => (
                            <div className='option-container-inner d-flex-row align-center' key={optionIndex}>
                                <div className='ps-relative flex-1 mvhalf'>
                                    <input
                                        className="form-input-opn"
                                        type="text"
                                        id={`option-${questionIndex}-${optionIndex}`}
                                        name={`option-${questionIndex}-${optionIndex}`}
                                        value={option}
                                        onChange={(e) => handleOptionChange(e, questionIndex, optionIndex)}
                                    />
                                    <input
                                        className="form-input-ro"
                                        type="radio"
                                        id={`correct-${questionIndex}-${optionIndex}`}
                                        name={`correct-${questionIndex}`}
                                        value={`option-${questionIndex}-${optionIndex}`}
                                        checked={transformedResponse[questionIndex].answer !== "" && transformedResponse[questionIndex].answer === option}
                                        onChange={() => handleSelectAnswer(questionIndex, option)}
                                    />
                                </div>
                                {transformedResponse[questionIndex].options.length > 2 &&
                                    <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"
                                        fill='red'
                                        className='cp mhhalf'
                                        onClick={() => removeOption(questionIndex, optionIndex)}
                                    >
                                        <path d="M293-424h374v-113H293v113ZM480.276-72q-85.183 0-159.329-31.847t-129.713-87.512q-55.567-55.666-87.4-129.699Q72-395.091 72-480.458q0-85.449 31.847-159.095t87.512-129.213q55.666-55.567 129.699-87.4Q395.091-888 480.458-888q85.449 0 159.095 31.847 73.646 31.846 129.213 87.512 55.567 55.666 87.4 129.465Q888-565.377 888-480.276q0 85.183-31.847 159.329-31.846 74.146-87.512 129.713-55.666 55.567-129.465 87.4Q565.377-72 480.276-72ZM480-185q123.5 0 209.25-85.75T775-480q0-123.5-85.75-209.25T480-775q-123.5 0-209.25 85.75T185-480q0 123.5 85.75 209.25T480-185Zm0-295Z" />
                                    </svg>}
                            </div>
                        ))}
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"
                            fill={colors.quaternaryTextColor}
                            className='add-icon option-add-icon br5 cp'
                            style={{ background: colors.noGradientBackgroundColor }}
                            onClick={() => addOption(questionIndex)}
                        >
                            <path d="M450-450H200v-60h250v-250h60v250h250v60H510v250h-60v-250Z" />
                        </svg>
                    </div>
                </div>
            ))}
            <HandlerButtons
                cardArray={transformedResponse}
                itemsPerView={itemsPerView}
                visibleItems={visibleItems}
                onViewLess={showLess}
                onViewMore={showMore}
            />
        </div>
    )
}

export default Questions