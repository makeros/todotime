const getCall = require('./get-time-from-tasks/get-call')
module.exports = async function getTodoistPremiumStatus (authKey) {
  try {
    await getCall('https://api.todoist.com/rest/v1/tasks?filter=today', { authKey })()
    return true
  } catch (e) {
    return false
  }
}
