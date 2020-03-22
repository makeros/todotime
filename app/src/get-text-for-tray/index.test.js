/* globals describe, test, expect */
const getTextForTray = require('./index.js')

describe('/.well-known/health-check', function () {
  describe('GET method', () => {
    test('should return status code 200 and OK', async function () {
      const callbackMock = jest.fn()

      getTextForTray(callbackMock, 123)
      getTextForTray(callbackMock, undefined)
      getTextForTray(callbackMock, null)
      getTextForTray(callbackMock, 'abc')

      expect(callbackMock.mock.calls).toEqual([[123], ["..."], ["..."], ["..."]])
    })
  })
})
