class TodoNote {
    constructor(todoText, dueDate, priority) {
        this.todoText = todoText;
        this.dueDate = dueDate || 'NaN-NaN-NaN';
        this.priority = priority || 'Medium';
    }
}

const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const dueDateInput = document.getElementById('due-date-input');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('searchInput');

// When the page loads
document.addEventListener('DOMContentLoaded', function() {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.forEach(function(todo) {
        todo.dueDate = formatDate(todo.dueDate);
        addTodo(todo);
    });
    sortTodoItems();
});

// Create
todoForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (todoInput.value) {
        //Add todo 
        const todo = new TodoNote(todoInput.value, formatDate(dueDateInput.value), 'Medium');
        addTodo(todo);
        const todos = JSON.parse(localStorage.getItem('todos')) || [];
        todos.push(todo);
        localStorage.setItem('todos', JSON.stringify(todos));
        todoInput.value = '';
        dueDateInput.value = '';
    }
    sortTodoItems();
});

// Delete
todoList.addEventListener('click', function (e) {
    if (e.target.classList.contains('delete')) {
        if (confirm('Are you sure?')) {
            const li = e.target.closest('li');
            const todos = JSON.parse(localStorage.getItem('todos')) || [];
            const index = todos.findIndex(function(todo) {
                return todo.todoText === li.querySelector('.todo-text').textContent;
            });
            todos.splice(index, 1);
            localStorage.setItem('todos', JSON.stringify(todos));
            todoList.removeChild(li);
            console.log("Deleted To-Do");
            sortTodoItems();
        }
    }
});

// Update
todoList.addEventListener('click', function (e) {
    if (e.target.classList.contains('edit')) {
        const li = e.target.closest('li');
        const oldTodo = li.querySelector('.todo-text').textContent;
        const newTodo = prompt('Enter new todo', oldTodo);
        if (newTodo) {
            li.querySelector('.todo-text').textContent = newTodo;
            const todos = JSON.parse(localStorage.getItem('todos')) || [];
            const index = todos.findIndex(function(todo) {
                return todo.todoText === oldTodo;
            });
            todos[index].todoText = newTodo;
            localStorage.setItem('todos', JSON.stringify(todos));
            console.log("Updated To-Do");
        }
    }
});

// Modify Priority
todoList.addEventListener('click', function (e) {
    if (e.target.classList.contains('priority')) {
        const currentPriority = e.target.textContent.split(': ')[1];
        const li = e.target.closest('li')
        const todoText = li.querySelector('.todo-text').textContent;
        let newPriority;
        switch (currentPriority) {
            case 'High':
                newPriority = 'Low';
                li.style.backgroundColor = '#477A4F';
                break;
            case 'Medium':
                newPriority = 'High';
                li.style.backgroundColor = '#7A474F';
                break;
            case 'Low':
                newPriority = 'Medium';
                li.style.backgroundColor = ' #474F7A';
                break;
        }
        e.target.textContent = `Priority: ${newPriority}`;
        const todos = JSON.parse(localStorage.getItem('todos')) || [];
        const index = todos.findIndex(function(todo) {
            return todo.todoText === todoText;
        });
        todos[index].priority = newPriority;
        localStorage.setItem('todos', JSON.stringify(todos));
        sortTodoItems();
        console.log("Modified To-Do Priority");
    }
});

// Modify Due Date
todoList.addEventListener('click', function (e) {
    if (e.target.classList.contains('due-date')) {
        const li = e.target.closest('li');
        const todoText = li.querySelector('.todo-text').textContent;
        const oldDueDate = e.target.textContent.split(': ')[1];
        const newDueDate = prompt('Enter new due date', oldDueDate);
        if (newDueDate) {
            e.target.textContent = `Due Date: ${newDueDate}`;
            const todos = JSON.parse(localStorage.getItem('todos')) || [];
            const index = todos.findIndex(function(todo) {
                return todo.todoText === todoText;
            });
            todos[index].dueDate = newDueDate;
            localStorage.setItem('todos', JSON.stringify(todos));
        }
        console.log("Modified To-Do Due Date");
    }
});

