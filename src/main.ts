type Task = {
    name: string
    completed: boolean
    CreatedAt: Date
    DueDate: Date
    Status: string
}

let toggle: boolean = true

const list = document.querySelector<HTMLUListElement>("#list")
const form_task = document.querySelector("#new-task-form") as HTMLFormElement | null
const new_task = document.querySelector<HTMLInputElement>("#new-task")
const new_date = document.querySelector<HTMLInputElement>("#new-date")
const date_label = document.querySelector<HTMLLabelElement>("#datelabel") 
const tasks: Task[] = loadTask()
tasks.sort((a,b) => a.DueDate.getTime() - b.DueDate.getTime())
tasks.forEach(addListItem)
console.log(tasks)

const sort = document.querySelector<HTMLButtonElement>("#Sort")
const options = document.querySelector<HTMLButtonElement>("#Options")
const icon = document.querySelector<HTMLIFrameElement>(".fa-angle-down")
if (sort && options) {
    sort.addEventListener("click", () => {
        if (options.style.display === "flex" || options.style.display === "") {
            options.style.display = "none"
            if (icon) icon.className = "fa fa-angle-up"
        } else {
            options.style.display = "flex"
            if (icon) icon.className = "fa fa-angle-down"
        }
    });
}

const Past = document.querySelector<HTMLButtonElement>("#Past")
const Today = document.querySelector<HTMLButtonElement>("#Today")
const Tomorrow = document.querySelector<HTMLButtonElement>("#Tom")
const Later = document.querySelector<HTMLButtonElement>("#Later")



form_task?.addEventListener("submit", e => {
    e.preventDefault()

    if (new_task?.value == "" || new_task?.value == null) return
    if (new_date?.value == "" || new_date?.value == null) return
    if (date_label?.textContent == null || date_label?.textContent == "") return
    const newTask: Task = {
        name: new_task.value,
        completed: false,
        CreatedAt: new Date(),
        DueDate: new Date(new_date.value),
        Status: ""
    }

    new_task.value = "";
    new_date.value = "";
    date_label.textContent = "";
    addListItem(newTask)
    tasks.push(newTask)
    console.log(newTask)
    saveTask()
    sortTask()
    updateTaskStatus()
})

new_date?.addEventListener("input", () => {
    date_label!.textContent = new_date.value;
});
    
preventEnter();

function preventEnter(): void{
    if (new_task) {
        new_task.addEventListener('keydown', (key: KeyboardEvent) => {
            if (key.key === "Enter") {
                key.preventDefault();
            }
        });
    }
}


