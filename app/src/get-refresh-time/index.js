module.exports = function ({ logger ,fetchTasksTime }) {
  return function getRefreshTime (cb, timers) {
    return function loop (timeInterval, fromLoop = false) {
      const refetch = async (once = false) => {
        try {
          const minutes = await fetchTasksTime()
          logger.log('refreshTime', minutes)
          cb(minutes)
        } catch (e) {
          // TODO run logger
          logger.log('refresh loop error')
          loop(timeInterval, true)
        }
        if (!once) loop(timeInterval, true)
      }

      clearInterval(timers.refreshTimeLoopHandler)
      logger.log('started interval', timeInterval)
      if (!fromLoop) {
        refetch(true)
      }
      timers.refreshTimeLoopHandler = setTimeout(refetch, timeInterval)
    }
  }
}
