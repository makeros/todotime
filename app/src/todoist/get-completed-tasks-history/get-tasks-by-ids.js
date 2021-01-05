const httpsRequest = require('./../https-request')

const TASKS_URL = 'https://api.todoist.com/rest/v1/tasks'

exports.getTasksByIds = function getTasksByIds ({ authKey }, ids) {
  const idsStr = ids.join(',')
  return httpsRequest({ authKey }).get(`${TASKS_URL}?ids=${idsStr}`)
}
