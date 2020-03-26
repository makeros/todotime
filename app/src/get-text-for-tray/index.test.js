/* globals describe, test, expect, jest */
const getTextForTray = require('./index.js')

describe('getTextForTray', function () {
  test('should return text for the tray title', async function () {
    const callbackMock = jest.fn()

    getTextForTray(callbackMock, 123)
    getTextForTray(callbackMock, undefined)
    getTextForTray(callbackMock, null)
    getTextForTray(callbackMock, 'abc')

    expect(callbackMock.mock.calls).toEqual([[123], ['...'], ['...'], ['...']])
  })
})
