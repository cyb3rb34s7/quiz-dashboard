import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import '../styles/BarGraph.css'
import { colors } from '../constants/Constants'

const BarGraph = ({ span, data, title, dataKeyX, dataKeyY, chartHeight }) => {
    return (
        <div className={`card col-${span}`}>
            <div className="card-heading">{title}</div>
            <hr className="hr-break" />
            <ResponsiveContainer width="100%" height={chartHeight}>
                <BarChart
                    data={data}
                    layout='vertical'
                    margin={{ bottom: 5 }}
                    barSize={12}
                >
                    <defs>
                        <linearGradient id="barColor" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="10%" stopColor={colors.gradientEndColor} stopOpacity={1} />
                            <stop offset="80%" stopColor={colors.gradientStartColor} stopOpacity={1} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid horizontal={false} stroke={colors.tertiaryTextColor} />
                    <XAxis
                        type='number'
                        orientation='top'
                        tickLine={false}
                        tickCount={5}
                        domain={[0, 100]}
                        tickFormatter={(value) => `${value}%`}
                        tick={{ fill: colors.secondaryTextColor }}
                        axisLine={{ stroke: colors.tertiaryTextColor }}
                    />
                    <YAxis
                        dataKey={dataKeyY}
                        type="category"
                        axisLine={false}
                        tickLine={false}
                        width={100} // Adjust the width if necessary
                        tick={{ fill: colors.secondaryTextColor }}
                    />
                    <Tooltip cursor={{ stroke: colors.tertiaryTextColor, opacity: 0.25 }} />
                    <Bar dataKey={dataKeyX} fill="url(#barColor)" radius={[0, 5, 5, 0]} unit='%'/>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
export default BarGraph