// Search
searchForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const searchQuery = searchInput.value.toLowerCase();
    const todoItems = document.querySelectorAll('.list-group-item');

    todoItems.forEach(function (todoItem) {
        const itemText = todoItem.querySelector('.todo-text').textContent.toLowerCase();
        if (itemText.indexOf(searchQuery) != -1) {
            todoItem.style.display = 'block';
            todoItem.classList.add('d-flex');
        } else {
            todoItem.style.display = 'none';
            todoItem.classList.remove('d-flex');
        }
    });
    sortTodoItems();
    console.log("Searched for " + searchQuery);
});

// Function to add a todo item to the list
function addTodo(todo) {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    const textDiv = document.createElement('div');
    textDiv.className = 'todo-text float-start';
    textDiv.appendChild(document.createTextNode(todo.todoText));
    li.appendChild(textDiv);

    const controlContainer = document.createElement('div');
    controlContainer.className = 'd-flex align-items-center';

    const buttonDiv = document.createElement('div');
    buttonDiv.className = 'btn-group btn-group-sm';
    buttonDiv.setAttribute('role', 'group');

    // Add due date if one is provided
    const dueDateElement = document.createElement('button');
    dueDateElement.className = 'due-date btn btn-info btn-sm';
    if (todo.dueDate !== 'NaN-NaN-NaN') {
        dueDateElement.textContent = `Due Date: ${formatDate(todo.dueDate)}`;
    }
    else {
        dueDateElement.textContent = `Set Due Date`;
    }
    dueDateElement.addEventListener('click', function(e) {
        e.stopPropagation();  
        const newDueDate = prompt('Enter new due date (dd-mm-yyyy)');
        if (newDueDate) {
            dueDateElement.textContent = `Due Date: ${newDueDate}`;
            const todos = JSON.parse(localStorage.getItem('todos')) || [];
            const index = todos.findIndex(function(todo) {
                return todo.todoText === todoText;
            });
            todos[index].dueDate = newDueDate;
            localStorage.setItem('todos', JSON.stringify(todos));
        }
    });
    buttonDiv.appendChild(dueDateElement);

    // Add edit button
    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.className = 'btn btn-success btn-sm edit';
    editButton.appendChild(document.createTextNode('Edit'));
    buttonDiv.appendChild(editButton);

    // Add priority button
    const priorityButton = document.createElement('button');
    priorityButton.type = 'button';
    priorityButton.className = 'btn btn-warning btn-sm priority';
    priorityButton.appendChild(document.createTextNode('Priority: ' + todo.priority));
    buttonDiv.appendChild(priorityButton);
    // Set color based on priority
    switch (todo.priority) {
        case 'High':
            li.style.backgroundColor = '#7A474F';
            break;
        case 'Medium':
            li.style.backgroundColor = '#474F7A';
            break;
        case 'Low':
            li.style.backgroundColor = '#477A4F';
            break;
    }

    // Add delete button
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'btn btn-danger btn-sm delete';
    deleteButton.appendChild(document.createTextNode('X'));
    buttonDiv.appendChild(deleteButton);

    // Add todo item to list
    controlContainer.appendChild(buttonDiv);
    li.appendChild(controlContainer);
    todoList.appendChild(li);
    console.log("Added New To-Do");
}

// Function to get priority from a todo item
function getPriority(todoItem) {
    const priorityButton = todoItem.querySelector('.priority');
    const priority = priorityButton.textContent.split(': ')[1];
    switch (priority) {
        case 'High':
            return 3;
        case 'Medium':
            return 2;
        case 'Low':
            return 1;
        default:
            return 0;
    }
}

// Function to sort todo items by priority
function sortTodoItems() {
    const todoItems = Array.from(todoList.children);
    todoItems.sort(function (a, b) {
        return getPriority(b) - getPriority(a);
    });
    todoItems.forEach(function (todoItem) {
        todoList.appendChild(todoItem);
    });
}

// Function to format date to dd-mm-yyyy
function formatDate(dateString) {
    if(!isNaN(Date.parse(dateString))){
        const date = new Date(dateString);
        return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    }
    else{
        return 'NaN-NaN-NaN';
    }
}