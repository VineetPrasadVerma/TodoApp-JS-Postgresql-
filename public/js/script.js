const topContainer = document.querySelector('#container')
const addListInput = document.querySelector('#add-list-input')
const addTaskInput = document.querySelector('#add-task-input')
const showListContainer = document.querySelector('#show-lists-container')
const showTaskContainer = document.querySelector('#show-tasks-container')
const clearTaskButton = document.querySelector('#clear-task-button')
const backButton = document.querySelector('#back-button')

// const lists = window.fetch('http://127.0.0.1:3000/lists').then(res => res.json()).catch(err => console.log(err)).then(data => console.log(data))
// console.log(lists)

let selectedListId = 0
let lists = []
const baseURL = '/lists'

const fetchDB = async (reqObj) => {
  try {
    const res = await window.fetch(reqObj.url, reqObj.init)
    const data = await res.json()

    // console.log(res, data)
    if (res.status === 200 || res.status === 201) {
      return data
    } else if (res.status === 500) {
      showError(res.status, data)
      return null
    } else if (res.status === 404) {
      showError(res.status, data)
      return null
    }
  } catch (error) {
    // console.log('here')
    console.log(error)
    // showError(500, { message: 'Can\'t fetch from DB' })
  }
}

const showError = (status, data) => {
  topContainer.classList.add('hide')

  const errorTag = document.getElementById('error')
  errorTag.classList.remove('hide')

  errorTag.textContent = status + ' : ' + data.message
}

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

const readListsDB = async (reqObj) => {
  const listsDB = await fetchDB(reqObj)
  if (listsDB != null && listsDB.rowCount !== 0) {
    lists = listsDB
    return listsDB
  } else {
    lists = []
    return null
  }
}

const addNewListDB = async (reqObj) => {
  const newList = await fetchDB(reqObj)
  // console.log(lists)
  if (newList) {
    lists.push(newList[0])
    renderLists(newList[0])
  }
}

const deleteListDB = async (reqObj) => {
  await fetchDB(reqObj)

  const tempReqObj = {
    url: baseURL + '/',
    init: {
      method: 'GET'
    }
  }

  await readListsDB(tempReqObj)
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

  await readListsDB(tempReqObj)
}

const readTasksDB = async (reqObj) => {
  const tasks = await fetchDB(reqObj)
  if (tasks != null && tasks.rowCount !== 0) return tasks
  return null
}

const addNewTaskDB = async (reqObj) => {
  const newTask = await fetchDB(reqObj)
  if (newTask) renderTask(newTask[0])
}

const updateTaskDB = async (reqObj) => {
  await fetchDB(reqObj)
}

const deleteTaskDB = async (reqObj) => {
  await fetchDB(reqObj)
}

const deleteCompletedTasksDB = async (reqObj) => {
  await fetchDB(reqObj)
}

const searchList = event => {
  addListInput.placeholder = ' Search | Add Lists'
  if (!lists.length) return
  const searchedList = lists.filter(list => list.list_name.toLowerCase().includes(event.target.value.toLowerCase()))
  reset(showListContainer)
  searchedList.forEach(list => renderLists(list))
}

addListInput.addEventListener('keyup', async function (event) {
  searchList(event)

  if (event.keyCode === 13) {
    event.preventDefault()

    // load()

    if (this.value === '') {
      addListInput.placeholder = ' Can\'t add empty list'
      return
    }

    load()

    const reqObj = {
      url: baseURL + '/',
      init: {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ listName: event.target.value })
      }
    }

    await addNewListDB(reqObj)

    this.value = ''
    addListInput.placeholder = ' Search | Add Lists'
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

      await updateListDB(reqObj)

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

  await deleteListDB(reqObj)
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

  const lists = await readListsDB(reqObj)
  // console.log(listsDB.rowCount)

  if (lists) {
    // console.log('inside')
    // lists = listsDB
    lists.forEach(list => renderLists(list))
  }

  // console.log(lists)
  // { if (lists != null && lists.rowCount !== 0) lists.forEach(list => renderLists(list)) }
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

clearTaskButton.onclick = event => clearCompletedTask()

const loadTask = async event => {
  selectedListId = event.target.parentNode.id
  document.getElementById('listName').textContent = event.target.parentNode.textContent

  event.target.parentNode.parentNode.parentNode.classList.add('hide')
  document.getElementById('todo-heading').classList.add('hide')
  document.querySelector('#tasks-container').classList.remove('hide')

  const reqObj = {
    url: baseURL + '/' + event.target.parentNode.id + '/tasks',
    init: {
      method: 'GET'
    }
  }

  const tasks = await readTasksDB(reqObj)
  if (!tasks) return
  tasks.forEach(task => renderTask(task))
}

const renderUpdatedOrderOfTask = async () => {
  reset(showTaskContainer)

  const reqObj = {
    url: baseURL + '/' + selectedListId + '/tasks',
    init: {
      method: 'GET'
    }
  }

  const tasks = await readTasksDB(reqObj)
  if (!tasks) return
  tasks.forEach(task => renderTask(task))
}

addTaskInput.addEventListener('keyup', function (event) {
  if (event.keyCode === 13) {
    event.preventDefault()

    if (this.value === '') {
      addTaskInput.placeholder = ' Can\'t add empty task'
      return
    }

    const reqObj = {
      url: baseURL + '/' + selectedListId + '/tasks',
      init: {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ taskName: event.target.value })
      }
    }

    addNewTaskDB(reqObj)

    this.value = ''
    addTaskInput.placeholder = ' Search | Add Tasks'
  }
})

