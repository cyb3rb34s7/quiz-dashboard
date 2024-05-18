import React from 'react'
import '../styles/Leaderboard.css'
import { Tooltip } from 'antd'
import { useMediaQuery } from 'react-responsive'
import { visualizationColors } from '../constants/Constants'
import profilePic from '../assets/raja.jpg'

const Leaderboard = ({ data, span, subject }) => {
    const largeScreen = useMediaQuery({ query: '(min-width: 1200px)' })
    const mediumScreen = useMediaQuery({ query: '(min-width: 992px)' })
    // const smallScreen = useMediaQuery({ query: '(min-width: 768px)' })
    return (
        <div className={`card leaderboard-card col-${span}`}>
            <div className="card-heading">Leaderboard</div>
            <hr className="hr-break" />
            <div className="leaderboard-category text-center fbold pv1 border-divider">{subject}</div>
            <div className="card-body">
                <table>
                    <tbody>
                        {data.map((student) => {
                            return (
                                <tr className="leaderboard-body-element br5" key={student.rank} style={{ backgroundColor: visualizationColors[student.rank % visualizationColors.length] }}>
                                    <td className='student-rank fbold flarge mvauto phhalf'>{student.rank}</td>
                                    {largeScreen && <td className='student-image-container mrhalf'><img className='student-image br-circle align-vertical' src={profilePic} alt={student.name} /></td>}
                                    <td className='mvauto phhalf'>
                                        <Tooltip placement='left' title={student.name}>
                                            <span className='student-name text-white'>{student.name}</span>
                                        </Tooltip>
                                    </td>
                                    <td className='student-score mvauto phhalf'>{student.score}</td>
                                    {mediumScreen && <td className='student-academy text-right mvauto fbold phhalf' style={{ height: '100%', verticalAlign: 'middle' }}>{student.academy}</td>}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Leaderboard