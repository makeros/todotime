const getLabelRegExp = require('./../get-label-regexp')

exports.extractValueFromLabel = function extractValueFromLabel (labelValue) {
  return parseInt(labelValue.match(getLabelRegExp())[1])
}
