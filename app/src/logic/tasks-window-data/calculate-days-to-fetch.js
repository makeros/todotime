exports.calculateDaysToFetch = function calculateDaysToFetch (lastSyncTimestamp) {
  const oneDay = 1000 * 60 * 60 * 24
  const current = Date.now()
  const delta = current - lastSyncTimestamp

  if (delta <= oneDay) {
    return 1
  }
  return Math.ceil(delta / oneDay)
}
