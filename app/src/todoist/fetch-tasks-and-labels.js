const getLabels = require('./get-labels')
const getTasksForToday = require('./get-tasks-for-today')
const getTasksForOverdue = require('./get-tasks-for-overdue')

module.exports = function fetchTasksAndLabels ({ authKey, includeOverdue }) {
  return Promise
    .all([
      getTasksForToday({ authKey }), 
      includeOverdue ? getTasksForOverdue({ authKey}) : [],
      getLabels({ authKey })
    ])
    .then(([todayTasks, overdueTasks, labels]) => {
      return [todayTasks.concat(overdueTasks), labels]
    })
}
