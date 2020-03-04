module.exports = function getTextForTray (hours = NaN) {
  if (Number.isNaN(hours)) {
    return '...'
  }
  if (hours < 1) {
    return (hours * 60) + 'm'
  }

  const restMinutes = (hours % 1) * 60
  if (restMinutes === 0) {
    return `${hours}h`
  } else if (restMinutes < 10) {
    return `${Math.floor(hours)}:0${Math.ceil(restMinutes)}h`
  }
  return Math.floor(hours) + ':' + restMinutes.toFixed(0)
}
