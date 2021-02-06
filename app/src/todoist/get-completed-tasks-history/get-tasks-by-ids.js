const httpsRequest = require('./../https-request')

const ITEM_URL = 'https://api.todoist.com/sync/v8/items/get?all_data=false&'
exports.getTasksByIds = function getTasksByIds ({ authKey }, ids) {
  const calls = ids.map(id => {
    return httpsRequest({ authKey }).get(`${ITEM_URL}item_id=${id}`)
  })
  return Promise.all(calls)
    .then(items => {
      return items.map(responseItem => {
        return responseItem.item
      })
    })
    .then(items => (items.filter(Boolean)))
}
