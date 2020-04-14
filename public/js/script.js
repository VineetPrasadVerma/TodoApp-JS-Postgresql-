const addListInput = document.querySelector('#add-list-input')
const addTaskInput = document.querySelector('#add-task-input')
const showListContainer = document.querySelector('#show-lists-container')
const showTaskContainer = document.querySelector('#show-tasks-container')

// const lists = window.fetch('http://127.0.0.1:3000/lists').then(res => res.json()).catch(err => console.log(err)).then(data => console.log(data))
// console.log(lists)
// const selectedList = []
const baseURL = '/lists'

const fetchFromDB = async (reqObj) => {
  try {
    // console.log(baseURL + resourcePath)
    const res = await window.fetch(reqObj.url, reqObj.init)
    const data = await res.json()
    return data
  } catch (error) {
    console.log(error)
  }
  // console.log(result.json()
  // return result.json()
}

const renderLists = lists => {
  lists.forEach(list => {
    const divElement = document.createElement('div')
    const span = document.createElement('span')
    span.textContent = list.list_name
    span.id = 'list-item'
    divElement.appendChild(span)

    const span1 = document.createElement('span')
    const span2 = document.createElement('span')
    span1.innerHTML = '<i style="float:right; padding-right:10px" class="fa fa-pencil-square-o" aria-hidden="true"></i>'
    span2.innerHTML = '<i style="float:right" class="fa fa-trash" aria-hidden="true"></i>'
    divElement.appendChild(span2)
    divElement.appendChild(span1)

    // console.log(span1.previousElementSibling)
    span.setAttribute('onclick', 'renderSelectedListTasksOnClick(event)')
    span1.setAttribute('onclick', 'editSelectedListOnClick(event)')
    span2.setAttribute('onclick', 'deleteSelectedListOnClick(event)')

    divElement.id = list.list_id
    divElement.style.padding = '5px'
    showListContainer.appendChild(divElement)
  })
}

const load = async () => {
  document.getElementById('lists-container').classList.remove('hide')

  const req = {
    url: baseURL + '/',
    init: {
      method: 'GET'
    }
  }

  const lists = await fetchFromDB(req)
  renderLists(lists)
}

load()
