const LABEL_MINUTES = '<minutes>'

exports.filterAppLabels = function ({ settingsStore }) {
  return function filterAppLabels (todoistLabels, cb) {
    const result = todoistLabels
      .filter(filterLabels)
      .map(mapLabelsWithValue)
    return cb ? cb(result) : result
  }

  function getLabelRegExp () {
    const labelParts = settingsStore.get('todoistLabel').split(LABEL_MINUTES)
    return RegExp(`^${labelParts[0]}(\\d+)${labelParts[1]}$`)
  }

  function mapLabelsWithValue (item) {
    return {
      id: item.id,
      name: item.name,
      value: parseInt(item.name.match(getLabelRegExp())[1], 10)
    }
  }

  function filterLabels (item) {
    return !!item.name.match(getLabelRegExp())
  }
}
