const LABEL_MINUTES = '<minutes>'
const settingsStore = require('./../store/settings')

module.exports = function getLabelRegExp () {
  const labelParts = settingsStore.get('todoistLabel').split(LABEL_MINUTES)
  return RegExp(`^${labelParts[0]}(\\d+)${labelParts[1]}$`)
}
