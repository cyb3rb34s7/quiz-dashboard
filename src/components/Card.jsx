import React from 'react'
import '../styles/Card.css'
import Icon from './Icon'

const Card = ({ data, logo }) => {
    return (
        <div className={`card overview-card d-flex-row`}>
            <div className="card-logo ml1 d-flex-row justify-center align-center">
                <Icon icon={logo} />
            </div>
            <div className="card-content d-flex-column justify-sb flex-1 pl2 mvhalf">
                {data.map((item) => {
                    return (
                        <div className="card-item d-grid-cols twelve-columns gap0 pvhalf" key={item.label}>
                            <div className="card-item-label label-primary col-4">{item.label}</div>
                            <div className="card-item-value col-8 f600">{item.value}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Card