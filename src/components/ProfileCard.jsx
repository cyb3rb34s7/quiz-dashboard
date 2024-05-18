import React from "react";
import "../styles/ProfileCard.css";
import Icon from "./Icon";
import { useMediaQuery } from "react-responsive";

const ProfileCard = ({ data, logo, requiredKeys }) => {
  const mediumScreen = useMediaQuery({ query: "(min-width: 992px)" });
  const renderData = (data) => {
    // Check if the provided data is an array
    if (Array.isArray(data)) {
      return (
        <div className="card-item">
          {data.join(', ')}
        </div>
      );
    }
  
    // Handle other types of data
    if (typeof data === 'string' || typeof data === 'boolean' || typeof data === 'number') {
      return (
        <div className="card-item">
          {data.toString()}
        </div>
      );
    }
}
  return (
    <div className={`card mt1 profile-card d-flex-row`}>
      <div className="card-logo ml1 mvhalf d-flex-row justify-center align-center">
        <Icon icon={logo} />
      </div>
      <div className="card-content d-grid-cols twelve-columns pl2 mvhalf flex-1">
        {Object.keys(data).map((key) => {
          // if (requiredKeys.includes(key)) {
          return (
            <div
              className={`card-item col-${
                mediumScreen ? 4 : 6
              } d-grid-cols twelve-columns gap0 pvhalf`}
              key={key}
            >
              <div className="card-item-label label-primary col-4">{key.toUpperCase()}</div>
              <div className="card-item-value col-8 f600">
                {key.toLowerCase() === "subjects" &&
                typeof data[key.toLowerCase()] === "object"
                  ? Object.entries(data[key.toLowerCase()])
                      .map(
                        ([subjectKey, subjectValue]) =>
                          `${subjectKey.toUpperCase()}: ${subjectValue.join(", ")}`
                      )
                      .join(", ")
                  :   <>{Array.isArray(data[key]) ? data[key].join(', ') : data[key] !== null ? data[key].toString() : '-'}</>}
     
              </div>
            </div>
          );
          // }
        })}
      </div>
    </div>
  );
};

export default ProfileCard;
