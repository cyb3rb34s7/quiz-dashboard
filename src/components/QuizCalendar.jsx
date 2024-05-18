import React from "react";
import { Calendar } from "primereact/calendar";
import "../styles/QuizCalendar.css";
import data from "../../api.json";

const QuizCalendar = () => {
    const customDateTemplate = (date) => {
        return data['get-dashboard-data'].upcomingQuizzes.includes(`${date.day}/${date.month+1}/${date.year}`) ? <span className="p-highlight bg-primary text-white">{date.day}</span> : <span>{date.day}</span>
    };

    return (
        <div className="card col-3">
            <div className="card-heading">Upcoming Quizzes</div>
            <hr className="hr-break" />
            <Calendar
                inline
                showOtherMonths={false}
                dateTemplate={(date) => customDateTemplate(date)}
            />
        </div>
    );
}
export default QuizCalendar