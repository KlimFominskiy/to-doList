let currentTask = null;
let currentDenote = document.querySelector(".evenButton");

// On app load, get all tasks from localStorage
loadTasks();

// On form submit add task
document.querySelector(".addButton").addEventListener('click', event => {
    event.preventDefault();
    addTask();
});

document.querySelector(".deleteFirstTaskItemButton").addEventListener('click', event => {
    event.preventDefault();
    if (document.querySelector(".tasksList").firstChild != null) {
        removeTask(document.querySelector(".tasksList").firstChild);
    }
});

document.querySelector(".deleteLastTaskItemButton").addEventListener('click', event => {
    event.preventDefault();
    if (document.querySelector(".tasksList").lastChild != null) {
        removeTask(document.querySelector(".tasksList").lastChild);
    }
});

function createTasksListItem(task) {
    const taskItem = document.createElement('li');
    if (task.isCompleted) {
        taskItem.className = "completedTask"
    } else {
        taskItem.className = "task";
    }
    taskItem.innerHTML = `
                <input class="checkTask" type="checkbox" onclick="toggleTaskStatus(this)" ${task.isCompleted ? "checked" : ""}>
                <input class="taskLabel" type="text" value="${task.taskName}" onclick="getCurrentTask(this)" onblur="editTask(this)">
                <button class="deleteButton" type="submit" onclick="removeTask(this.parentElement)">X</button>`
    return taskItem;
}

function loadTasks() {
    // check if localStorage has any tasks
    // if not then return
    if (localStorage.getItem("tasks") == null) return;

    // get the tasks from localStorage and convert it to an array
    let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
    let tasksList = document.querySelector(".tasksList");

    for (let taskIndex in tasks) {
        tasksList.appendChild(createTasksListItem(tasks[taskIndex]))
    }

    denoteTasksListItems(currentDenote);
}

function addTask() {
    const taskInput = document.querySelector(".taskInput");
    const tasksList = document.querySelector(".tasksList");

    // return if task is empty
    if (taskInput.value === "") {
        alert("Please add some task!");
        return false;
    }

    //add new task to the end of the uncompleted tasks list.
    let tasks = localStorage.getItem("tasks");
    let newTask = { taskName: taskInput.value, isCompleted: false };
    let newTaskItem = createTasksListItem(newTask);
    if (tasks == null) {
        // add task to local storage
        localStorage.setItem("tasks", JSON.stringify([...JSON.parse(tasks || "[]"), newTask]));
        tasksList.appendChild(newTaskItem);
    } else {
        tasks = Array.from(JSON.parse(tasks));
        let firstCompletedTaskIndex;
        for(let taskIndex in tasks) {
            if (tasks[taskIndex].isCompleted === true)
            {
                firstCompletedTaskIndex = taskIndex;
                tasks.splice(tasks.indexOf(tasks[firstCompletedTaskIndex]), 0, JSON.parse(JSON.stringify(newTask)));
                tasksList.insertBefore(newTaskItem, tasksList.children[firstCompletedTaskIndex]);
                break;
            }
        }
        if (firstCompletedTaskIndex == null){
            tasks.push(JSON.parse(JSON.stringify(newTask)));
            tasksList.appendChild(newTaskItem);
        }
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // clear input
    taskInput.value = "";

    denoteTasksListItems(currentDenote);

    newTaskItem.scrollIntoView({behavior: "smooth", block: "center", inline: "center"});

}

function removeTask(event) {
    let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
    let tasksList = document.querySelector(".tasksList");

    switch (event.className) {
        case "deleteFirstTaskItemButton" : {
            tasks.splice(0, 1);
            break;
        }
        case "deleteLastTaskItemButton" : {
            tasks.splice(tasksList.children.length - 1, 1);
            break;
        }
        default : {
            for (let elementIndex = 0; elementIndex < tasksList.children.length; elementIndex++) {
                if (tasksList.children[elementIndex] === event) {
                    tasks.splice(elementIndex, 1);
                    break;
                }
            }
            break;
        }
    }

    localStorage.setItem("tasks", JSON.stringify(tasks));
    event.remove();

    denoteTasksListItems(currentDenote);
}

function toggleTaskStatus(event) {
    let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
    let tasksList = document.querySelector(".tasksList");

    // find index of completed task item;
    for (let elementIndex = 0; elementIndex < tasksList.children.length; elementIndex++) {
        if (tasksList.children[elementIndex] === event.parentElement) {
            let changedTask = tasks.splice(elementIndex, 1)[0];
            changedTask.isCompleted = !changedTask.isCompleted;
            if(changedTask.isCompleted) {
                tasks.push(changedTask);
                tasksList.appendChild(event.parentElement);
                event.parentElement.classList.remove("task");
                event.parentElement.classList.add("completedTask");
            } else {
                tasks.unshift(changedTask);
                tasksList.prepend(event.parentElement);
                event.parentElement.classList.remove("completedTask");
                event.parentElement.classList.add("task");
            }
            break;
        }
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));

    denoteTasksListItems(currentDenote);
}

function getCurrentTask(event) {
    currentTask = event.value;
}

function editTask(event) {

    //check if task is empty
    if (event.value === "") {
        alert("Task is empty");
        // event.value = currentTask;
        // return;
    }

    let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));

    //update task
    tasks.forEach(task => {
        if (task.taskName === currentTask) {
            task.taskName = event.value;
        }
    });

    //update local storage
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function denoteTasksListItems(event) {
    let tasksList = document.querySelector(".tasksList");

    currentDenote = event;

    for (let taskItemIndex = 0; taskItemIndex < tasksList.children.length;  taskItemIndex++) {
        let taskItem = tasksList.children[taskItemIndex];
        let taskLabel = taskItem.querySelector(".taskLabel");

        taskLabel.style.background = "white";

        if (event.className === "noDenoteButton")
        {
            continue;
        }

        switch (event.className) {
            case "evenButton" :
            {
                if (taskItemIndex % 2 !== 0) {
                    taskLabel.style.background = "burlywood";
                }
                break;
            }
            case "oddButton" :
            {
                if (taskItemIndex % 2 === 0) {
                    taskLabel.style.background = "rosybrown";
                }
                break;
            }
        }
    }
}