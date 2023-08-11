import React from 'react'
import cohortCss from 'styles/Cohort.module.scss'

interface I_cohortProps {
  data: {
    [index: string]: Array<string | number>
  }
  customHeader?: string[]
}

/**
 *
 */
const Cohort = (props: I_cohortProps) => {
  const { data, customHeader = [] } = props
  return (
    <div className={cohortCss.cohortWrap}>
      <div className={cohortCss.scrollWrap}>
        <table>
          <thead>
            <tr>
              <th className={cohortCss.fixed}>{customHeader.length > 0 ? customHeader[0] : '날짜'}</th>
              <th className={cohortCss.fixed}>{customHeader.length > 1 ? customHeader[1] : 'day 0'}</th>
              {data[Object.keys(data)[0]]
                ?.filter((data, index) => index > 0)
                .map((data, index) => (
                  <th key={`cohortDay_${index}`}>{`day ${index + 1}`}</th>
                ))}
            </tr>
          </thead>
          <tbody>
            {Object.keys(data).map((key, index) => (
              <tr key={`cohortData_${index}`}>
                <td className={cohortCss.fixed} style={{ fontWeight: '300' }}>
                  {key}
                </td>
                <td className={cohortCss.fixed} style={{ fontWeight: '300' }}>
                  {data[key][0]}
                </td>
                {data[key]
                  .filter((none, index) => index > 0 && index <= data[key].length - 1)
                  .map((keyData, index) => {
                    const percent = Math.round((Number(keyData) / Number(data[key][0])) * 10000) / 100
                    const percentClass =
                      percent > 90
                        ? cohortCss.over_90
                        : percent > 75
                        ? cohortCss.over_75
                        : percent > 60
                        ? cohortCss.over_60
                        : percent > 25
                        ? cohortCss.over_25
                        : percent > 15
                        ? cohortCss.over_15
                        : undefined
                    return (
                      <td className={percentClass} key={`cohortData_${key}_${index}`}>
                        <p>{percent}%</p>
                        <p>{keyData.toLocaleString()}</p>
                      </td>
                    )
                  })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Cohort
