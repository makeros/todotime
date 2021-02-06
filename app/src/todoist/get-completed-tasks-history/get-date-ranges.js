const DAY_IN_MILIS = 86400000 // milisenconds

exports.getDateRanges = function getDateRanges (days) {
  const batchDaysLength = 7
  const rangesCount = Math.floor(days / batchDaysLength)
  const restDays = days - (rangesCount * batchDaysLength)
  const ranges = []

  if (restDays > 0) {
    ranges.push({
      since: getParamDayDate(calculatePastDateByDay(restDays - 1)) + 'T00:00Z',
      until: getParamDayDate(calculatePastDateByDay(0)) + 'T23:59:59Z'
    })
  }
  for (let i = rangesCount; i > 0; i--) {
    ranges.push({
      since: getParamDayDate(calculatePastDateByDay(((i) * batchDaysLength) + (restDays) - 1)) + 'T00:00Z',
      until: getParamDayDate(calculatePastDateByDay(((i - 1) * batchDaysLength) + restDays)) + 'T23:59:59Z'
    })
  }
  return ranges
}

function calculatePastDateByDay (days) {
  const today = Date.now()
  const pastDate = today - (days * DAY_IN_MILIS)
  return new Date(pastDate)
}

function getParamDayDate (date) {
  return `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`
}
