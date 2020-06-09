const LABEL_MINUTES = '<minutes>'

module.exports = function getLabelRegExp (todoistLabel) {
  const labelParts = todoistLabel.split(LABEL_MINUTES)
  return RegExp(`^${labelParts[0]}(\\d+)${labelParts[1]}$`)
}
