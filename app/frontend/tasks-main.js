const renderer = require('./../renderer.js')
const tableBody = document.querySelector('#table-body')
renderer.getTasksList(function (_, payload) {
  let tbody = ''
  payload.data.forEach(item => {
    tbody += `<tr><td>${item.id}</td><td>${item.content}</td><td>${item.todotime.labels.map(i => i.name).join(',')}</td></tr>`
  })

  tableBody.innerHTML = tbody
})
