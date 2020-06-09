module.exports = function timeAsDefault (minutes) {
  if (minutes < 60) {
    return minutes + 'm'
  }

  if (minutes % 60 === 0) {
    return `${(minutes / 60)}h`
  }

  const hours = Math.floor(minutes / 60)
  return `${hours}:${padLeft(minutes - (hours * 60), 2)}`
}

function padLeft (str, size) {
  return '0'.repeat(size - (str + '').length) + str
}
