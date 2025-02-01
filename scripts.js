let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Sunday', 'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

// << Populate date and time information >>
document.getElementById('divDay').textContent = DAYS[today.getDay()];
document.getElementById('divDate').textContent = `${MONTHS[currentMonth+1]} ${today.getDate()}, ${currentYear}`;
const updateTime =() => {  
  const now = new Date();   
  const currentTime = now.toLocaleTimeString();
  document.getElementById("divTime").textContent = currentTime;
  setInterval(updateTime, 1000);
}
updateTime();

// << Calendar Section >>
const datesDiv = document.querySelector('.dates');
const monthYear = document.querySelector('.month-year');
const btnPreMonth = document.querySelector('.btnPreMonth');
const btnNextMonth = document.querySelector('.btnNextMonth');
const btnShowAllTasks = document.getElementById('btnAllTasks');
const btnToggleTagDiv = document.getElementById('btnToggleTagDiv');
const tagDiv = document.getElementById('divTag');
const btnShowNoDate = document.getElementById('btnShowNoDate');
const btnNewTag = document.getElementById('btnNewTag');
const newTagDiv = document.getElementById('divNewTag');
const btnAddTag = document.getElementById('btnAddTag');
const inputTag = document.getElementById('inputTag');
const tagRadio = document.getElementById('tagRadio');
const btnDeleteTag = document.getElementById('btnDeleteTag');

function loadCalendar(month, year) {
  datesDiv.innerHTML = '';
  monthYear.textContent = `${MONTHS[month]}\n${year}`;
  // Get the first day of the month
  const firstDay = new Date(year, month, 1).getDay();
  // Get the number of days in the month
  const numOfDays = new Date(year, month + 1, 0).getDate();
  
  // Create empty cells for days of the week before the first day
  for (let i = 0; i < firstDay; i++) {
    const emptyDiv = document.createElement('div');
    datesDiv.appendChild(emptyDiv);
  }

  // Populate the days
  for (let i = 1; i <= numOfDays; i++) {
    const dayDiv = document.createElement('div');
    dayDiv.textContent = i;
    // Highlight current date
    if (i === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
      dayDiv.classList.add('current-date');   
    }
    //console.log(i,year,month,today.getMonth());
    datesDiv.appendChild(dayDiv);
  }
}

loadCalendar(currentMonth, currentYear);

// Show previous month
btnPreMonth.addEventListener('click', () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  loadCalendar(currentMonth, currentYear);
});

// Show next month
btnNextMonth.addEventListener('click', () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  loadCalendar(currentMonth, currentYear);
});

// Add click event to populate todo list on a selected date
datesDiv.addEventListener('click', (e) => {
  if (e.target.textContent !== '') {
    const selectedDate = dateToInputFormat(currentYear, currentMonth+1, e.target.textContent);
    //alert(selectedDate);
    const todos = getTodoList();
    todoList.innerHTML = '';
    todos.forEach(todo => {
      if(todo.date == selectedDate){
        createTodoItem(todo);
      }      
    });
    const localDate = dateToLocalFormat(selectedDate);
    if(!todoList.hasChildNodes()){
      createEmptyItem(`-- No tasks on ${localDate} --`);
    }        
  }
});

// << Left panel button group section >>
// Add click event to sort and display all todo tasks by date 
btnShowAllTasks.addEventListener('click', function(){
  let todos = getTodoList();
  todos = todos.sort((a,b) => new Date(a.date) -  new Date(b.date));
  //console.log(todos);
  todoList.innerHTML = '';
  todos.forEach(todo => {
    createTodoItem(todo);
  });
  if(!todoList.hasChildNodes()){
    createEmptyItem(`-- Your todo list is empty --`);
  }       
});

// Add click event to show tasks without date
btnShowNoDate.addEventListener('click', () => {
  let todos = getTodoList();
  todoList.innerHTML = '';
  todos.forEach(todo => {
    if(todo.date == ''){
      createTodoItem(todo);
    }
  })
  if(!todoList.hasChildNodes()){
    createEmptyItem(`-- All tasks have date information --`);
  }
});

// Add click event to toggle Sort by Tag panel
btnToggleTagDiv.addEventListener('click', function(){
  tagDiv.classList.toggle('hide');
  if(tagDiv.classList.contains('hide')){
    btnToggleTagDiv.textContent = 'Sort by Tag';
  }else
    btnToggleTagDiv.textContent = 'Close';
});

