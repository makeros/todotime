const getCall = require('./get-call')
const LABEL_MINUTES = '<minutes>'

module.exports = function ({ authKey, labelPrefix, todoistLabel }) {
  const getTasksCall = getCall(getTasksForTodayUrl(), { authKey })
  const getLabelsCall = getCall(getLabelsUrl(), { authKey })

  const labelParts = todoistLabel.split(LABEL_MINUTES)
  const labelRegepx = RegExp(`^${labelParts[0]}(\\d+)${labelParts[1]}$`)

  return Promise.all([getTasksCall(), getLabelsCall()])
    .then(([fetchedTasks, fetchedLabels]) => {
      const labels = fetchedLabels
        .filter(filterTasksByLabelTemplate(labelRegepx))
        .map(mapLabelsWithValue({ labelPrefix, labelRegepx }))

      // TODO include also nested tasks. Right now all tasks that are set to `today` are included

      return fetchedTasks
        .filter(taskHasLabels)
        .map(attachTimeLabelsToTask(labels))
        .reduce(calculateTimeInMinutes, 0)
    })
}

function getTasksForTodayUrl () {
  return 'https://api.todoist.com/rest/v1/tasks?filter=today'
}

function getLabelsUrl () {
  return 'https://api.todoist.com/rest/v1/labels'
}

function filterTasksByLabelPrefix (prefix) {
  return item => item.name.indexOf(prefix) === 0
}

function filterTasksByLabelTemplate (regexp) {
  return item => !!item.name.match(regexp)
}

function mapLabelsWithValue ({ labelPrefix, labelRegepx }) {
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

function getValueFromLabelName (name, labelPrefix) {
  return name.split(labelPrefix)[1]
}

function attachTimeLabelsToTask (labels) {
  return (task) => {
    const labelsForTask = labels
      .filter(label => (task.label_ids.indexOf(label.id) > -1))
    return {
      ...task,
      timedoist: {
        labels: labelsForTask
      }
    }
  }
}

function calculateTimeInMinutes (acc, task) {
  return task.timedoist.labels.reduce((acc, label) => {
    const value = Number.parseInt(label.value, 10)
    return Number.isNaN(value) ? acc : acc + value
  }, 0) + acc
}

function taskHasLabels (task) {
  return Array.isArray(task.label_ids)
}