const expandTask = (event, task) => {
  const parentDiv = event.target.parentNode

  if (parentDiv.querySelector('#task-details')) {
    parentDiv.removeChild(parentDiv.lastChild)
    return
  }

  const labelSpan = createElement('span', { id: 'label' }, 'Notes:')
  const textareaTextBox = createElement('textarea', { id: 'notes', textContent: task.note })
  const schedulingInput = createElement('input', { id: 'scheduling', type: 'date', value: task.scheduled })
  const selectList = createElement('select', { id: 'priority' })

  const priorityArr = ['None', 'Low', 'Medium', 'High']
  for (let i = 0; i < priorityArr.length; i++) {
    const optionElement = createElement('option', { value: i, text: priorityArr[i] })
    selectList.appendChild(optionElement)
  }

  selectList.value = task.priority

  const taskDetailsContainer = createElement('div', { id: 'task-details' }, labelSpan, textareaTextBox, schedulingInput, selectList)
  parentDiv.appendChild(taskDetailsContainer)

  textareaTextBox.onchange = async (event) => {
    const reqObj = {
      url: baseURL + '/' + selectedListId + '/tasks/' + task.task_id,
      init: {
        method: 'PUT',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ note: event.target.value })
      }
    }

    await updateTaskDB(reqObj)
  }

  schedulingInput.onchange = async (event) => {
    const reqObj = {
      url: baseURL + '/' + selectedListId + '/tasks/' + task.task_id,
      init: {
        method: 'PUT',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ scheduled: event.target.value })
      }
    }

    if (event.target.value === '') {
      reqObj.init.body = JSON.stringify({ scheduled: null })
      await updateTaskDB(reqObj)
    } else {
      await updateTaskDB(reqObj)
    }

    renderUpdatedOrderOfTask()
  }

  selectList.onchange = async (event) => {
    const reqObj = {
      url: baseURL + '/' + selectedListId + '/tasks/' + task.task_id,
      init: {
        method: 'PUT',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ priority: event.target.value })
      }
    }

    await updateTaskDB(reqObj)
    renderUpdatedOrderOfTask()
  }
}

const editTask = (event) => {
  const parentDiv = event.target.parentNode

  for (let i = 0; i < 5; i++) {
    parentDiv.childNodes[i].classList.add('hide')
  }

  const taskInput = createElement('input', { type: 'text', value: parentDiv.childNodes[1].textContent })

  parentDiv.appendChild(taskInput)
  taskInput.focus()

  taskInput.addEventListener('keyup', async function (event) {
    if (event.keyCode === 13) {
      if (this.value === '') {
        taskInput.placeholder = 'Can\'t add empty task'
        return
      }

      const reqObj = {
        url: baseURL + '/' + selectedListId + '/tasks/' + parentDiv.id,
        init: {
          method: 'PUT',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify({ task_name: event.target.value })
        }
      }

      await updateTaskDB(reqObj)

      parentDiv.removeChild(taskInput)
      parentDiv.childNodes[1].textContent = this.value

      for (let i = 0; i < 5; i++) {
        parentDiv.childNodes[i].classList.remove('hide')
      }
    }
  })
}

const deleteTask = async (event) => {
  const parentDiv = event.target.parentNode.parentNode
  const childDiv = event.target.parentNode
  const reqObj = {
    url: baseURL + '/' + selectedListId + '/tasks/' + childDiv.id,
    init: {
      method: 'DELETE'
    }
  }

  await deleteTaskDB(reqObj)
  parentDiv.removeChild(childDiv)
}

const clearCompletedTask = async () => {
  const reqObj = {
    url: baseURL + '/' + selectedListId + '/tasks/',
    init: {
      method: 'DELETE'
    }
  }

  await deleteCompletedTasksDB(reqObj)
  renderUpdatedOrderOfTask()
}

const renderTask = task => {
  const taskCheckbox = createElement('input', { id: 'input', type: 'checkbox', checked: task.completed })
  const taskNameSpan = createElement('span', { id: 'task-item' }, task.task_name)
  const expandIcon = createElement('i', { id: 'task-expand-icon', className: 'fa fa-arrow-circle-down', ariahidden: 'true' })
  const trashIcon = createElement('i', { id: 'task-trash-icon', className: 'fa fa-trash', ariahidden: 'true', onclick: deleteTask })
  const editIcon = createElement('i', { id: 'task-edit-icon', className: 'fa fa-pencil-square-o', ariahidden: 'true', onclick: editTask })

  const divTask = createElement('div', { id: task.task_id }, taskCheckbox, taskNameSpan, expandIcon, trashIcon, editIcon)

  showTaskContainer.appendChild(divTask)

  if (task.priority === 3) expandIcon.style.color = 'red'
  if (task.priority === 2) expandIcon.style.color = 'orange'
  if (task.priority === 1) expandIcon.style.color = 'green'

  if (task.completed) {
    taskNameSpan.style.textDecoration = 'line-through'
    taskNameSpan.style.color = 'grey'

    clearTaskButton.style.pointerEvents = 'auto'
    clearTaskButton.style.color = 'black'

    expandIcon.classList.add('completed-task')
    trashIcon.classList.add('completed-task')
    editIcon.classList.add('completed-task')
  } else {
    clearTaskButton.style.pointerEvents = 'none'
    clearTaskButton.style.color = 'grey'
  }

  expandIcon.onclick = event => expandTask(event, task)

  taskCheckbox.onclick = async (event) => {
    const reqObj = {
      url: baseURL + '/' + selectedListId + '/tasks/' + task.task_id,
      init: {
        method: 'PUT',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ completed: taskCheckbox.checked })
      }
    }

    await updateTaskDB(reqObj)
    renderUpdatedOrderOfTask()
  }
}
