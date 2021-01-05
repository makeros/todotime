const httpsRequest = require('./https-request')

const LABELS_URL = 'https://api.todoist.com/rest/v1/labels'

module.exports = function getLabels ({ authKey }) {
  return httpsRequest({ authKey }).get(LABELS_URL)
}
