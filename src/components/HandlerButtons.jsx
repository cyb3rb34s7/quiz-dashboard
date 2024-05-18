import React from 'react'
import '../styles/HandlerButtons.css'
import { colors } from '../constants/Constants'

const HandlerButtons = ({ cardArray, itemsPerView, visibleItems, onViewLess, onViewMore }) => {
    return (
        <div className='text-center'>
            {cardArray.length > itemsPerView && (visibleItems >= cardArray.length ?
                <div className='view-btn text-center cp mhauto' onClick={onViewLess}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill={colors.secondaryTextColor}>
                        <path d="m283-345-43-43 240-240 240 239-43 43-197-197-197 198Z" />
                    </svg>
                    <div className='text-secondary f500'>View Less</div>
                </div>
                :
                <div className='view-btn text-center cp mhauto' onClick={onViewMore}>
                    <div className='text-secondary f500'>View More</div>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill={colors.secondaryTextColor}>
                        <path d="M480-345 240-585l43-43 197 198 197-197 43 43-240 239Z" />
                    </svg>
                </div>)}
        </div>
    )
}

export default HandlerButtons