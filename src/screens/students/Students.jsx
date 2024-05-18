import React, { useContext, useState } from 'react'
import '../../styles/Students.css'
import { dataContext } from '../../contexts/store'
import { Link } from 'react-router-dom'
import SearchBar from '../../components/SearchBar'
import { useMediaQuery } from 'react-responsive'
import Card from '../../components/Card'
import NoData from '../../components/NoData'
import HandlerButtons from '../../components/HandlerButtons'

const itemsPerView = 2
const requiredKeys = ["Name", "Academy", "Subjects"]

const Students = () => {
  const { students, updateStudents } = useContext(dataContext)
  const largeScreen = useMediaQuery({ query: '(min-width: 1200px)' })
  const [visibleItems, setVisibleItems] = useState(itemsPerView)

  const showMore = () => {
    setVisibleItems(visibleItems + itemsPerView)
  }

  const showLess = () => {
    setVisibleItems(itemsPerView)
  }

  const handleSearch = (newValue) => {
    updateStudents((students) => ({ ...students, searchString: newValue }))
  }

  // console.log(students)

  return (
    <>
      <h1 className='page-heading fxlarge fbolder mb1'>Students</h1>
      <div className='students'>
        <SearchBar
          valueString={students.searchString}
          handleChange={handleSearch}
        />
        {students.recentStudents.length > 0 &&
          <>
            <h3 className='mt1 text-secondary'>Recent</h3>
            <div className="student-cards d-grid-cols gap1 twelve-columns pv1">
              {students.recentStudents.map((item) =>
                <Link to={`/students/${item.Name.toLowerCase().replace(' ', '-')}`} className={`card-link col-${largeScreen ? 4 : 6}`} key={item.id} state={item}>
                  <Card
                    data={requiredKeys.map((key) => ({ label: key, value: key === 'Subjects' ? Object.keys(item[key]).join(', ') : item[key] }))}
                    logo='raja.jpg'
                  />
                </Link>
              )}
            </div>
          </>}
        <h3 className={`text-secondary ${students.recentStudents.length > 0 ? '' : 'mt1'}`}>All</h3>
        <div className="student-cards d-grid-cols gap1 twelve-columns pv1">
          {students.allStudents.length > 0 ?
            students.allStudents.slice(0, visibleItems).map((item) =>
              <Link to={`/students/${item.Name.toLowerCase().replace(' ', '-')}`} className={`card-link col-${largeScreen ? 4 : 6}`} key={item.id} state={item}>
                <Card
                  data={requiredKeys.map((key) => ({ label: key, value: key === 'Subjects' ? Object.keys(item[key]).join(', ') : item[key] }))}
                  logo='raja.jpg'
                />
              </Link>
            )
            : <NoData span={12} />}
        </div>
        <HandlerButtons
          cardArray={students.allStudents}
          itemsPerView={itemsPerView}
          visibleItems={visibleItems}
          onViewLess={showLess}
          onViewMore={showMore}
        />
      </div>
    </>
  )
}

export default Students