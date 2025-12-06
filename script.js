let todo = document.querySelector("#todo");
let inprogress = document.querySelector("#inprogress");
let completed = document.querySelector("#completed");
let tasks = document.querySelectorAll(".task");
let draggedItem = null;
let taskbeingEdited = null;
const tasksData = {};
lucide.createIcons();


function addTask(title, desc, column, priority = "low", dueDate,startDate="") {
    const div = document.createElement("div");
    div.classList.add("task");
    div.setAttribute("draggable", true);

    div.dataset.startDate = startDate;
    div.dataset.dueDate = dueDate;

    div.innerHTML = `
     <div class="task-header">
     <div class="taskLabel">
        <h2>${title}</h2>
        <span class="priority ${priority.toLowerCase()}">${priority}</span>
    </div>
        <div class="task-menu">
            <span class="menu-icon">⋯</span>
            <div class="dropdown hidden">
                <div class="dropdown-item edit"><i class="icon" data-lucide="square-pen"></i> Edit Task</div>
                <div class="dropdown-item delete"><i class="icon" data-lucide="trash"></i>Delete Task</div>
            </div>
        </div>
    </div>
     <p>${desc}</p>
      <h4 class="due-date">${dueDate}</h4>
    `
    column.appendChild(div);


    div.addEventListener("dragstart", (e) => {
        draggedItem = div;
        div.classList.add("dragging");
    })

    div.addEventListener("dragend", (e) => {
        draggedItem = null;
        div.classList.remove("dragging");
    })

    const deleteButton = div.querySelector(".delete");
    deleteButton.addEventListener("click", (e) => {
        div.remove();
        updateTaskCount();
    })

    let editButton = div.querySelector(".edit");
    editButton.addEventListener("click", () => {
        openEditModal(div);
    })

    let menuIcon = div.querySelector(".menu-icon");
    let dropdown = div.querySelector(".dropdown");

    menuIcon.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdown.classList.toggle("hidden");
    })

    document.addEventListener("click", () => {
        dropdown.classList.add("hidden");
    });

    return div;
}

function searchTask() {
    let tasks = document.querySelectorAll(".task");
    let searchText = document.querySelector("#search-input").value.toLowerCase();

    tasks.forEach(task => {

        let title = task.querySelector("h2").innerText.toLowerCase();
        let desc = task.querySelector("p").innerText.toLowerCase();

        if (title.includes(searchText) || (desc.includes(searchText))) {
            task.style.display = "flex";
        }
        else {
            task.style.display = "none";
        }
    })

}

function openEditModal(taskdiv) {
    taskbeingEdited = taskdiv;

    const title = taskdiv.querySelector("h2").innerText;
    const desc = taskdiv.querySelector("p").innerText;
    const priority = taskdiv.querySelector(".priority").innerText.toLowerCase();
    let taskbtn = document.querySelector(".add-task-btn");
    const dueDate = taskdiv.dataset.dueDate;
    const startDate = taskdiv.dataset.startDate;

    if (taskbeingEdited) {
        document.querySelector("#task-title-input").value = title;
        document.querySelector("#task-desc-input").value = desc;
        document.querySelector("#task-priority-input").value = priority;
        document.querySelector("#due-date").value = dueDate;
        document.querySelector("#start-date").value = startDate;
        taskbtn.textContent = "Edit Task";
    }
    else {
        document.querySelector("#task-title-input").value = "";
        document.querySelector("#task-desc-input").value = "";
        document.querySelector("#task-priority-input").value = "low";
        taskbtn.textContent = "Add Task";
    }

    modal.classList.add("active");
}

function updateTaskCount() {
    [todo, inprogress, completed].forEach(col => {
        const tasks = col.querySelectorAll(".task");
        const count = col.querySelector(".right");

        tasksData[col.id] = Array.from(tasks).map((item) => {
            return {
                title: item.querySelector("h2").innerText,
                description: item.querySelector("p").innerText,
                priority: item.querySelector(".priority").innerText,
                dueDate: item.querySelector(".due-date").innerText,
                startDate: item.dataset.startDate
            }
        })
        localStorage.setItem("Tasks", JSON.stringify(tasksData));

        count.textContent = tasks.length;
    })

}
if (localStorage.getItem("Tasks")) {
    const data = JSON.parse(localStorage.getItem("Tasks"));

    for (const col in data) {
        // console.log(col ,data[col]);
        const column = document.querySelector(`#${col}`);
        data[col].forEach(task => {
            addTask(task.title, task.description, column, task.priority, task.dueDate,task.startDate);
        })

        updateTaskCount();
    }
}

