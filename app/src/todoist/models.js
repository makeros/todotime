/* Task example
 * @params {object} data - : {
  id: 4466491896,
  assigner: 0,
  project_id: 2212360029,
  section_id: 0,
  order: 163,
  content: 'kupić mąkę na pizze',
  completed: false,
  label_ids: [ 2154047933 ],
  priority: 1,
  comment_count: 0,
  creator: 23002750,
  created: '2021-01-06T12:30:39Z',
  due: { recurring: false, string: '12 sty', date: '2021-01-12' },
  url: 'https://todoist.com/showTask?id=4466491896',
  todotime: { labels: [ [Object] ] }
}
@returns {object}
 */

exports.taskWithTimeModel = function taskWithTimeModel (data, fn) {
  return taskModel(data, (_data) => {
    return {
      ..._data,
      todotime: data.todotime
    }
  })
}

/*
  @param {object} data -
  {
    id: 4466491896,
    assigner: 0,
    project_id: 2212360029,
    section_id: 0,
    order: 163,
    content: 'kupić mąkę na pizze',
    completed: false,
    label_ids: [ 2154047933 ],
    priority: 1,
    comment_count: 0,
    creator: 23002750,
    created: '2021-01-06T12:30:39Z',
    due: { recurring: false, string: '12 sty', date: '2021-01-12' },
    url: 'https://todoist.com/showTask?id=4466491896'
  }
 */

exports.taskModel = taskModel

function taskModel (data, fn) {
  const { id, content, label_ids, completed } = data
  if (typeof fn === 'function') {
    return fn({ id, content, label_ids, completed })
  }
  return { id, content, label_ids, completed }
}

function todotimeLabelModel (data) {

}
