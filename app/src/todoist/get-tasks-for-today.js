const httpsRequest = require('./https-request')

const TODAY_URL = 'https://api.todoist.com/rest/v1/tasks?filter=today'

module.exports = function ({ authKey }) {
  return httpsRequest({ authKey }).get(TODAY_URL)
}
