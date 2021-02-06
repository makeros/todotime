/* globals describe, expect, it, beforeEach, jest */
const { getDateRanges } = require('./get-date-ranges')

describe('getDateRanges', () => {
  beforeEach(() => {
    const spyNow = jest.spyOn(Date, 'now')
    spyNow.mockImplementation(() => 1616191957000)
  })
  it.each([
    [6, [{
      since: '2021-3-14T00:00Z',
      until: '2021-3-19T23:59:59Z'
    }]],
    [7, [{
      since: '2021-3-13T00:00Z',
      until: '2021-3-19T23:59:59Z'
    }]],
    [8, [{
      since: '2021-3-19T00:00Z',
      until: '2021-3-19T23:59:59Z'
    }, {
      since: '2021-3-12T00:00Z',
      until: '2021-3-18T23:59:59Z'
    }]],
    [15, [{
      since: '2021-3-19T00:00Z',
      until: '2021-3-19T23:59:59Z'
    }, {
      since: '2021-3-5T00:00Z',
      until: '2021-3-11T23:59:59Z'
    },
    {
      since: '2021-3-12T00:00Z',
      until: '2021-3-18T23:59:59Z'
    }]]
  ])('for provided days %s should return %o ranges', (days, expectedRanges) => {
    expect(getDateRanges(days)).toEqual(expectedRanges)
  })
})