// Add click event to tag button and display todo list on a selected tag name 
tagDiv.addEventListener('click', (e) => {
  const selectedTag = e.target.textContent.slice(1);
  //console.log(selectedTag);
  let todos = getTodoList();
  todos = todos.sort((a,b) => new Date(a.date) -  new Date(b.date));
  todoList.innerHTML = '';
  todos.forEach(todo => {
    if(todo.tag == selectedTag){
      createTodoItem(todo);
    }      
  });
  if(!todoList.hasChildNodes()){
    createEmptyItem(`-- No tasks for ${e.target.textContent} --`);
  }        
});

// Add click event to toggle add/delete tag panel
btnNewTag.addEventListener('click', function(){ 
  newTagDiv.classList.toggle('hide');
  if(newTagDiv.classList.contains('hide')){
    btnNewTag.textContent = 'Add/Delete a Tag';
  }else
    btnNewTag.textContent = 'Close';  
});

// Capitalized the first letter of user input
inputTag.addEventListener('input',function(){
  const value = this.value;
  if (value.length > 0) {
    this.value = value.charAt(0).toUpperCase() + value.slice(1);
  }
});

// Add custom tag name
btnAddTag.addEventListener('click', addCustomTag);
function addCustomTag(){
  const tag = inputTag.value;
  if(tag === ''){
    alert('Please enter a tag name to add.')
    return;
  }
  const tags = getCustomTag();
  if(tag !== 'Work' && tag !== 'Home' && tag !== 'Life' && !tags.includes(tag)){
    createCustomTag(tag);
    saveCustomTag(tag);
    alert(`"#${tag}" is added to your tag options.\nCheck it out when you add a todo task.`);
    inputTag.value = ''; 
  }else{
    alert(`"#${tag}" is already in your tag options.`);
  }
}

// Save custom tag name to localStorage
function saveCustomTag(tag){
  let tags = getCustomTag();
  tags.push(tag);
  localStorage.setItem('tags',JSON.stringify(tags));
}

// Get custom tag name from localStorage
function getCustomTag(){
  return JSON.parse(localStorage.getItem('tags')) || [];
}
function loadCustomTag(){
  const tags = getCustomTag();
  tags.forEach(tag => {
    if(tags.length>0){
      createCustomTag(tag);
    }   
  });
}

// Populate custom tag name to UI
function createCustomTag(tag){
  // Populate new tag name option in add todo task panel
  const tagRadioOption = document.createElement('div');
  tagRadioOption.classList.add('form-check', 'form-check-inline');
  tagRadioOption.innerHTML = `<input class="form-check-input" type="radio" name="todoTag" id="${tag}" value="${tag}">
                              <label class="form-check-label" for="${tag}">${tag}</label>`;
  tagRadio.appendChild(tagRadioOption);
  // Populate new tag name button in sort by tag panel
  const btnTag = document.createElement('button');
  btnTag.classList.add('btn', 'btn-sm', 'm-1');
  btnTag.id = `btn${tag}`;
  btnTag.textContent = `#${tag}`;
  tagDiv.appendChild(btnTag);
}

// Remove custom tag name
btnDeleteTag.addEventListener('click', removeCustomTag);
function removeCustomTag(){
  const tag = inputTag.value;
  if(tag === ''){
    alert('Please enter a tag name to add.')
    return;
  }
  const tagButton = document.getElementById(`btn${tag}`);
  const tagRadio =  document.getElementById(tag);
  if(tag === 'Work'|| tag === 'Home' || tag == 'Life'){
    alert('Sorry!\nSystem tags "Work" / "Life" / "Home" are not removable.');
    return;
  }
  if(tagButton){
    tagButton.remove();
    tagRadio.parentElement.remove();
    let tags = getCustomTag();
    tags = tags.filter(e => e !== tag);
    localStorage.setItem('tags', JSON.stringify(tags));
    alert(`"${tag}" is removed from your tag options.`);
  }
  else{
    alert(`There is no "#${tag}" in your tag options.`);
  } 
  inputTag.value = '';
}

loadCustomTag();

// << Todo Section >>
const btnOpenTodo = document.getElementById('btnOpenTodo');
const divAddTodo = document.getElementById('divAddTodo');
const inputTodoTask = document.getElementById('todoTask');
const todoDate = document.getElementById('todoDate');
const todoTag = document.getElementsByName('todoTag');
const btnClear = document.getElementById('btnClear');
const btnCancel = document.getElementById('btnCancel');
const btnAddTask = document.getElementById('btnAddTask');
const todoList = document.querySelector('#divTodoList');

// Add click event to toggle add todo task panel
btnOpenTodo.addEventListener('click', function(){ 
  divAddTodo.classList.toggle('hide');
  if(divAddTodo.classList.contains('hide')){
    btnOpenTodo.textContent = '+ Add Todo';
  }else
    btnOpenTodo.textContent = 'Close';  
});

