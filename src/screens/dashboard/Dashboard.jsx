import React, { useEffect, useState } from 'react'
import '../../styles/Dashboard.css'
import TallyCard from '../../components/TallyCard'
import data from '../../../api.json'
import BarGraph from '../../components/BarGraph'
import LineGraph from '../../components/LineGraph'
import QuizCalendar from '../../components/QuizCalendar'
import Leaderboard from '../../components/Leaderboard'
import NoData from '../../components/NoData'
import { barChartHeight } from '../../constants/Constants'
import { getStudents } from '../../services/Students'

const Dashboard = () => {
  const [currentSubject, setCurrentSubject] = useState('CS EET')
useEffect(() => {
const response = getStudents()
console.log(response)
},[])
  return (
    <>
      <h1 className='page-heading fxlarge fbolder mb1'>Dashboard</h1>
      <div className="dashboard d-grid-cols gap1 twelve-columns">
        <TallyCard
          span={4}
          heading='Total Students'
          body={data['get-dashboard-data'].totalStudents}
        />
        {data['get-dashboard-data'].averagePerformance && Object.keys(data['get-dashboard-data'].averagePerformance)?.length > 0 ?
        <div className="card performance-card col-4">
          <div className="card-heading">Average Performance</div>
          <hr className="hr-break" />
          <div className="card-body pv1">
            {Object.keys(data['get-dashboard-data'].averagePerformance).map((academy) => {
              return (
                <div className="body-element pvhalf d-flex-row" key={academy}>
                  <label className='label-primary'>{academy}</label>
                  <span className='progress-container d-flex-row align-center'>
                    <span className='bar-container d-flex-row align-center ph1'>
                      <progress className="progress-bar w100" value={Math.round(data['get-dashboard-data']['averagePerformance'][academy].percentage)} max="100"></progress>
                    </span>
                    <span className='performance-value fbold'>{Math.round(data['get-dashboard-data']['averagePerformance'][academy].percentage)}</span>
                    <span>%</span>
                  </span>
                </div>
              )
            })}
          </div>
        </div>
        : <NoData span={4} title='Average Performance' />}
        <TallyCard
          span={4}
          heading='Subject-wise Cutoff Clearances'
          body={data['get-dashboard-data'].cutOffsCleared}
        />
        <div className='card subjects-navbar col-4 d-flex-row justify-sb'>
          <div className='card-body-element cp ph1' onClick={() => setCurrentSubject('CS EET')}>
            <div className='text-center pthalf pb1'>CS EET</div>
            {currentSubject === 'CS EET' && <hr className="hr-break mt" />}
          </div>
          <div className='card-body-element cp ph1' onClick={() => setCurrentSubject('CS Executive')}>
            <div className='text-center pthalf pb1'>CS Executive</div>
            {currentSubject === 'CS Executive' && <hr className="hr-break mt1" />}
          </div>
          <div className='card-body-element cp ph1' onClick={() => setCurrentSubject('CS Professional')}>
            <div className='text-center pthalf pb1'>CS Professional</div>
            {currentSubject === 'CS Professional' && <hr className="hr-break mt" />}
          </div>
        </div>
        <div className='col-8'></div>
        {data['get-dashboard-data'].subjectPerformance?.[currentSubject] && Object.entries(data['get-dashboard-data'].subjectPerformance[currentSubject])?.length > 0 ?
          <BarGraph
            span={4}
            title="Subject-wise Performance"
            data={Object.entries(data['get-dashboard-data'].subjectPerformance[currentSubject]).map(([name, value]) => ({
              Subject: name,
              Percentage: value
            }))}
            dataKeyY='Subject'
            dataKeyX='Percentage'
            chartHeight={barChartHeight[currentSubject]}
          />
          : <NoData span={4} title='Subject-wise Performance' />}
        {
          data['get-dashboard-data'].quizPerformances && Object.keys(data['get-dashboard-data'].quizPerformances)?.length > 0 ?
            <LineGraph
              span={8}
              title="Teacher-wise Average Performance of Students"
              data={Object.keys(data['get-dashboard-data'].quizPerformances).map((quiz) => {
                return { quiz: quiz, ...data['get-dashboard-data'].quizPerformances[quiz] }
              })}
              dataKeyX='quiz'
              chartHeight={barChartHeight[currentSubject]}
            />
            : <NoData span={8} title='Teacher-wise Average Performance of Students' />
        }
        <QuizCalendar />
        {
          data['get-dashboard-data'].leaderboard['CS EET']?.length > 0 ?
            <Leaderboard span={3} data={data['get-dashboard-data'].leaderboard['CS EET']} subject='CS EET' />
            : <NoData span={3} title='Leaderboard' subTitle='CS EET' />
        }
        {
          data['get-dashboard-data'].leaderboard['CS Executive']?.length > 0 ?
            <Leaderboard span={3} data={data['get-dashboard-data'].leaderboard['CS Executive']} subject='CS Executive' />
            : <NoData span={3} title='Leaderboard' subTitle='CS Executive' />
        }
        {
          data['get-dashboard-data'].leaderboard['CS Professional']?.length > 0 ?
            <Leaderboard span={3} data={data['get-dashboard-data'].leaderboard['CS Professional']} subject='CS Professional' />
            : <NoData span={3} title='Leaderboard' subTitle='CS Professional' />
        }
      </div>
    </>
  )
}

export default Dashboard