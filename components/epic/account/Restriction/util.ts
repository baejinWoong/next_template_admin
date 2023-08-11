interface I_dateFormSet {
  year: number
  month: number
  date: number
}

export const getDateForMonthSet = (
  type: 'start' | 'end',
  startDateForm: I_dateFormSet,
  endDateForm: I_dateFormSet,
  targetMonth?: number,
  targetYear?: number,
) => {
  const results = []
  switch (type) {
    case 'start':
      for (let i = 1; i <= new Date(startDateForm.year, startDateForm.month, 0).getDate(); i++) {
        if (!(startDateForm.year === new Date().getFullYear() && startDateForm.month === new Date().getMonth() + 1 && i < new Date().getDate())) {
          results.push(i)
        }
      }
      break
    default:
      for (let i = 1; i <= new Date(endDateForm.year, targetMonth ?? endDateForm.month + 1, 0).getDate(); i++) {
        const isSameStartYear = (targetYear ?? endDateForm.year) === (startDateForm.year ?? new Date().getFullYear())
        const isSameStartMonth = (targetMonth ?? endDateForm.month) === (startDateForm.month ?? new Date().getMonth() + 1)
        const isBeforeStartDate = i < (startDateForm.date ?? new Date().getDate())
        if (!(isSameStartYear && isSameStartMonth && isBeforeStartDate)) {
          results.push(i)
        }
      }
      break
  }
  return results
}

export const getMonthSet = (type: 'start' | 'end', startDateForm: I_dateFormSet, endDateForm: I_dateFormSet, targetYear?: number) => {
  const results = []
  switch (type) {
    case 'start':
      for (let i = 1; i < 13; i++) {
        if (!(startDateForm.year === new Date().getFullYear() && i < new Date().getMonth() + 1)) {
          results.push(i)
        }
      }
      break
    default:
      for (let i = 1; i < 13; i++) {
        const isSameYear = (targetYear ?? endDateForm.year) === (startDateForm.year ?? new Date().getFullYear())
        const isBeforeMonth = i < (startDateForm.month ?? new Date().getMonth() + 1)
        if (!(isSameYear && isBeforeMonth)) {
          results.push(i)
        }
      }
      break
  }
  return results
}
