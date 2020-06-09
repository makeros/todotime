const getLabels = require('./get-labels')
const getTasksForToday = require('./get-tasks-for-today')

module.exports = function fetchTasksAndLabels ({ authKey }) {
  return Promise.all([getTasksForToday({ authKey }), getLabels({ authKey })])
}
