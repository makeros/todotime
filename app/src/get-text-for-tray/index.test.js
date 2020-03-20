/* globals describe, test, expect */
const getTextForTray = require('./index.js')

describe('/.well-known/health-check', function () {
  describe('GET method', () => {
    test('should return status code 200 and OK', async function () {
      expect(getTextForTray(285)).toEqual('4:45')
      expect(getTextForTray(60)).toEqual('1h')
      expect(getTextForTray(45)).toEqual('45m')
      expect(getTextForTray(0)).toEqual('0m')
      expect(getTextForTray(62)).toEqual('1:02')
      expect(getTextForTray()).toEqual('...')
      expect(getTextForTray(550)).toEqual('9:10')

    })
  })
})
