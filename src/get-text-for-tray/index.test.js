/* globals describe, test, expect */
const getTextForTray = require('./index.js')

describe('/.well-known/health-check', function () {
  describe('GET method', () => {
    test('should return status code 200 and OK', async function () {
      expect(getTextForTray(4.75)).toEqual('4:45')
      expect(getTextForTray(1)).toEqual('1h')
      expect(getTextForTray(0.75)).toEqual('45m')
      expect(getTextForTray(0)).toEqual('0m')
      expect(getTextForTray(1.03)).toEqual('1:02h')
      expect(getTextForTray()).toEqual('...')
    })
  })
})
