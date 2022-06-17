const userList = document.querySelector("#user-list")
const pagination = document.querySelector(".pagination")
const searchForm = document.querySelector("#search-form")
const searchSubmit  = document.querySelector("#search-submit-button")
const searchInput = document.querySelector("#search-input") 
const BASE_URL = "https://lighthouse-user-api.herokuapp.com"
const INDEX_URL = BASE_URL + "/api/v1/users"
const itemPerPage = 24
const friends = []
let filterFriends = []
let friendOnline = []
const onlineList = document.querySelector(".online-list")

//get data from API and render list
axios
  .get(INDEX_URL)
  .then((response) => {
    let data = response.data

    
   
    friends.push(...data.results)
    renderPagination(friends.length)
    userDisplay(getPage(1))
    onlineFriends(friends)
  })
  .catch((err) => console.log(err))



//render user list
function userDisplay(data){
  let userHtml = ``
  data.forEach((item)=>{
    userHtml += `
    <div class="card m-3" style="width: 18rem;">
  <img src="${item.avatar}"  class="card-img-top mt-2" alt="...">
  <div class="card-body">
    <h5 class="card-title">${item.name}</h5>
    <p class="card-text"><i class="bi bi-geo-alt-fill"></i> ${item.region}</p>
    <a href="#" class="btn btn-primary more" data-bs-toggle="modal" data-bs-target="#exampleModal" data-id="${item.id}">know more</a>
    <button class="btn btn-info" data-id="${item.id}">+</button>
  </div>
</div>
    `
  })
  userList.innerHTML = userHtml
}

//show user info
userList.addEventListener("click",(e)=>{
  
  let target = e.target
  //show more info
  if(target.matches("a")){
    userInfoDisplay(target.dataset.id)
  }
  //add to favorite
  else if (target.matches(".btn-info")){
    addToFavorite(Number(target.dataset.id))
  }
})

// render info function
function userInfoDisplay(id){
  const userTitle = document.querySelector(".user-title")
  const userEmail = document.querySelector("#user-email")
  const userGender = document.querySelector("#user-gender")
  const userAge = document.querySelector("#user-age")
  const userBirthday = document.querySelector("#user-birthday")
  axios
  .get(INDEX_URL+ "/" + id)
  .then((response) => {
    data = response.data
    userTitle.innerHTML = data.name + `  ` +data.age
    userEmail.innerHTML = `<i class="fa-solid fa-envelope"></i> : ` + data.email
    userGender.innerHTML = `<i class="fa-solid fa-mars-double"></i> : ` + data.gender
    userBirthday.innerHTML = `<i class="fa-solid fa-cake-candles"></i> :  ` + data.birthday
  })
  .catch((err) => console.log(err))  
  
}


//render pagination
function renderPagination(friend){
    const pageNum = Math.ceil(friend/itemPerPage)
    let paginationHtml = ``
    for(let i = 1; i <= pageNum; i++){
        paginationHtml +=`
        <li class="page-item" ><a class="page-link" href="#" data-id="${i}">${i}</a></li>
        `
    }
    pagination.innerHTML = paginationHtml
}

//search
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault()
    
    const input = searchInput.value.trim().toLowerCase()
    filterFriends = friends.filter((item)=>{
        return item.name.toLowerCase().includes(input)
    })
    renderPagination(filterFriends.length)
    userDisplay(getPage(1))
})
//get page item array
function getPage(pageNum){
    let data = filterFriends.length?filterFriends:friends
    
    let indexStart = (pageNum - 1) * itemPerPage
    let indexEnd = indexStart + itemPerPage
    return data.slice(indexStart,indexEnd)
}

//differnet page render
pagination.addEventListener("click", (e)=>{
    const target = e.target
    let pageNum = target.dataset.id
    userDisplay(getPage(pageNum))
})

//add to favorite function
function addToFavorite(id){
  const list = JSON.parse(localStorage.getItem("myFavorite")) || []
  const friend = friends.find((x)=>(x.id === id))
  if (list.some((x) => x.id === id)) {
    return alert('The person is alreday in the list!')
  } 
  list.push(friend)
  localStorage.setItem("myFavorite", JSON.stringify(list))

  
}




//online friends function
function onlineFriends(friend){
  let numList = Math.floor(Math.random()*20)+1
  let numPerson = Math.floor(Math.random()*201)
  for(let i = 0; i < numList; i++){
    friendOnline.push(friend[Math.floor(Math.random()*201)])
  }
  console.log(friendOnline)
  let onlineHtml = ``
  friendOnline.forEach((item)=>{
    onlineHtml += `
    <span style="font-size: 16px; color: Dodgerblue;">
    <li><i class="fa-solid fa-circle pt-3" ></i>     ${item.name}</li>
    </span>
    `
  })
  onlineList.innerHTML = onlineHtml

}