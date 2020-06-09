module.exports = function getTimeInMinutes (tasks) {
  return tasks.reduce((acc, task) => {
    return task.todotime.labels.reduce((acc, label) => {
      const value = Number.parseInt(label.value, 10)
      return Number.isNaN(value) ? acc : acc + value
    }, 0) + acc
  }, 0)
}
