// script.js

document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const filterButtons = document.querySelectorAll('.filter button');
    const prioritySelect = document.getElementById('priority-select');

    // Load tasks from local storage
    loadTasks();

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addTask(taskInput.value, prioritySelect.value);
        taskInput.value = '';
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterTasks(button.id.replace('-btn', ''));
        });
    });

    function addTask(task, priority) {
        const li = document.createElement('li');
        li.classList.add('adding', `priority-${priority}`);
        
        li.innerHTML = `
            <span contenteditable="false">${task}</span>
            <div class="actions">
                <button class="complete-btn" title="Complete"><i class="fas fa-check"></i></button>
                <button class="edit-btn" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" title="Delete"><i class="fas fa-trash"></i></button>
            </div>
        `;

        taskList.appendChild(li);

        const completeBtn = li.querySelector('.complete-btn');
        const editBtn = li.querySelector('.edit-btn');
        const deleteBtn = li.querySelector('.delete-btn');

        completeBtn.addEventListener('click', () => {
            li.classList.toggle('completed');
            saveTasks();
        });

        editBtn.addEventListener('click', () => {
            const span = li.querySelector('span');
            if (span.contentEditable === "false") {
                span.contentEditable = "true";
                span.focus();
                editBtn.innerHTML = '<i class="fas fa-save"></i>';
            } else {
                span.contentEditable = "false";
                editBtn.innerHTML = '<i class="fas fa-edit"></i>';
                saveTasks();
            }
        });

        deleteBtn.addEventListener('click', () => {
            li.style.opacity = '0';
            setTimeout(() => {
                li.remove();
                saveTasks();
            }, 300);
        });

        saveTasks();
    }

    function filterTasks(filter) {
        const tasks = taskList.querySelectorAll('li');
        tasks.forEach(task => {
            switch (filter) {
                case 'all':
                    task.style.display = 'flex';
                    break;
                case 'completed':
                    task.style.display = task.classList.contains('completed') ? 'flex' : 'none';
                    break;
                case 'incomplete':
                    task.style.display = task.classList.contains('completed') ? 'none' : 'flex';
                    break;
            }
        });
    }

    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(task => {
            tasks.push({
                text: task.querySelector('span').textContent,
                completed: task.classList.contains('completed'),
                priority: task.className.split(' ')[1].replace('priority-', '')
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => addTask(task.text, task.priority));
    }
});