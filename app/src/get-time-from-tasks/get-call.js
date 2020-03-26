const { get } = require('https')
module.exports = function getCall (url, { authKey }) {
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
