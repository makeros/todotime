module.exports = function getTextForTray (cb, value) {
  return Number.isNaN(parseInt(value)) ? cb('...') : cb(value)
}
