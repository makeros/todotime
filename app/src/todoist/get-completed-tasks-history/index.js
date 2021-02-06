const httpsRequest = require('./../https-request')
const { getTasksByIds } = require('./get-tasks-by-ids')
const getLabels = require('./../get-labels.js')
const { filterAppLabels } = require('./labels.js')
const { getDateRanges } = require('./get-date-ranges')
const COMPLETED_URL = 'https://api.todoist.com/sync/v8/completed/get_all'

module.exports = function getCompleteTasksHistory ({ authKey, settingsStore }, { weeks = 0, days = 0 }) {
  const daysToFetch = weeks * 7 + days
  const datesRanges = getDateRanges(daysToFetch)

  return Promise.all(getEventsRequests(datesRanges, authKey))
    .then(flatEvents)
    .then(shrinkEvents)
    .then((events) => {
      const ids = events.map(event => event.object_id)
      return fetchIndividualTasks(events, ids, authKey)
    })
    .then(events => {
      return getLabels({ authKey })
        .then(filterAppLabels({ settingsStore }))
        .then(matchEventsWithValue(events))
    })
    .then(serializeOutput(daysToFetch))
}

function serializeToList (eventsWithValue, daysPlaceholder) {
  const _dataObject = eventsWithValue.reduce((acc, event) => {
    const utcDate = dayUTC(new Date(event.event_date))
    return {
      ...acc,
      [utcDate]: isNaN(acc[utcDate]) ? event.value : acc[utcDate] + event.value
    }
  }, daysPlaceholder)
  return Object.entries(_dataObject).map(entry => ([parseInt(entry[0], 10), entry[1]]))
}

function dayUTC (eventDate) {
  return Date.UTC(eventDate.getUTCFullYear(), eventDate.getUTCMonth(), eventDate.getUTCDate())
}

function flatEvents (responses) {
  return responses
    .map(resp => (resp.items))
    .reduce((acc, itemsArray) => {
      return acc.concat(itemsArray)
    }, [])
}

function shrinkEvents (events) {
  return events.map(event => {
    return {
      event_date: event.completed_date,
      object_id: event.task_id
    }
  })
}

function fetchIndividualTasks (events, ids, authKey) {
  return getTasksByIds({ authKey }, ids)
    .then(tasks => {
      return events.map(event => {
        const task = tasks.find(task => task.id === event.object_id)
        return {
          ...event,
          label_ids: task ? task.labels : []
        }
      })
    })
}

function matchEventsWithValue (events) {
  return definedLabels => {
    return events.map(event => {
      // If there are more labels with value then sum them
      const eventValue = event.label_ids.reduce((acc, labelId) => {
        const matchingLabel = definedLabels.find(l => l.id === labelId)
        return matchingLabel ? matchingLabel.value + acc : acc
      }, 0)
      return {
        ...event,
        value: eventValue
      }
    })
  }
}

function serializeOutput (daysToFetch) {
  return function (eventsWithValue) {
    const rangeDaysPlaceholder = generateDaysPlaceholder(daysToFetch)
    return serializeToList(eventsWithValue, rangeDaysPlaceholder)
  }
}

function getEventsRequests (datesRanges, authKey) {
  return datesRanges.map(dateEntry => {
    const completeUrl = COMPLETED_URL + '?limit=200&since=' + dateEntry.since + '&until=' + dateEntry.until
    return httpsRequest({ authKey }).get(completeUrl)
  })
}

function generateDaysPlaceholder (days) {
  const oneDay = 1000 * 60 * 60 * 24
  const current = Date.now()
  const placeholder = {}
  for (let i = 0; i < days; i++) {
    placeholder[dayUTC(new Date(current - (i * oneDay)))] = 0
  }
  return placeholder
}