function addDragEventsOnColumn(column) {

    column.addEventListener("dragenter", (e) => {
        e.preventDefault();
        column.classList.add("hover-over");
    })

    column.addEventListener("dragleave", (e) => {
        e.preventDefault();
        column.classList.remove("hover-over");
    })

    column.addEventListener("dragover", (e) => {
        e.preventDefault();
    })

    column.addEventListener("drop", (e) => {
        e.preventDefault();
        // console.log(draggedItem,column); 

        column.appendChild(draggedItem);
        column.classList.remove("hover-over");
        updateTaskCount();

    })

}
addDragEventsOnColumn(todo);
addDragEventsOnColumn(inprogress);
addDragEventsOnColumn(completed);

const toggleModalButtons = document.querySelector("#toggle-modal");
const modal = document.querySelector(".modal");
const modalBg = document.querySelector(".bg");
const closemodal = document.querySelector(".close-modal");
const addTaskButton = document.querySelector("#add-new-task");

toggleModalButtons.addEventListener("click", (e) => {

    modal.classList.toggle("active");
})

closemodal.addEventListener("click", (e) => {
    let addtask = document.querySelector(".add-task-btn");
    addtask.textContent = "Add Task";
    taskbeingEdited = null;
    modal.classList.remove("active");
})

addTaskButton.addEventListener("click", (e) => {
    let taskTitle = document.querySelector("#task-title-input").value;
    let taskDesc = document.querySelector("#task-desc-input").value;
    let taskPriority = document.querySelector("#task-priority-input").value.toLowerCase();
    let taskdueDate = document.querySelector("#due-date").value;
    let taskStartDate = document.querySelector("#start-date").value;
    taskTitle = taskTitle.trim();
    taskDesc = taskDesc.trim();
    taskPriority = taskPriority.trim();

    if (taskTitle === "" || taskDesc === "" || taskPriority === "" || taskdueDate === "" || taskStartDate === "") {
        alert("Please fill out all the fields.");
        return;
    }

    if (taskbeingEdited) {

        const prioritySpan = taskbeingEdited.querySelector(".priority");
        prioritySpan.innerText = taskPriority;
        prioritySpan.className = `priority ${taskPriority}`;

        taskbeingEdited.querySelector("h2").innerText = taskTitle;
        taskbeingEdited.querySelector("p").innerText = taskDesc;
        taskbeingEdited.querySelector(".priority").innerText = taskPriority;
        taskbeingEdited.querySelector(".due-date").innerText = taskdueDate;

        taskbeingEdited.dataset.startDate = taskStartDate;
        taskbeingEdited.dataset.dueDate = taskdueDate;

        taskbeingEdited.classList.remove("low", "medium", "high");
        taskbeingEdited.classList.add(taskPriority);
        taskbeingEdited = null;
    }
    else {
        addTask(taskTitle, taskDesc, todo, taskPriority, taskdueDate, taskStartDate);
    }
    updateTaskCount();
    modal.classList.remove("active");

    document.querySelector("#task-title-input").value = "";
    document.querySelector("#task-desc-input").value = "";
})
let themeButton = document.querySelector(".theme");


let currentTheme = localStorage.getItem("theme") || "dark";
document.body.setAttribute("data-theme", currentTheme);
updateThemeButton(currentTheme);

themeButton.addEventListener("click", () => {
    currentTheme = (currentTheme === "light") ? "dark" : "light";

    document.body.setAttribute("data-theme", currentTheme);
    localStorage.setItem("theme", currentTheme);

    updateThemeButton(currentTheme);
});

function updateThemeButton(theme) {
    if (theme === "dark") {
        themeButton.innerHTML = `<i data-lucide="sun"></i>`;
    } else {
        themeButton.innerHTML = `<i data-lucide="moon"></i>`;
    }

    lucide.createIcons();
}

let search = document.querySelector("#search-input");
search.addEventListener("input", searchTask);

let searchCancel = document.querySelector("#search-cancel");
searchCancel.addEventListener("click", (e) => {
    search.value = "";
    searchTask();
})

