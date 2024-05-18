import React from 'react'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { colors, visualizationColors } from '../constants/Constants'
import '../styles/LineGraph.css'

const LineGraph = ({ span, data, title, dataKeyX, chartHeight }) => {
  return (
    <div className={`card col-${span}`}>
      <div className="card-heading">{title}</div>
      <hr className="hr-break" />
      <ResponsiveContainer width='100%' height={chartHeight}>
        <LineChart data={data} margin={{ left: 20, top: 20 }}>
          {Object.keys(data[0]).filter(key => key !== dataKeyX).map((teacher, index) => (
            <Line
              key={teacher}
              type="monotone"
              dataKey={teacher}
              stroke={visualizationColors[index]}
              dot={false}
              unit="%"
            />
          ))}
          <CartesianGrid vertical={false} stroke={colors.tertiaryTextColor} />
          <XAxis
            dataKey={dataKeyX}
            axisLine={false}
            tickLine={false}
            padding={{ left: 75, right: 75 }}
            tick={{ fill: colors.secondaryTextColor }}
          />
          <YAxis
            orientation='right'
            tickCount={7}
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
            tick={{ fill: colors.secondaryTextColor }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip />
          <Legend iconType='plainline' />
        </LineChart>
      </ResponsiveContainer>
    </div >
  )
}

export default LineGraph