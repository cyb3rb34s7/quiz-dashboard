import React, { useState } from 'react'
import '../../styles/StudentProfile.css'
import { useLocation } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import ProfileCard from '../../components/ProfileCard'
import BarGraph from '../../components/BarGraph'
import LineGraph from '../../components/LineGraph'
import Card from '../../components/Card'
import NoData from '../../components/NoData'
import HandlerButtons from '../../components/HandlerButtons'
import { barChartHeight } from '../../constants/Constants'

const itemsPerView = 3

const StudentProfile = () => {
  const location = useLocation()
  const largeScreen = useMediaQuery({ query: '(min-width: 1200px)' })
  const subjects = location.state['Subject-wise Performance'] ? Object.keys(location.state['Subject-wise Performance']) : []
  const [currentSubject, setCurrentSubject] = useState(subjects.length > 0 ? subjects[0] : null)
  const [visibleItems, setVisibleItems] = useState(itemsPerView)

  const showMore = () => {
    setVisibleItems(visibleItems + itemsPerView)
  }

  const showLess = () => {
    setVisibleItems(itemsPerView)
  }

  return (
    <div className='student-profile'>
      <h1 className='page-heading fxlarge fbolder mb1'>{location.state.Name}</h1>
      <ProfileCard data={location.state} requiredKeys={["Name", "Email", "Phone", "Academy", "Subjects", "Total Score"]} logo='raja.jpg' />
      {subjects.length > 0 &&
        <div className={`card subjects-navbar d-flex-row justify-sb mt1`}>
          {subjects.includes('CS EET') && <div className='card-body-element cp ph1' onClick={() => setCurrentSubject('CS EET')}>
            <div className='text-center pthalf pb1'>CS EET</div>
            {currentSubject === 'CS EET' && <hr className="hr-break mt" />}
          </div>}
          {subjects.includes('CS Executive') && <div className='card-body-element cp ph1' onClick={() => setCurrentSubject('CS Executive')}>
            <div className='text-center pthalf pb1'>CS Executive</div>
            {currentSubject === 'CS Executive' && <hr className="hr-break mt1" />}
          </div>}
          {subjects.includes('CS Professional') && <div className='card-body-element cp ph1' onClick={() => setCurrentSubject('CS Professional')}>
            <div className='text-center pthalf pb1'>CS Professional</div>
            {currentSubject === 'CS Professional' && <hr className="hr-break mt" />}
          </div>}
        </div>}
      <div className='d-grid-cols gap1 mt1 twelve-columns'>
        {subjects.length > 0 ?
          <BarGraph
            span={4}
            title="Subject-wise Performance"
            data={Object.entries(location.state['Subject-wise Performance'][currentSubject]).map(([name, value]) => ({
              Subject: name,
              Percentage: value
            }))}
            dataKeyY='Subject'
            dataKeyX='Percentage'
            chartHeight={barChartHeight[currentSubject]}
          />
          : <NoData span={4} title='Subject-wise Performance' />}
        {location.state['Last Five Quiz Scores'] ?
          <LineGraph
            span={8}
            title="Last Five Quiz Performance"
            data={Object.keys(location.state['Last Five Quiz Scores']).map((quiz) => {
              return { quiz: quiz, Percentage: location.state['Last Five Quiz Scores'][quiz] }
            })}
            dataKeyX='quiz'
            chartHeight={barChartHeight[currentSubject]}
          />
          : <NoData span={8} title='Last Five Quiz Performance' />}
      </div>
      {location.state.Quizzes?.length > 0 &&
        <>
          <h3 className='mt1 text-secondary'>Tests</h3>
          <div className="test-cards d-grid-cols gap1 twelve-columns pv1">
            {location.state['Quizzes'].slice(0, visibleItems).map((item) =>
              <div key={item.quizID} className={`col-${largeScreen ? 4 : 6}`}>
                <Card
                  data={["Name", "Subject", "Score"].map((key) => ({ label: key, value: item[key] }))}
                  logo={item.quizIcon}
                />
              </div>)}
          </div>
          <HandlerButtons
            cardArray={location.state.Quizzes}
            itemsPerView={itemsPerView}
            visibleItems={visibleItems}
            onViewLess={showLess}
            onViewMore={showMore}
          />
        </>}
    </div>
  )
}

export default StudentProfile