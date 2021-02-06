/* globals Elm, alert */
const renderer = require('./../renderer.js')

renderer.getUserSettings(function (userSettings) {
  const app = Elm.Preferences.init({
    flags: userSettings
  })

  app.ports.userSettingsSave.subscribe(function (settings) {
    renderer.userSettingsSave(function (err) {
      if (err) {
        alert('There was an error while saving the preferences.')
      } else {
        alert('Preferences saved!')
      }
    }, settings)
  })

  app.ports.checkTodoistPremium.subscribe(function (apiKey) {
    renderer.checkTodoistPremium(function (isPremium) {
      app.ports.checkTodoistPremiumCallback.send(isPremium)
    }, apiKey)
  })

  app.ports.closeWindow.subscribe(function () {
    renderer.closeWindow()
  })
})