// Capitalized the first letter of user input
inputTodoTask.addEventListener('input',function(){
  const value = this.value;
  if (value.length > 0) {
    this.value = value.charAt(0).toUpperCase() + value.slice(1);
  }
});

btnAddTask.addEventListener('click', addTodoList);
btnClear.addEventListener('click', clearInput);
btnCancel.addEventListener('click', function(){
  clearInput();
  divAddTodo.classList.toggle('hide');
  btnOpenTodo.textContent = '+ Add Todo';
});

// Clear user input
function clearInput(){
  inputTodoTask.value = '';
  todoDate.value = ''; 
  todoTag[0].checked = true;
}

// Get todo list from localStorage
function getTodoList(){
  return JSON.parse(localStorage.getItem('todos')) || [];
}

// Load today's todo list
function loadTodayTodoList(){
  const todos = getTodoList();
  //console.log(todos);
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const year = today.getFullYear();
  const formattedDate = dateToInputFormat(year,month,day);
  todoList.innerHTML = '';
  //console.log(formattedDate);
  todos.forEach(todo => {
    if(todo.date == formattedDate){
      createTodoItem(todo);
    }     
  });  
  if(!todoList.hasChildNodes()){
    createEmptyItem('-- No tasks for today --');
  }   
}

// Format date to yyyy-mm-dd
function dateToInputFormat(year,month,day){
  let formattedMonth = '';
  let formattedDay = '';
  let formattedDate = '';
  if (month<10) formattedMonth = `0${month}`;
  else formattedMonth = month;
  if (day<10) formattedDay = `0${day}`;
  else formattedDay = day;
  formattedDate = `${year}-${formattedMonth}-${formattedDay}`;
  return formattedDate;     
}

// Populate empty list to UI
function createEmptyItem(stringMsg){
  const emptyItem = document.createElement('div');
  emptyItem.classList.add('text-center');
  emptyItem.innerHTML = `<p class="fst-italic">${stringMsg}</p>`;
  todoList.appendChild(emptyItem);
}

// Populate todo list to UI
function createTodoItem(todo){
  const todoItem = document.createElement('div');
  todoItem.classList.add('item', 'mt-2');
  const formattedDate = dateToLocalFormat(todo.date);
  todoItem.innerHTML = `<p class="date">${formattedDate}</p>
                        <div class="row">
                          <div class="col-sm-2 tag">#${todo.tag}</div>
                          <div class="col-sm-7 task text-center">${todo.task}</div>
                          <div class="col-sm-3 d-flex justify-content-evenly">
                            <button class="btnCheck btn"><i class="fa-solid fa-check fa-lg" style="color: #107f2c;"></i></button>
                            <button class="btnTrash btn"><i class="fa-solid fa-trash-can fa-lg" style="color: #7a0517;"></i></button>
                          </div>
                        </div>`;
  todoList.appendChild(todoItem);
}

// Format date to mm/dd/yyyy
function dateToLocalFormat(dateString){
  if(dateString === ''){
    return dateString;
  }else{
    const [year, month, day] = dateString.split('-');  
    return `${month}/${day}/${year}`;
  } 
}

// Add todo task and populate to UI
function addTodoList(){    
  if(inputTodoTask.value === ''){
    alert('Please enter a task to add.');
    return;
  }
  //console.log(todoTag);
  let todoTagName = '';
  for (let i = 0; i < todoTag.length; i++) {
    if (todoTag[i].checked) {
      todoTagName = todoTag[i].value;
    }
  } 
  const todo ={
    tag:  todoTagName,
    task: inputTodoTask.value,
    date: todoDate.value
  };
  saveTodoList(todo);
  alert(`Success!\nTask "${inputTodoTask.value}" is added to your todo list.`);
  //console.log(todo);
  clearInput();
}

// Save todo list to localStorage
function saveTodoList(todo){
  let todos = getTodoList();
  todos.push(todo);
  localStorage.setItem('todos',JSON.stringify(todos));
}

// Remove todo task and update todo list to localStorage
function removeTodo(todoTask){
  let todos = getTodoList();
  todos = todos.filter(todo => todo.task !== todoTask);
  console.log(todos);
  localStorage.setItem('todos', JSON.stringify(todos));
}

// Add click event to check or trash button for each todo task
todoList.addEventListener('click', (e) => {
  const item = e.target;
  const todolist = item.parentElement.parentElement.previousElementSibling;
  
  // Check button
  if (item.parentElement.classList[0] === 'btnCheck') {
    todolist.classList.toggle('done');
  }

  // Trash button
  if (item.parentElement.classList[0] === 'btnTrash') {
    const todoTask = todolist.textContent;
    todolist.parentElement.parentElement.remove();
    removeTodo(todoTask);
  }
});

loadTodayTodoList();

