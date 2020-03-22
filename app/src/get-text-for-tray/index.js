module.exports = function getTextForTray (cb, value = NaN) {
  return Number.isNaN(parseInt(value)) ? cb('...') : cb(value)
}
