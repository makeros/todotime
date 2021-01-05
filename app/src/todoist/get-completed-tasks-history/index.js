const httpsRequest = require('./../https-request')
const { getTasksByIds } = require('./get-tasks-by-ids')
const getLabels = require('./../get-labels.js')
const { filterAppLabels } = require('./labels.js')
const ACTIVITY_URL = 'https://api.todoist.com/sync/v8/activity/get?event_type=completed'

exports.daily = function ({ authKey, settingsStore }, { weeks = 0 }) {
  const calls = Array(weeks + 1)
    .fill(null)
    .map((_, index) => {
      return getActivityUrl(index)
    })
    .map(url => {
      return httpsRequest({ authKey }).get(url)
    })
  // console.log(calls)
  const events = Promise.all(calls)
    .then(responses => responses.reduce((events, response) => {
      return events.concat(response.events || [])
    }, []))
    .then(events => {
      return events.filter(event => {
        return event.object_type === 'item'
      })
        .map(event => {
          return {
            event_date: event.event_date,
            object_id: event.object_id
          }
        })
    })
    .then(events => {
      const ids = events.map(event => event.object_id)
      return getTasksByIds({ authKey }, ids)
        .then(tasks => {
          return events.map(event => {
            const task = tasks.find(task => task.id === event.object_id)
            return {
              ...event,
              label_ids: task ? task.label_ids : []
            }
          })
        })
    })
    .then(events => {
      return getLabels({ authKey })
        .then(labels => {
          return filterAppLabels({ settingsStore })(labels)
        })
        .then(definedLabels => {
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
        })
    })
    .then(groupByDay)

  return events
}

function getActivityUrl (week) {
  return `${ACTIVITY_URL}&page=${week}`
}

function groupByDay (eventsWithValue) {
  return eventsWithValue.reduce((acc, event) => {
    const eventDate = new Date(event.event_date)
    const utcDate = Date.UTC(eventDate.getUTCFullYear(), eventDate.getUTCMonth(), eventDate.getUTCDate())
    return {
      ...acc,
      [utcDate]: isNaN(acc[utcDate]) ? event.value : acc[utcDate] + event.value
    }
  }, {})
}
