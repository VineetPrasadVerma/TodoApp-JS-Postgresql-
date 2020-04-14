const addListInput = document.querySelector('#add-list-input')
const addTaskInput = document.querySelector('#add-task-input')
const showListContainer = document.querySelector('#show-lists-container')
const showTaskContainer = document.querySelector('#show-tasks-container')

// const lists = window.fetch('http://127.0.0.1:3000/lists').then(res => res.json()).catch(err => console.log(err)).then(data => console.log(data))
// console.log(lists)
// const selectedList = []

const baseURL = '/lists'
// let lists = []

const fetchDB = async (reqObj) => {
  try {
    const res = await window.fetch(reqObj.url, reqObj.init)
    const data = await res.json()

    if (res.status === 200 || res.status === 201) {
      return data
    } else if (res.status === 500) {
      console.log(data)
    } else if (res.status === 404) {
      console.log(data)
    }
  } catch (error) {
    console.log('Error in fetch DB')
  }
  // console.log(result.json()
  // return result.json()
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

const renderLists = list => {
  // lists.forEach(list => {
  //   const divElement = document.createElement('div')
  //   const span = document.createElement('span')
  //   span.textContent = list.list_name
  //   span.id = 'list-item'
  //   divElement.appendChild(span)

  //   const span1 = document.createElement('span')
  //   const span2 = document.createElement('span')
  //   span1.innerHTML = '<i style="float:right; padding-right:10px" class="fa fa-pencil-square-o" aria-hidden="true"></i>'
  //   span2.innerHTML = '<i style="float:right" class="fa fa-trash" aria-hidden="true"></i>'
  //   divElement.appendChild(span2)
  //   divElement.appendChild(span1)

  //   // console.log(span1.previousElementSibling)
  //   span.setAttribute('onclick', 'renderSelectedListTasksOnClick(event)')
  //   span1.setAttribute('onclick', 'editSelectedListOnClick(event)')
  //   span2.setAttribute('onclick', 'deleteSelectedListOnClick(event)')

  //   divElement.id = list.list_id
  //   divElement.style.padding = '5px'
  //   showListContainer.appendChild(divElement)
  // })

  const divList = createElement(
    'div',
    { id: list.list_id },
    createElement('span', { id: 'list-item' }, list.list_name),
    createElement('i', { className: 'fa fa-trash', ariahidden: 'true', onclick: deleteList }),
    createElement('i', { className: 'fa fa-pencil-square-o', ariahidden: 'true', onclick: editList })

  )

  showListContainer.appendChild(divList)
}

const deleteList = event => {
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

const deleteListDB = async (reqObj) => {
  const deletedMessage = await fetchDB(reqObj)
  console.log(deletedMessage)
}

const editList = event => {
  const parentDiv = event.target.parentNode
  parentDiv.childNodes[1].classList.add('hide')
  parentDiv.childNodes[2].classList.add('hide')
  const inputElement = createElement('input', { type: 'text', value: parentDiv.firstChild.textContent })
  // const input = document.createElement('input')
  // input.type = 'text'
  // input.value = parentDiv.firstChild.textContent
  parentDiv.replaceChild(inputElement, parentDiv.firstChild)
  inputElement.focus()
  inputElement.addEventListener('keyup', function (event) {
    if (event.keyCode === 13) {
      // console.log(parentDiv.id)
      // console.log(this.value)

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

      // console.log(event.target.parentNode.parentNode)
      // reset(event.target.parentNode.parentNode)
      // renderLists(lists)
      // const span = document.createElement('span')
      // span.textContent = this.value
      const spanElement = createElement('span', { onclick: renderTask }, this.value)
      parentDiv.replaceChild(spanElement, parentDiv.firstChild)
      // span.setAttribute('onclick', 'renderSelectedListTasksOnClick(event)')
      parentDiv.childNodes[1].classList.remove('hide')
      parentDiv.childNodes[2].classList.remove('hide')
    }
  })
}
const load = async () => {
  document.getElementById('lists-container').classList.remove('hide')

  const reqObj = {
    url: baseURL + '/',
    init: {
      method: 'GET'
    }
  }

  const lists = await fetchDB(reqObj)
  lists.forEach(list => renderLists(list))
}

load()

const addNewListDB = async (reqObj) => {
  const newList = await fetchDB(reqObj)
  renderLists(newList[0])
  // lists.push(newList[0])
}

const updateListDB = async (reqObj) => {
  const updatedList = await fetchDB(reqObj)
}

addListInput.addEventListener('keyup', function (event) {
  // searchList(event)

  if (event.keyCode === 13) {
    event.preventDefault()

    if (this.value === '') {
      addListInput.placeholder = ' Can\'t add empty list'
      return
    }

    // console.log(event.target.value)
    const reqObj = {
      url: baseURL + '/',
      init: {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ listName: event.target.value })
      }
    }
    // console.log(reqObj.url)
    addNewListDB(reqObj)

    this.value = ''
    addListInput.placeholder = ' Search | Add Lists'
    // console.log(addListInput.nextSibling.innerHTML)
    // reset(addListInput.nextElementSibling)
  }
})

const renderTask = () => {

}
