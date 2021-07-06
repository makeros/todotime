/* globals describe, it, expect */
const { mergeTimeSeries } = require('./merge-time-series')

describe('merge-time-series', () => {
  it.each([
    [
      [[20, 2], [10, 1], [30, 3], [9, 9]],
      [[20, 3], [30, 5], [40, 4]],
      undefined,
      [[9, 9], [10, 1], [20, 3], [30, 5], [40, 4]]
    ],
    [
      [[5, 5]],
      [[20, 3], [30, 5], [40, 4]],
      undefined,
      [[5, 5], [20, 3], [30, 5], [40, 4]]
    ],
    [
      [],
      [[20, 3], [30, 5], [40, 4]],
      undefined,
      [[20, 3], [30, 5], [40, 4]]
    ],
    [
      [[1, 1]],
      [],
      undefined,
      [[1, 1]]
    ],
    [
      [[10, 1], [5, 5], [6, 6]],
      [],
      undefined,
      [[5, 5], [6, 6], [10, 1]]
    ],
    [
      [],
      [[10, 1], [5, 5], [6, 6]],
      undefined,
      [[5, 5], [6, 6], [10, 1]]
    ],
    [
      [[5, 5]],
      [[20, 3], [30, 5], [40, 4]],
      3,
      [[20, 3], [30, 5], [40, 4]]
    ],
    [
      [],
      [[20, 3], [30, 5], [40, 4], [15, 1]],
      3,
      [[20, 3], [30, 5], [40, 4]]
    ]
  ])('for currentData %o and incommingData %o should return %o', (currentData, incommingData, maxDays, expectedData) => {
    const result = mergeTimeSeries(currentData, incommingData, maxDays)
    expect(result).toEqual(expectedData)
  })
})
