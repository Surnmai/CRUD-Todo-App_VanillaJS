const inputField = document.getElementById('inputField')
const addTask = document.getElementById('addTask')
const alertNote = document.querySelector('.alert')

// Display table content when add button is not clicked
showTask()

// Edit Global Variables
let editSet = false
let editVal
let index

addTask.addEventListener('submit', function(e){
    e.preventDefault()
    // console.log('Heloo');
    if (inputField.value.trim() !== '' && !editSet) {
        // console.log('I am not empty and true');
        // Storing values to local storage
        if (localStorage.getItem('Task List') === null) {
            listArray = []
        }else{
            listArray = JSON.parse(localStorage.getItem('Task List'))
        }
        listArray.push(inputField.value)
        localStorage.setItem('Task List', JSON.stringify(listArray))
        // console.log('Ohk It works');
        displayAlert("Task Added", "success")
        showTask()
        refreshPage() //Refresh page upon submit button fired
    }
    else if (inputField.value.trim() !== '' && editSet) {
        // console.log('Hello edit will work');
        //Assing input field value to local storage corresponding index 

        // console.log(index);
        
        editVal.textContent = inputField.value.trim()
        // console.log(editVal.textContent);
        // Using the same array name 'listArray' or assingning the values to a 'let' variable permits data overriding
        listArray = JSON.parse(localStorage.getItem('Task List'))
        listArray[index] = editVal.textContent
        // console.log(JSON.parse(localStorage.getItem('Task List')))
        // console.log(JSON.parse(localStorage.getItem('Task List')[index]))
        localStorage.setItem('Task List', JSON.stringify(listArray))
        displayAlert("Task Edited", "success")
        showTask()
        refreshPage() //Refresh page upon submit button fired
    }
    else{
        // console.log('I am empty');
        displayAlert('Cannot be empty','danger')
    }
})


// Functions
function showTask(){
    // Assigning values of local storage to ListArray if Key (Task List) don't exist
    if (localStorage.getItem('Task List') === null) {
        listArray = []
    }else{
        listArray = JSON.parse(localStorage.getItem('Task List'))
    }
    // Pending task left
    const pendingTaskLeft = document.querySelector('.numLeft')
    pendingTaskLeft.textContent = listArray.length

    // Display data in table and screen
    const tableItems = document.querySelector('.tableList')
    const tableList = listArray.map(function(value, index){
        return `<tr>
        <th scope="row">${index +1}</th>
        <td><h3>${value}</h3></td>
        <td class="float-right" >
            <button class="btn btn-info rounded-pill edit" style="width: 90px;" data-id="${index}" >Edit</button>
            <button class="btn btn-danger rounded-pill deleteSingle" style="width: 90px;" data-id="${index}" >Delete</button>
        </td>
    </tr>`
    }).join('')
    // console.log(tableList);
    tableItems.innerHTML = tableList 
    inputField.value = ''
    

    // displayAlert('Task Added Successfully', 'success')
}

// Alert and time out function 
function displayAlert(text, color){
    // inputField.value = ''

    alertNote.classList.add(color)
    alertNote.textContent = text

    setTimeout(function(){
        alertNote.classList.remove(color)
        alertNote.textContent = ''
    },2000)
}

//Refresh page function
function refreshPage(){
    window.location.reload()
}


//Delete single item
const del = document.querySelectorAll('.deleteSingle')
del.forEach(function(item){
    item.addEventListener('click', function(a){
        // console.log('Hello');
        // console.log(a.currentTarget.dataset.id);
        index = a.currentTarget.dataset.id
        // console.log(index);
        listArray = JSON.parse(localStorage.getItem('Task List'))
        listArray.splice(index, 1)
        localStorage.setItem('Task List',JSON.stringify(listArray))
        // showTask()
        displayAlert("Task Deleted", "danger")
        refreshPage() //Refresh the page 
    })
})

//Edit items
const edit = document.querySelectorAll('.edit')
const addBtn = document.querySelector('.addBtn')
edit.forEach(function(item){
    item.addEventListener('click', function(e){
        // console.log(e);
        // console.log(e.currentTarget);
        // console.log(e.currentTarget.dataset.id);
        // console.log(e.currentTarget.parentElement.previousElementSibling.textContent);

        //OPTION ONE
        editVal = e.currentTarget.parentElement.previousElementSibling
        inputField.value= editVal.textContent
        addBtn.textContent = 'Edit' //Changing the textcontent of the Add button to Edit

        // OPTION TWO
         index = e.currentTarget.dataset.id //Grabing the id of data-id
        // inputField.value.trim() = JSON.parse(localStorage.getItem('Task List'))[index] // Passing the value index of the storage to the input field
        editSet = true
        
    })
})

//Delete all
const deleteAll = document.querySelector('.clear-all')
deleteAll.addEventListener('click', function(){
    // console.log('hello');
    localStorage.removeItem(listArray)
    listArray = []
    localStorage.setItem('Task List', JSON.stringify(listArray))
    const footer = document.querySelector('.footer')
    footer.classList.add('emptyTable')
    displayAlert("Task Cleared", "danger")
    showTask() // refresh and display what is in local storage 
})

// Search for values
const searchItem = document.querySelector('.searchField')
searchItem.addEventListener('input', function(){
    let trList = document.querySelectorAll('tr')
    Array.from(trList).forEach(function(item){
        // console.log(item);
        const searchedValues = item.getElementsByTagName('td')[0].textContent //The index of 0 will return the first index since there are two td's (table data) within the tr (table row)
        // console.log(searchedValues);
        const regEx = new RegExp(searchItem.value, 'gi') // gi here means global insensitive. Supposing there isn't any 'g' it will return the first match and since there is a 'g' it returns whatever match it finds
        if (searchedValues.match(regEx)) {
            item.style.display = 'table-row' //table-row here maintains some of data when clearing the search 
        }
        else{
            item.style.display = 'none'
            // displayAlert("Match not found", "success")
            // searchItem.value = 'Match not found'
        }
    })
})