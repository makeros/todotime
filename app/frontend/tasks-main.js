/* globals Elm */
const renderer = require('./../renderer.js')

const bus = renderer.getTasksList()
let app

// TODO: what will hapen when we start to refresh the open window all the time?
//  Will the bus be destroyed?

bus.send('tasks:init')
bus.once('tasks:init:reply', (event, payload) => {
  console.log('fetch new tasks', payload)
  const { data: { tasksList, timeSeries } } = payload

  if (!app) {
    app = Elm.Tasks.init({
      flags: {
        tasksList,
        timeSeries
      }
    })
  }
})

bus.on('tasks:refresh', (event, payload) => {
  const { data: { tasksList, timeSeries } } = payload
  app.ports.tasksListCallback.send({ tasksList, timeSeries })
})
