const { systemPreferences } = require('electron')
const path = require('path')

module.exports = {
  getWarningIcon: function () {
    return path.join(getAssetsPath(), systemPreferences.isDarkMode() ? 'todotime_tray_exclamation_w_19.png' : 'todotime_tray_exclamation_b_19.png')
  },
  getNormalIcon: function () {
    return path.join(getAssetsPath(), systemPreferences.isDarkMode() ? 'todotime_tray_normal_w@2x.png' : 'todotime_tray_normal_b@2x.png')
  },
  getInfoIcon: function () {
    return path.join(getAssetsPath(), systemPreferences.isDarkMode() ? 'todotime_tray_info_w_19.png' : 'todotime_tray_info_b_19.png')
  },
  getSuccessIcon: function () {
    return path.join(getAssetsPath(), systemPreferences.isDarkMode() ? 'todotime_tray_star_w_19.png' : 'todotime_tray_star_b_19.png')
  }
}

function getAssetsPath () {
  return path.join(__dirname, '..', 'assets')
}
