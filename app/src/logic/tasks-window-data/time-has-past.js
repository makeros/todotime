exports.timeHasPast = function timeHasPast (startTimestamp, minutesPast) {
  return (Date.now() - startTimestamp) > minutesPast
}
