const httpsRequest = require('./https-request')
const PREMIUM_URL = 'https://api.todoist.com/rest/v1/tasks?filter=today'

module.exports = async function getTodoistPremiumStatus (authKey) {
  try {
    await httpsRequest({ authKey }).get(PREMIUM_URL)
    return true
  } catch (e) {
    return false
  }
}
