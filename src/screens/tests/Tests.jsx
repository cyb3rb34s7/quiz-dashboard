import React, { useContext, useEffect, useState } from 'react'
import '../../styles/Tests.css'
import { dataContext } from '../../contexts/store'
import { Link } from 'react-router-dom'
import SearchBar from '../../components/SearchBar'
import NoData from '../../components/NoData'
import { useMediaQuery } from 'react-responsive'
import { DatePicker } from 'antd'
import moment from 'moment'
import Card from '../../components/Card'
import HandlerButtons from '../../components/HandlerButtons'
import { getAllQuiz } from '../../services/Quiz'

const itemsPerView = 10
const requiredKeys = ["Name", "Type", "Quiz"]
const Tests = () => {
  const { tests, updateTests, updateEditTest } = useContext(dataContext)
  const largeScreen = useMediaQuery({ query: '(min-width: 1200px)' })
  const [visibleItems, setVisibleItems] = useState(itemsPerView)
  useEffect(() => {
    const fetchTestData = async () => {
      try {
        // Make API request to fetch teachers data
        const response = await getAllQuiz();
        //update the context with the fetched data
        updateTests((tests) => ({ ...tests, filteredTests: response }));
        // console.log("QUizizes by teacher", response);
      } catch (error) {
        // console.error("Error fetching teachers data:", error);
      }
    };

    fetchTestData();
    // Call the async function to fetch data
  }, []);


  const showMore = () => {
    setVisibleItems(visibleItems + itemsPerView)
  }

  const showLess = () => {
    setVisibleItems(itemsPerView)
  }


  const fromDisabledDate = (current) => {
    return tests.toDateObject ? (current && current > moment(new Date(tests.toDateObject))) : (current && current > moment().endOf('day'))
  }

  const toDisabledDate = (current) => {
    return tests.fromDateObject ? (current && (current < moment(new Date(tests.fromDateObject)) || current > moment().endOf('day'))) : (current && current > moment().endOf('day'))
  }

  const onChangeFrom = (date, dateString) => {
    return !dateString ? updateTests((tests) => ({ ...tests, fromDateObject: null, fromDateString: '' })) : updateTests((tests) => ({ ...tests, fromDateObject: date, fromDateString: dateString }))
  }

  const onChangeTo = (date, dateString) => {
    return !dateString ? updateTests((tests) => ({ ...tests, toDateObject: null, toDateString: '' })) : updateTests((tests) => ({ ...tests, toDateObject: date, toDateString: dateString }))
  }

  const handleSearch = (newValue) => {
    updateTests((tests) => ({ ...tests, searchString: newValue }))
  }


  return (
    <>
      <h1 className='page-heading fxlarge fbolder mb1'>Tests</h1>
      <div className='tests'>
        <div className="tests-filter-bar">
          <SearchBar
            valueString={tests.searchString}
            handleChange={handleSearch}
          />
          <DatePicker
            getPopupContainer={() => document.getElementById('date-picker-container')}
            placeholder="From"
            format='DD/MM/YYYY'
            onChange={onChangeFrom}
            value={tests.fromDateObject}
            disabledDate={fromDisabledDate}
            suffixIcon={null}
            className='mr1 bs bg-white'
          />
          <DatePicker
            getPopupContainer={() => document.getElementById('date-picker-container')}
            placeholder="To"
            format='DD/MM/YYYY'
            onChange={onChangeTo}
            value={tests.toDateObject}
            disabledDate={toDisabledDate}
            suffixIcon={null}
            className='mr1 bs bg-white'
          />
          <button className="btn bs">Apply</button>
        </div>
        {/* {tests["filteredTests"] &&
          (Array.isArray(tests["filteredTests"]) ||
            typeof tests["filteredTests"] === "object") ? (
          <>
            <div className="test-cards d-grid-cols gap1 twelve-columns pv1">
              {Array.isArray(teachers["allTeachers"]) ?
                (
                  teachers["allTeachers"].slice(0, visibleItems).map((item) => (
                    <Link
                      to={`/teachers/${item.Name.toLowerCase().replace(" ", "-")}`}
                      className={`card-link col-${largeScreen ? 4 : 6}`}
                      key={item.id}
                      state={item}
                    >
                      {console.log(item)}
                      <Card
                        data={requiredKeys.map((key) => ({
                          label: key,
                          value:
                            key === "Name"
                              ? `${item.first_name} ${item.last_name}`
                              : key === "Phone"
                                ? item.phone
                                : key === "Subjects"
                                  ? Object.keys(item.subjects).join(", ")
                                  : item[key],
                        }))}
                        logo={requiredKeys.some(key => key.toLowerCase() === "name") ? `${teachers["allTeachers"].first_name} ${teachers["allTeachers"].last_name}` : ""}

                      />
                    </Link>
                  ))
                ) : (
                  <Link
                    to={`/teachers/${teachers["allTeachers"]._id}`}
                    className={`card-link col-${largeScreen ? 4 : 6}`}
                    key={teachers["allTeachers"]._id}
                    state={teachers["allTeachers"]}
                  >
                    <Card
                      data={requiredKeys.map((key) => ({
                        label: key,
                        value:
                          key.toLowerCase() === "name"
                            ? `${teachers["allTeachers"].first_name} ${teachers["allTeachers"].last_name}`
                            : key.toLowerCase() === "subjects" &&
                              teachers["allTeachers"][key.toLowerCase()]
                              ? `${Object.keys(teachers["allTeachers"][key.toLowerCase()])[0]
                              }: ${teachers["allTeachers"][key.toLowerCase()][
                                Object.keys(teachers["allTeachers"][key.toLowerCase()])[0]
                              ].join(", ")}`
                              : teachers["allTeachers"][key.toLowerCase()],
                      }))}
                      logo={requiredKeys.some(key => key.toLowerCase() === "name") ? `${teachers["allTeachers"].first_name} ${teachers["allTeachers"].last_name}` : ""}
                    />
                  </Link>
                )}
            </div>
            <HandlerButtons
              cardArray={
                Array.isArray(teachers["allTeachers"])
                  ? teachers["allTeachers"]
                  : [teachers["allTeachers"]]
              }
              itemsPerView={itemsPerView}
              visibleItems={visibleItems}
              onViewLess={showLess}
              onViewMore={showMore}
            />
          </>
        ) : (
          <NoData span={12} />
        )} */}

        {tests.filteredTests.length > 0 ?
          <div className="test-cards d-grid-cols gap1 twelve-columns pv1">
            {/* {console.log(tests)} */}
            {tests.filteredTests.slice(0, visibleItems).map((item) =>
              <Link
                key={item._id}
                state={item}
                className={`card-link col-${largeScreen ? 4 : 6}`}
                to={`/tests/${item._id}`}
                onClick={() => updateEditTest({
                  quizID: item._id,
                  name: item.name,
                  type: item.type,
                  class: item.programme,
                  quizStartDateTimeObject: moment(item.start_time, "DD/MM/YYYY HH:mm"),
                  quizStartDateTime: moment(item.start_time, "DD/MM/YYYY HH:mm"),
                  quizEndDateTimeObject: moment(item.quizEndDate + " " + item.quizEndTime, "DD/MM/YYYY HH:mm"),
                  quizEndDateTime: item.quizEndDate + " " + item.quizEndTime,
                  quizDurationObject: moment('01:00', "HH:mm"),
                  quizDuration: item.duration || 1 ,
                  quizFiles: {},
                  quiz: item.quiz,
                  quizIcon: item.quizIcon,
                })}
              >
                  <Card
                  data={requiredKeys.map((key) => ({ 
                    label: key, value: 
                    key === "Quiz"
                    ? Object.keys(item.quiz).join(", "):item[key.toLowerCase()]
                   }))}
                  logo={item.name? item.name.toUpperCase(): 'Test'}
                />
                {/* {console.log(moment(item.quizStartDate + " " + item.quizStartTime, "DD/MM/YYYY HH:mm"))} */}
              </Link>
            )}
          </div>
          : <NoData span={12} />
        }
        <HandlerButtons
          cardArray={tests.filteredTests}
          itemsPerView={itemsPerView}
          visibleItems={visibleItems}
          onViewLess={showLess}
          onViewMore={showMore}
        />
      </div >
    </>
  )
}

export default Tests