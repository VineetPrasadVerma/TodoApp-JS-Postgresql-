const topContainer = document.querySelector('#container')
const addListInput = document.querySelector('#add-list-input')
const addTaskInput = document.querySelector('#add-task-input')
const showListContainer = document.querySelector('#show-lists-container')
const showTaskContainer = document.querySelector('#show-tasks-container')
const clearTaskButton = document.querySelector('#clear-task-button')
const backButton = document.querySelector('#back-button')
// const lists = window.fetch('http://127.0.0.1:3000/lists').then(res => res.json()).catch(err => console.log(err)).then(data => console.log(data))
// console.log(lists)

// const selectedList = []
let lists = []

const baseURL = '/lists'

const fetchDB = async (reqObj) => {
  try {
    const res = await window.fetch(reqObj.url, reqObj.init)
    const data = await res.json()

    // console.log(res, data)
    if (res.status === 200 || res.status === 201) {
      // console.log('vin', data)
      return data
    } else if (res.status === 500) {
      // showError(res.status, data)
      return null
    } else if (res.status === 404) {
      // showError(res.status, data)
      return null
    }
  } catch (error) {
    // console.log('here')
    console.log(error)
    // showError(500, { message: 'Can\'t fetch from DB' })
  }
}

// const showError = async (status, data) => {
//   topContainer.classList.add('hide')

//   const errorTag = document.getElementById('error')
//   errorTag.style.fontsize = '100px'
//   errorTag.textContent = status + data.message
// }

const reset = element => {
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }
}

const createElement = (type, props, ...children) => {
  const dom = document.createElement(type)
  if (props) Object.assign(dom, props)
  for (const child of children) {
    if (typeof child !== 'string') dom.appendChild(child)
    else dom.appendChild(document.createTextNode(child))
  }
  return dom
}

const addNewListDB = async (reqObj) => {
  const newList = await fetchDB(reqObj)

  lists.push(newList[0])
  renderLists(newList[0])
}

const readListsDB = async (reqObj) => {
  const lists = await fetchDB(reqObj)
  return lists
}

const deleteListDB = async (reqObj) => {
  await fetchDB(reqObj)

  const tempReqObj = {
    url: baseURL + '/',
    init: {
      method: 'GET'
    }
  }

  lists = await fetchDB(tempReqObj)
  // console.log(deletedMessage)
}

const updateListDB = async (reqObj) => {
  await fetchDB(reqObj)

  const tempReqObj = {
    url: baseURL + '/',
    init: {
      method: 'GET'
    }
  }

  lists = await fetchDB(tempReqObj)
}

const searchList = event => {
  addListInput.placeholder = ' Search | Add Lists'
  const searchedList = lists.filter(list => list.list_name.toLowerCase().includes(event.target.value.toLowerCase()))
  reset(showListContainer)
  searchedList.forEach(list => renderLists(list))
}

addListInput.addEventListener('keyup', function (event) {
  searchList(event)

  if (event.keyCode === 13) {
    event.preventDefault()

    load()

    if (this.value === '') {
      addListInput.placeholder = ' Can\'t add empty list'
      return
    }

    const reqObj = {
      url: baseURL + '/',
      init: {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ listName: event.target.value })
      }
    }

    addNewListDB(reqObj)

    this.value = ''
    addListInput.placeholder = ' Search | Add Lists'
    // reset(addListInput.nextElementSibling)
  }
})

const editList = event => {
  const parentDiv = event.target.parentNode
  parentDiv.childNodes[1].classList.add('hide')
  parentDiv.childNodes[2].classList.add('hide')
  const inputElement = createElement('input', { type: 'text', value: parentDiv.firstChild.textContent })

  parentDiv.replaceChild(inputElement, parentDiv.firstChild)
  inputElement.focus()

  inputElement.addEventListener('keyup', async function (event) {
    if (event.keyCode === 13) {
      const reqObj = {
        url: baseURL + `/${event.target.parentNode.id}`,
        init: {
          method: 'PUT',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify({ listName: event.target.value })
        }
      }

      if (event.target.value === '') {
        inputElement.placeholder = 'Can\'t set empty name'
        return
      }

      updateListDB(reqObj)

      const spanElement = createElement('span', { id: 'list-item', onclick: loadTask }, this.value)
      parentDiv.replaceChild(spanElement, parentDiv.firstChild)

      parentDiv.childNodes[1].classList.remove('hide')
      parentDiv.childNodes[2].classList.remove('hide')
    }
  })
}

