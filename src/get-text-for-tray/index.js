module.exports = function getTextForTray (cb, value = NaN) {
  if (Number.isNaN(value)) {
    return '...'
  }

  return cb(value)
}


function textFromHours (hours) {
  if (hours < 1) {
    return (hours * 60) + 'm'
  }

  const restMinutes = Math.floor((hours % 1) * 60)
  if (restMinutes === 0) {
    return `${hours}h`
  } else if (restMinutes < 10) {
    console.log(restMinutes)
    return `${Math.floor(hours)}:0${restMinutes}`
  }
  return Math.floor(hours) + ':' + restMinutes.toFixed(0)
}
