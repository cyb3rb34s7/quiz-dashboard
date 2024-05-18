import React, { useState, useContext } from 'react'
import '../../styles/Profile.css'
import { dataContext } from '../../contexts/store'
import { useMediaQuery } from 'react-responsive'
import MyProfileCard from '../../components/MyProfileCard'
import BarGraph from '../../components/BarGraph'
import LineGraph from '../../components/LineGraph'
import Card from '../../components/Card'
import NoData from '../../components/NoData'
import { barChartHeight } from '../../constants/Constants'
import HandlerButtons from '../../components/HandlerButtons'
import { useSelector } from 'react-redux'

const itemsPerView = 3

const Profile = () => {
  const { teacherInfo}  = useSelector((state) => state.teacher)
  
  const { me } = useContext(dataContext)

  const largeScreen = useMediaQuery({ query: '(min-width: 1200px)' })
  const [visibleItems, setVisibleItems] = useState(itemsPerView)
  const [editMode, setEditMode] = useState(false)

  const showMore = () => {
    setVisibleItems(visibleItems + itemsPerView)
  }

  const showLess = () => {
    setVisibleItems(itemsPerView)
  }

  return (
    <div className='my-profile'>
      <h1 className='page-heading fxlarge fbolder mb1'>{teacherInfo.first_name} {teacherInfo.last_name}</h1>
      <MyProfileCard
        editMode={editMode}
        handleEdit={(value) => setEditMode(value)}
      />
      <div className='d-grid-cols gap1 mt1 twelve-columns'>
        {me['Subject-wise Performance'] ?
          <BarGraph
            span={4}
            title="Subject-wise Performance"
            data={Object.entries(me['Subject-wise Performance']).map(([name, value]) => ({
              Subject: name,
              Percentage: value
            }))}
            dataKeyY='Subject'
            dataKeyX='Percentage'
            chartHeight={barChartHeight['CS Professional']}
          />
          : <NoData span={4} title='Subject-wise Performance' />}
        {me['Last Five Quiz Performances of Students'] ?
          <LineGraph
            span={8}
            title="Last Five Quiz Performances of Students"
            data={Object.keys(me['Last Five Quiz Performances of Students']).map((quiz) => {
              return { quiz: quiz, Percentage: me['Last Five Quiz Performances of Students'][quiz] }
            })}
            dataKeyX='quiz'
            chartHeight={barChartHeight['CS Professional']}
          />
          : <NoData span={8} title='Last Five Quiz Performances of Students' />}
      </div>
      {me.students?.length > 0 &&
        <>
          <h3 className='mt1 text-secondary'>Students</h3>
          <div className="test-cards d-grid-cols gap1 twelve-columns pv1">
            {me.students.slice(0, visibleItems).map((item) =>
              <div key={item.id} className={`col-${largeScreen ? 4 : 6}`}>
                <Card
                  data={["Name", "Subjects", "Total Score"].map((key) => ({ label: key, value: key === "Subjects" ? item[key].join(", ") : item[key] }))}
                  logo='raja.jpg'
                />
              </div>)}
          </div>
          <HandlerButtons
            cardArray={me.students}
            itemsPerView={itemsPerView}
            visibleItems={visibleItems}
            onViewLess={showLess}
            onViewMore={showMore}
          />
        </>}
    </div>
  )
}

export default Profile