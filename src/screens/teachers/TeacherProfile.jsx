import React, { useEffect, useState } from "react";
import "../../styles/TeacherProfile.css";
import { useLocation } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import ProfileCard from "../../components/ProfileCard";
import BarGraph from "../../components/BarGraph";
import LineGraph from "../../components/LineGraph";
import Card from "../../components/Card";
import NoData from "../../components/NoData";
import { barChartHeight } from "../../constants/Constants";
import HandlerButtons from "../../components/HandlerButtons";
import { requiredKeys } from "./Teachers";
import { getTeacherById } from "../../services/Teachers";

const itemsPerView = 10;

const TeacherProfile = () => {
  const location = useLocation();
  const [teacherData, setTeacherData] = useState([])
  const [studentsData, setStudentsData] = useState([])
  const getTeacherInfo = async(id) => {
    const teacherInformation =  await getTeacherById(id)
    setTeacherData(teacherInformation)
    // if(teacherInformation && teacherInformation.students?.length > 0){
    //   const studentsInformation = 
    // }
  }
  useEffect(() => {
    getTeacherInfo(location.state._id)
  },[location])

  
  const largeScreen = useMediaQuery({ query: "(min-width: 1200px)" });
  const [visibleItems, setVisibleItems] = useState(itemsPerView);

  const showMore = () => {
    setVisibleItems(visibleItems + itemsPerView);
  };

  const showLess = () => {
    setVisibleItems(itemsPerView);
  };

  return (
    <div className="teacher-profile">
      <h1 className="page-heading fxlarge fbolder mb1">
        {teacherData.Name}
      </h1>
      <ProfileCard
        data={teacherData}
        requiredKeys={["Name", "Email", "Phone", "Subjects"]}
        logo= {`${teacherData.first_name} ${teacherData.last_name}`}
        
      />
      <div className="d-grid-cols gap1 mt1 twelve-columns">
        {teacherData["Subject-wise Performance"] ? (
          <BarGraph
            span={4}
            title="Subject-wise Performance"
            data={Object.entries(
              teacherData["Subject-wise Performance"]
            ).map(([name, value]) => ({
              Subject: name,
              Percentage: value,
            }))}
            dataKeyY="Subject"
            dataKeyX="Percentage"
            chartHeight={barChartHeight["CS Executive"]}
          />
        ) : (
          <NoData span={4} title="Subject-wise Performance" />
        )}
        {teacherData["Last Five Quiz Performances of Students"] ? (
          <LineGraph
            span={8}
            title="Last Five Quiz Performances of Students"
            data={Object.keys(
              teacherData["Last Five Quiz Performances of Students"]
            ).map((quiz) => {
              return {
                quiz: quiz,
                Percentage:
                  teacherData["Last Five Quiz Performances of Students"][
                    quiz
                  ],
              };
            })}
            dataKeyX="quiz"
            chartHeight={barChartHeight["CS Executive"]}
          />
        ) : (
          <NoData span={8} title="Last Five Quiz Performances of Students" />
        )}
      </div>
      {/* {location.state.students?.length > 0 && (
        <>
          <h3 className="mt1 text-secondary">Students</h3>
          <div className="test-cards d-grid-cols gap1 twelve-columns pv1">
            {location.state.students.slice(0, visibleItems).map((item) => (
              <div key={item.id} className={`col-${largeScreen ? 4 : 6}`}>
                {console.log(location.state.students)}
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
                    {...console.log(requiredKeys)}
                    logo={requiredKeys.some(key => key.toLowerCase() === "name") ?   `${item.first_name.toUpperCase()} ${item.last_name.toUpperCase()}` : ""}
                  />

              </div>
            ))}
          </div>
          <HandlerButtons
            cardArray={location.state.students}
            itemsPerView={itemsPerView}
            visibleItems={visibleItems}
            onViewLess={showLess}
            onViewMore={showMore}
          />
        </>
      )} */}
    </div>
  );
};

export default TeacherProfile;
