const httpsRequest = require('./https-request')

const OVERDUE_URL = 'https://api.todoist.com/rest/v1/tasks?filter=overdue'

module.exports = function ({ authKey }) {
  return httpsRequest({ authKey }).get(OVERDUE_URL)
}
