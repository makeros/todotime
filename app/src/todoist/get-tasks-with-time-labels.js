
const getLabelRegExp = require('./get-label-regexp')

module.exports = function ([fetchedTasks, fetchedLabels], { todoistLabel }) {
  const labelRegepx = getLabelRegExp(todoistLabel)

  const labels = fetchedLabels
    .filter(filterTasksByLabelTemplate(labelRegepx))
    .map(mapLabelsWithValue({ labelRegepx }))

  return fetchedTasks
    .filter(taskHasLabels)
    .map(attachTimeLabelsToTask(labels))
}

function filterTasksByLabelTemplate (regexp) {
  return item => !!item.name.match(regexp)
}

function mapLabelsWithValue ({ labelRegepx }) {
  return (item) => {
    return {
      id: item.id,
      name: item.name,
      value: extractMinutesFromLabel(item.name, labelRegepx)
    }
  }
}

function extractMinutesFromLabel (value, regexp) {
  return parseInt(value.match(regexp)[1])
}

function attachTimeLabelsToTask (labels) {
  return (task) => {
    const labelsForTask = labels
      .filter(label => (task.label_ids.indexOf(label.id) > -1))
    return {
      ...task,
      todotime: {
        labels: labelsForTask
      }
    }
  }
}

function taskHasLabels (task) {
  return Array.isArray(task.label_ids)
}
