/* globals Elm */
const renderer = require('./../renderer.js')

const app = Elm.Tasks.init()

app.ports.tasksList.subscribe(function () {
  renderer.getTasksList(function (_, payload) {
    console.log(payload)
    app.ports.tasksList.send(payload)
  })
})

// {
//   id,
//   conent,
//   todotime: lables []
// }

// payload.data.forEach(item => {
//   tbody += `<tr><td>${item.id}</td><td>${item.content}</td><td>${item.todotime.labels.map(i => i.name).join(',')}</td></tr>`
// })
// const renderer = require('./../renderer.js')

// renderer.getUserSettings(function (userSettings) {

//   app.ports.userSettingsSave.subscribe(function (settings) {
//     renderer.userSettingsSave(function (err) {
//       if (err) {
//         alert('There was an error while saving the preferences.')
//       } else {
//         alert('Preferences saved!')
//       }
//     }, settings)
//   })
//
//   app.ports.checkTodoistPremium.subscribe(function (apiKey) {
//     renderer.checkTodoistPremium(function (isPremium) {
//       app.ports.checkTodoistPremiumCallback.send(isPremium)
//     }, apiKey)
//   })
//
//   app.ports.closeWindow.subscribe(function () {
//     renderer.closeWindow()
//   })
// })
