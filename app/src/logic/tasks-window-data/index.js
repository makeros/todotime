const {
  getCompletedTasksHistory
} = require('./../../todoist')
const { mergeTimeSeries } = require('./merge-time-series')

exports.handleTasksWindowData = function (dbInMemory, tasksTimeSeriesStore, settingsStore) {
  return async function () {
    let timeSeries
    const tasksList = Array.from(dbInMemory.getTable('tasksList')) || []
    const lastSync = tasksTimeSeriesStore.get('lastSync')

    if (!lastSync) {
      try {
        timeSeries = await getCompletedTasksHistory({
          authKey: settingsStore.get('apiKey'),
          settingsStore
        }, { weeks: 3 })

        tasksTimeSeriesStore.set('data', timeSeries)
        tasksTimeSeriesStore.set('lastSync', new Date().getTime())
      } catch (e) {
        console.error('Cannot complete the tasks time history series.')
        console.log(e)
      }
    } else if (minutesHasPast(lastSync, settingsStore.get('refreshTimeInterval'))) {
      const daysToFetch = calculateDaysToFetch(lastSync)
      const fetchedTimeSeries = await getCompletedTasksHistory({
        authKey: settingsStore.get('apiKey'),
        settingsStore
      }, { days: daysToFetch })
      console.log('timeseries before', fetchedTimeSeries)

      const newTimeSerie = mergeTimeSeries(tasksTimeSeriesStore.get('data'), fetchedTimeSeries)
      tasksTimeSeriesStore.set('data', newTimeSerie)
      tasksTimeSeriesStore.set('lastSync', new Date().getTime())
      timeSeries = newTimeSerie
    } else {
      timeSeries = tasksTimeSeriesStore.get('data')
    }

    console.log('timeseries after', timeSeries)
    return { tasksList, timeSeries }
  }
}

function minutesHasPast (startTimestamp, minutesPast) {
  return (Date.now() - startTimestamp) > minutesPast
}

function calculateDaysToFetch (lastSyncTimestamp) {
  const oneDay = 1000 * 60 * 60 * 24
  const current = Date.now()
  const delta = current - lastSyncTimestamp

  if (delta <= oneDay) {
    return 1
  }
  return Math.ceil(delta / oneDay)
}
