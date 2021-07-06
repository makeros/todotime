const {
  getCompletedTasksHistory
} = require('./../../todoist')
const { calculateDaysToFetch } = require('./calculate-days-to-fetch')
const { timeHasPast } = require('./time-has-past')
const { mergeTimeSeries } = require('./merge-time-series')
const MAX_DAYS_COUNT = 21

exports.handleTasksWindowData = function (dbInMemory, tasksTimeSeriesStore, settingsStore) {
  const fetchEverything = async () => {
    let timeSeries
    try {
      timeSeries = await getCompletedTasksHistory({
        authKey: settingsStore.get('apiKey'),
        settingsStore
      }, { weeks: MAX_DAYS_COUNT / 7 })

      tasksTimeSeriesStore.set('data', timeSeries)
      tasksTimeSeriesStore.set('lastSync', new Date().getTime())
    } catch (e) {
      console.error('Cannot complete the tasks time history series.')
      console.log(e)
    }
    return timeSeries
  }

  const fetchDelta = async (_lastSync) => {
    const daysToFetch = calculateDaysToFetch(_lastSync)
    const fetchedTimeSeries = await getCompletedTasksHistory({
      authKey: settingsStore.get('apiKey'),
      settingsStore
    }, { days: daysToFetch })

    const newTimeSerie = mergeTimeSeries(tasksTimeSeriesStore.get('data'), fetchedTimeSeries, MAX_DAYS_COUNT)
    tasksTimeSeriesStore.set('data', newTimeSerie)
    tasksTimeSeriesStore.set('lastSync', new Date().getTime())
    return newTimeSerie
  }

  return async function _handleTasksWindowData () {
    const tasksList = Array.from(dbInMemory.getTable('tasksList')) || []
    const lastSync = tasksTimeSeriesStore.get('lastSync')

    if (!lastSync) {
      const timeSeries = await fetchEverything()
      return { tasksList, timeSeries }
    }

    if (timeHasPast(lastSync, settingsStore.get('refreshTimeInterval'))) {
      const timeSeries = await fetchDelta(lastSync)
      return { tasksList, timeSeries }
    }

    return { tasksList, timeSeries: tasksTimeSeriesStore.get('data') }
  }
}
