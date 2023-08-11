/* eslint-disable no-useless-escape */

import moment from 'moment'
import { LABELDAYS, TARGETDATE } from './epic'
import { ChartOptions } from 'chart.js'

/**
 *
 * @param html ex) <img src=......
 */
export const getImgTags = (html: string) => {
  const getImgTagExp = /<img[^>]*src\s*=\s*[\"']?([^>\"']+)[\"']?[^>]*>/g
  return html.match(getImgTagExp)
}

/**
 *
 * @param tag ex) src= .....
 */
export const getSrcBase64 = (tag: string) => {
  const getSrcExp = /src=["\']?[^>"\']+/i
  return tag.match(getSrcExp)?.toString().replaceAll('src=', '')
}

/**
 *
 * @param text input Text
 * @param regType checked Regexp type
 */
export const checkedRegType = (text: string, regType: 'text' | 'number' | 'textAndNumber' | 'email') => {
  switch (regType) {
    case 'number':
      return /^[0-9 ]*$/g.test(text)
    case 'text':
      return /^[a-zA-Zㄱ-ㅎ|ㅏ-ㅣ|가-힣 ]*$/g.test(text)
    case 'textAndNumber':
      return /^[a-zA-Zㄱ-ㅎ|ㅏ-ㅣ|가-힣|0-9 ]*$/.test(text)
    case 'email':
      return /[a-z0-9.]+@elwide.com/.test(text)
    default:
      break
  }
}

export const getLabelDays = (type = 'YYYY.MM.DD', endDate?: Date, startDate?: Date) => {
  const results: string[] = []
  const labelDays = endDate && startDate ? moment(endDate).diff(startDate, 'day') : LABELDAYS
  for (let i = labelDays; i > -1; i--) {
    results.push(
      moment(endDate ?? TARGETDATE)
        .subtract(i, 'day')
        .format(type),
    )
  }
  return results
}

export const chartOption: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      align: 'end' as const,
    },
  },
  elements: {
    line: {
      borderCapStyle: 'round', // 선 끝을 둥글게
      borderJoinStyle: 'bevel', // 꺾이는 모서리를 둥글게
    },
  },
  scales: {
    y: {
      afterDataLimits: (scale) => {
        scale.max = scale.max * 1.1 < 100 ? 100 : scale.max * 1.1
      },
      min: 0,
    },
  },
}

export const getRandomRGB = () => {
  const RGB_1 = Math.floor(Math.random() * (255 + 1))
  const RGB_2 = Math.floor(Math.random() * (255 + 1))
  const RGB_3 = Math.floor(Math.random() * (255 + 1))
  return `rgba(${RGB_1},${RGB_2},${RGB_3})`
}
