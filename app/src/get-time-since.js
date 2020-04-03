// TODO: write unit tests

module.exports = function getDatesSinceFormat (from, date) {
  if (date === null) {
    return 'No sync...'
  }

  const diff = from - date // the difference in milliseconds

  if (diff < 1000) { // less than 1 second
    return 'right now'
  }

  const sec = Math.floor(diff / 1000)
  if (sec < 60) {
    return sec + ' sec. ago'
  }

  const min = Math.floor(diff / 60000)
  if (min < 60) {
    return min + ' min. ago'
  }

  // format the date
  // add leading zeroes to single-digit day/month/hours/minutes
  // BUG: this has to be tested because the time is in timestamp
  let d = date
  d = [
    '0' + d.getDate(),
    '0' + (d.getMonth() + 1),
    '' + d.getFullYear(),
    '0' + d.getHours(),
    '0' + d.getMinutes()
  ].map(component => component.slice(-2)) // take last 2 digits of every component

  // join the components into date
  return d.slice(0, 3).join('.') + ' ' + d.slice(3).join(':')
}
