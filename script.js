const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('searchInput');

// Create
todoForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (todoInput.value) {
        //Add todo 
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        const textDiv = document.createElement('div');
        textDiv.className = 'todo-text float-start';
        textDiv.appendChild(document.createTextNode(todoInput.value));
        li.appendChild(textDiv);

        const controlContainer = document.createElement('div');
        controlContainer.className = 'd-flex align-items-center';

        // Add due date if one is provided
        const dueDateInput = document.getElementById('due-date-input');
        const dueDateValue = dueDateInput.value || 'No Due Date';
        if (dueDateValue !== 'No Due Date') {
            const dueDate = document.createElement('span');
            dueDate.className = 'due-date mr-3 px-2';
            dueDate.appendChild(document.createTextNode(' Due: ' + dueDateInput.value));
            controlContainer.appendChild(dueDate);
        }

        const buttonDiv = document.createElement('div');
        buttonDiv.className = 'btn-group btn-group-sm';
        buttonDiv.setAttribute('role', 'group');

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
        priorityButton.appendChild(document.createTextNode('Priority: Medium'));
        buttonDiv.appendChild(priorityButton);

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
            todoList.removeChild(li);
            console.log("Deleted To-Do");
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
        }
        console.log("Updated To-Do");
    }
});

// Modify Priority
todoList.addEventListener('click', function (e) {
    if (e.target.classList.contains('priority')) {
        const currentPriority = e.target.textContent.split(': ')[1];
        const li = e.target.closest('li')
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
                li.style.backgroundColor = ' var(--bs-primary)';
                break;
        }
        e.target.textContent = 'Priority: ' + newPriority;
        sortTodoItems();
        console.log("Modified To-Do Priority");
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
    console.log("Searched for " + searchQuery);
});


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

