// 0 - no automatic refresh
module.exports = function ({ logger, fetchTasksTime }) {
  return function getRefreshTime (cb, timers) {
    return function loop (timeInterval, fromLoop = false) {
      const refetch = async (once = false) => {
        try {
          const minutes = await fetchTasksTime()
          logger.log('refreshTime', minutes)
          cb(null, minutes)
        } catch (e) {
          logger.log('refresh loop error', e)
          cb(e)
          loop(timeInterval, true)
        }
        if (!once) loop(timeInterval, true)
      }

      clearInterval(timers.refreshTimeLoopHandler)
      logger.log('started interval', timeInterval)
      if (!fromLoop) {
        refetch(true)
      }

      if (timeInterval === 0) {
        return clearInterval(timers.refreshTimeLoopHandler)
      }
      timers.refreshTimeLoopHandler = setTimeout(refetch, timeInterval)
    }
  }
}