function addListItem(task: Task) {
    saveTask()
    const item = document.createElement("li")
    const checkbox = document.createElement("input")
    const text = document.createElement("label")
    const label = document.createElement("label")
    const span = document.createElement("span")
    const div = document.createElement("div")
    const remove = document.createElement("i")
    const date = document.createElement("label")
    const setTime = document.createElement("input")
    const Day = document.createElement('label')

    checkbox.type = "checkbox"
    text.id = "text"
    span.id = "customcheckbox"
    item.id = "lists"
    div.id = "div"
    remove.className = "fa fa-trash-o";
    remove.id = "bin";
    date.id = "date";
    remove.draggable = false;
    setTime.id = "time"
    setTime.type = "datetime-local"
    

    Day.id = "day"

    checkbox.addEventListener("change", () => {
        task.completed = checkbox.checked
        if (task.completed) {
            text.style.textDecoration = "line-through"
            task.completed = checkbox.checked
            text.removeEventListener("click", onTextClick)
        } else {
            text.style.textDecoration = "none"
            task.completed = checkbox.checked  
            text.addEventListener("click", onTextClick)
        }
        saveTask();
    });
    
    if (task.completed) { 
        checkbox.checked = true
        text.style.textDecoration = "line-through"   
        text.removeEventListener("click", onTextClick)
    } else {
        checkbox.checked = false
        text.removeEventListener("click", onTextClick)
        text.style.textDecoration = "none"
    }
    text.removeEventListener("click", onTextClick)

    remove.addEventListener("click", () => {
        if (toggle == false) {
            toggle = true
        }
        div.remove()
        const taskIndex = tasks.findIndex(t => t.name === task.name && t.CreatedAt === task.CreatedAt);
        console.log(taskIndex)
        if (taskIndex > -1) {
            tasks.splice(taskIndex, 1);
            saveTask();
        }
    });
    
    remove.addEventListener("mouseenter", () => {
        toggle = false;
    })
    remove.addEventListener("mouseleave", () => {
        toggle = true;
    })
    text.addEventListener("mouseenter", () => {
        toggle = false;
    })
    text.addEventListener("mouseleave", () => {
        toggle = false;
    })

    text.addEventListener("click", onTextClick)

    function onTextClick() {
        if (task.completed) return;
        toggle = false;
        saveTask()
        const input = document.createElement("input")
        input.type = "text";
        input.value = task.name;
        input.id = "editTask"
        input.autocomplete = "off"
        checkbox.disabled = true;
        text.replaceWith(input)
        input.focus();
        
        input.addEventListener('keydown', (Enter: KeyboardEvent) => {
            if (Enter.key === "Enter") {
                if (input.value.length > 0) {
                    task.name = input.value
                    text.textContent = task.name
                    input.replaceWith(text);
                    toggle = true;
                    saveTask()
                } else {
                    div.remove();
                    const taskIndex = tasks.findIndex(t => t.name === task.name && t.CreatedAt === task.CreatedAt);
                    console.log(taskIndex)
                    if (taskIndex > -1) {
                        tasks.splice(taskIndex, 1);
                        toggle = true
                        saveTask();
                    }
                }
                checkbox.disabled = false;
            }
        });

        document.addEventListener('click', function () {
            input.focus()
        });
    }   

    if (task.Status == "| Today") {
        Day.textContent = task.Status
        Day.style.color = "#58c080";
    } else if (task.Status == "| Tomorrow") {
        Day.textContent = task.Status 
        Day.style.color = "#96c559";
    } else if (task.Status == "| Later" ) {
        Day.textContent = task.Status 
        Day.style.color = "#a5c251";
    } else {
        Day.textContent = task.Status 
        date.style.color = "red"
        Day.style.color = "red";
    }

    const FirstDay = new Date(task.DueDate.getFullYear(), task.DueDate.getMonth(), 1)
    const LastDay = new Date(task.CreatedAt.getFullYear(), task.CreatedAt.getMonth() + 1, 0)
    

    if (task.DueDate.getMonth() === task.CreatedAt.getMonth() && task.DueDate.getDate() === task.CreatedAt.getDate() && task.DueDate.getHours() >= task.CreatedAt.getHours() && task.DueDate.getTime()  > task.CreatedAt.getTime()) {
        task.Status = "| Today"
    } else if (task.DueDate.getMonth() === task.CreatedAt.getMonth() && task.DueDate.getDate() === task.CreatedAt.getDate() + 1 || task.DueDate.getMonth() === task.CreatedAt.getMonth() + 1 && (task.DueDate.getDay() === FirstDay.getDay() && task.CreatedAt.getDay() === LastDay.getDay())) {
        task.Status = "| Tomorrow"
    } else if (task.DueDate > task.CreatedAt) {
        task.Status = "| Later"
    } else {
        task.Status = "| Past Due"
    }
    
    const dateset = task.DueDate.toDateString().slice(0, 10) + " " + task.DueDate.toTimeString().slice(0, 9)

    date.append(dateset)
    label.append(checkbox, span)
    text.append(task.name)
    item.append(label, text, remove, Day, date, setTime)
    div.append(item)
    list?.append(div)

    setTime.addEventListener("mouseenter", () => {
        toggle = false
    })
    setTime.addEventListener("mouseexit", () => {
        toggle = true
    })

    setTime.addEventListener("input", () => {
        toggle = true
        const newDate = new Date(setTime.value)
        task.DueDate = newDate
        saveTask();
        updateTaskStatus()
        sortTask()
    })
}

function updateTaskStatus(): void {
    const now = new Date();
    tasks.forEach(task => {
        const FirstDay = new Date(task.DueDate.getFullYear(), task.DueDate.getMonth(), 1)
        const LastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        const dueDate = task.DueDate;
        if (now.getTime() > dueDate.getTime()) {
            task.Status = "| Past Due";
        } else if (now.getMonth() === dueDate.getMonth() && now.getDate() === dueDate.getDate()) {
            task.Status = "| Today";
         } else if (now.getMonth() === dueDate.getMonth() && now.getDate() === dueDate.getDate() - 1 || now.getMonth() + 1 === dueDate.getMonth() && (now.getDay() === LastDay.getDay() && dueDate.getDay() === FirstDay.getDay())) {
            task.Status = "| Tomorrow"
         }
    });
    saveTask();
}

setInterval(sortTask, 0)

function sortTask() {
    if (toggle) {
        updateTaskStatus()
        tasks.sort((a, b) => a.DueDate.getTime() - b.DueDate.getTime());
        if (list) list.innerHTML = ""; 
        tasks.forEach(addListItem);
    }
}


function saveTask(){
    localStorage.setItem("Tasks", JSON.stringify(tasks))
}

function loadTask(): Task[] {
    const taskLoad = localStorage.getItem("Tasks")
    if (taskLoad == null) return []
    const tasks: Task[] = JSON.parse(taskLoad);
    tasks.forEach( task => {
        task.DueDate = new Date(task.DueDate)
        task.CreatedAt = new Date(task.CreatedAt)
    })
    return tasks;
}





