const getLabelRegExp = require('./get-label-regexp')

exports.extractValueFromLabel = function extractValueFromLabel (labelValue) {
  return parseInt(value.match(getLabelRegExp())[1])
}
