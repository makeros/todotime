exports.mergeTimeSeries = function mergeTimeSeries (currentData, incomingData, maxDays = null) {
  const updatedCurrentData = currentData.map(cData => {
    const iData = incomingData.find(item => (item[0] === cData[0]))
    return iData ? [cData[0], iData[1]] : cData
  })

  const currentDataTiemKeys = updatedCurrentData.map(item => item[0])
  const incomingDataRest = incomingData.filter(item => !currentDataTiemKeys.includes(item[0]))
  return updatedCurrentData
    .concat(incomingDataRest)
    .sort((a, b) => {
      if (a[0] < b[0]) {
        return -1
      }
      if (a[0] > b[0]) {
        return 1
      }
      return 0
    })
    .filter((item, index, array) => {
      const itemsToDrop = (maxDays !== null && array.length > maxDays) ? array.length - maxDays : 0
      return index >= itemsToDrop
    })
}