const deleteList = async event => {
  const parentDiv = event.target.parentNode.parentNode
  const childDiv = event.target.parentNode
  // console.log(childDiv.id)

  const reqObj = {
    url: baseURL + `/${event.target.parentNode.id}`,
    init: {
      method: 'DELETE'
    }
  }

  deleteListDB(reqObj)
  parentDiv.removeChild(childDiv)
}

const load = async () => {
  reset(showListContainer)
  topContainer.classList.remove('hide')
  document.getElementById('lists-container').classList.remove('hide')

  const reqObj = {
    url: baseURL + '/',
    init: {
      method: 'GET'
    }
  }

  lists = await readListsDB(reqObj)
  // console.log(lists)
  if (lists != null && lists.rowCount !== 0) lists.forEach(list => renderLists(list))
}

load()

const renderLists = list => {
  // console.log(list)
  const divList = createElement(
    'div',
    { id: list.list_id },
    createElement('span', { id: 'list-item', onclick: loadTask }, list.list_name),
    createElement('i', { className: 'fa fa-trash', ariahidden: 'true', onclick: deleteList }),
    createElement('i', { className: 'fa fa-pencil-square-o', ariahidden: 'true', onclick: editList })
  )

  showListContainer.appendChild(divList)
}

backButton.onclick = (event) => {
  document.querySelector('#tasks-container').classList.add('hide')
  document.getElementById('todo-heading').classList.remove('hide')

  reset(showTaskContainer)
  load()
}

clearTaskButton.onclick = event => clearCompletedTask(event)

const getTasks = async (listId) => {
  const reqObj = {
    url: baseURL + '/' + listId + '/tasks',
    init: {
      method: 'GET'
    }
  }

  const tasks = await fetchDB(reqObj)
  if (tasks != null && tasks.rowCount !== 0) return tasks
  return null
}

const loadTask = async event => {
  event.target.parentNode.parentNode.parentNode.classList.add('hide')
  document.getElementById('todo-heading').classList.add('hide')
  document.querySelector('#tasks-container').classList.remove('hide')

  const tasks = await getTasks(event.target.parentNode.id)
  if (!tasks) return
  tasks.forEach(task => renderTask(task))
}

const expandTask = (event) => { console.log(event.target.parentNode.id) }
const editTask = (event) => { console.log(event.target.parentNode.id) }
const deleteTask = (event) => { console.log(event.target.parentNode.id) }
const clearCompletedTask = (event) => { console.log('Inside clear completed task') }

const renderTask = task => {
  const taskCheckbox = createElement('input', { id: 'input', type: 'checkbox', checked: task.completed })
  const taskNameSpan = createElement('span', { id: 'task-item' }, task.task_name)
  const expandIcon = createElement('i', { id: 'task-expand-icon', className: 'fa fa-arrow-circle-down', ariahidden: 'true' })
  const trashIcon = createElement('i', { id: 'task-trash-icon', className: 'fa fa-trash', ariahidden: 'true' })
  const editIcon = createElement('i', { id: 'task-edit-icon', className: 'fa fa-pencil-square-o', ariahidden: 'true' })

  const divTask = createElement('div', { id: task.task_id }, taskCheckbox, taskNameSpan, expandIcon, trashIcon, editIcon)

  showTaskContainer.appendChild(divTask)

  expandIcon.onclick = event => expandTask(event, event.target.parentNode.id, task)

  trashIcon.onclick = event => deleteTask(event, event.target.parentNode.id)

  editIcon.onclick = event => editTask(event, event.target.parentNode.id)

  if (task.priority === '3') expandIcon.style.color = 'red'
  if (task.priority === '2') expandIcon.style.color = 'orange'
  if (task.priority === '1') expandIcon.style.color = 'green'

  if (taskCheckbox.checked) {
    taskNameSpan.style.textDecoration = 'line-through'
    taskNameSpan.style.color = 'grey'

    clearTaskButton.style.pointerEvents = ''
    clearTaskButton.style.color = ''

    expandIcon.classList.add('completed-task')
    trashIcon.classList.add('completed-task')
    editIcon.classList.add('completed-task')
  }

  taskCheckbox.onclick = (event) => {
    // console.log(event.target.parentNode)
    if (taskCheckbox.checked) {
      taskNameSpan.style.color = 'grey'
      taskNameSpan.style.textDecoration = 'line-through'
    } else {
      taskNameSpan.style.color = ''
      taskNameSpan.style.textDecoration = 'none'
    }

    // updateTask(selectedList.id, event.target.parentNode.id, { completed: input.checked })
  }
}
