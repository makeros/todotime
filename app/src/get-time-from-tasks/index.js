const { get } = require('https')
const LABEL_MINUTES = "<minutes>"

module.exports = function getHours ({ authKey, labelPrefix, todoistLabel }) {
  const getTasksCall = getCall(`https://api.todoist.com/rest/v1/tasks?filter=${getTodaysTasksFilter()}`, { authKey })
  const getLabelsCall = getCall('https://api.todoist.com/rest/v1/labels', { authKey })

  const labelParts = todoistLabel.split(LABEL_MINUTES)
  const labelRegepx = RegExp(`^${labelParts[0]}(\\d+)${labelParts[1]}$`)

  return Promise.all([getTasksCall(), getLabelsCall()])
    .then(([fetchedTasks, fetchedLabels]) => {
      const labels = fetchedLabels
        // .filter(filterTasksByLabelPrefix(labelPrefix))
        .filter(filterTasksByLabelTemplate(labelRegepx))
        .map(mapLabelsWithValue({ labelPrefix, labelRegepx }))

      // TODO include also nested tasks. Right now all tasks that are set to `today` are included

      return fetchedTasks
        .filter(taskHasLabels)
        .map(attachTimeLabelsToTask(labels))
        .reduce(calculateTimeInMinutes, 0)
    })
    // .then(getHoursFromMinutes)
}

function getTodaysTasksFilter () {
  return encodeURIComponent('today')
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
      // value: getValueFromLabelName(item.name, labelPrefix)
    }
  }
}

function extractMinutesFromLabel (value, regexp) {
  return parseInt(value.match(regexp)[1])
}

function getValueFromLabelName (name, labelPrefix) {
  return name.split(labelPrefix)[1]
}

// function getHoursFromMinutes (minutes) {
//   return (minutes / 60)
// }

function getCall (url, { authKey }) {
  return () => new Promise((resolve, reject) => {
    get(url, {
      headers: {
        Authorization: `Bearer ${authKey}`
      }
    }, (response) => {
      let body = ''
      response.on('data', (chunk) => (body += chunk))
      response.on('end', function () {
        try {
          resolve(JSON.parse(body))
        } catch (e) {
          reject(body)
        }
      })
      response.on('error', function (e) {
        reject(e)
      })
    }).on('error', (e) => {
      reject(e)
    })
  })
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