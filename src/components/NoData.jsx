import React from 'react'
import '../styles/NoData.css'
import { Empty } from 'antd'

const NoData = ({ span, title = '', subTitle = '' }) => {
    return (
        <div className={`card col-${span} d-flex-column`}>
            {title &&
                <>
                    <div className="card-heading">{title}</div>
                    <hr className="hr-break" />
                </>}
            {subTitle && <div className="text-center fbold pv1 border-divider">{subTitle}</div>}
            <div className="card-body flex-1">
                <Empty className='text-center' image={Empty.PRESENTED_IMAGE_SIMPLE} description='No Data' />
            </div>
        </div>
    )
}

export default NoData