import React from 'react'
import '../styles/TallyCard.css'

const TallyCard = ({ span, heading, body }) => {
    return (
        <div className={`card tally-card col-${span}`}>
            <div className="card-heading">{heading}</div>
            <hr className="hr-break" />
            <div className="card-body pv1 d-flex-row">
                {Object.keys(body).map((label) => {
                    return (
                        <div className="body-element d-flex-column" key={label}>
                            <span className='number-value fxxlarge'>{body[label]}</span>
                            <label className='label-primary'>{label}</label>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default TallyCard