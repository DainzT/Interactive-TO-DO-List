type Task = {
    name: string
    completed: boolean
    CreatedAt: Date
    DueDate: Date
    Status: string
}


const list = document.querySelector<HTMLUListElement>("#list")
const form_task = document.querySelector("#new-task-form") as HTMLFormElement | null
const new_task = document.querySelector<HTMLInputElement>("#new-task")
const new_date = document.querySelector<HTMLInputElement>("#new-date")
const date_label = document.querySelector<HTMLLabelElement>("#datelabel") 
const tasks: Task[] = loadTask()
tasks.sort((a,b) => a.DueDate.getTime() - b.DueDate.getTime())
tasks.forEach(addListItem)
console.log(tasks)

saveTask();

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
    setTime.type = "time"
    

    function Status(day: String){
        const Day = document.createElement('label')
        Day.id = "day"
        task.Status = `| ${day}`
        Day.textContent = task.Status
        if (day === "Past Due"){
            Day.style.color = "red"
            date.style.color = "red"
        } else if (day === "Today") {
            Day.style.color = "#58c080"
        } else if (day === "Tomorrow") {
            Day.style.color = "#96c559"
        } else {
            Day.style.color = "#a5c251"
        }
        return Day
    }

    if (task.completed) {
        checkbox.checked = true       
        text.style.textDecoration = "line-through"   
        text.removeEventListener("click", onTextClick)
    } else {
        checkbox.checked = false
        text.addEventListener("click", onTextClick)
        text.style.textDecoration = "none"
    }

    checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
            text.style.textDecoration = "line-through"
            task.completed = checkbox.checked
            console.log(task)
            text.removeEventListener("click", onTextClick)
            saveTask()
        } else {
            text.style.textDecoration = "none"
            task.completed = checkbox.checked
            console.log(task)   
            text.addEventListener("click", onTextClick)
            saveTask()
        }
    });
    remove.addEventListener("click", () => {
        div.remove()
        const taskIndex = tasks.findIndex(t => t.name === task.name && t.CreatedAt === task.CreatedAt);
        console.log(taskIndex)
        if (taskIndex > -1) {
            tasks.splice(taskIndex, 1);
            saveTask();
        }
    });

    text.addEventListener("click", onTextClick)

    function onTextClick() {
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
                    saveTask()
                } else {
                    div.remove();
                    const taskIndex = tasks.findIndex(t => t.name === task.name && t.CreatedAt === task.CreatedAt);
                    console.log(taskIndex)
                    if (taskIndex > -1) {
                        tasks.splice(taskIndex, 1);
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
    
    const dateset = task.DueDate.toDateString().slice(0, 10) + " " + task.DueDate.toTimeString().slice(0, 9)
   
    if (task.DueDate.getDate() === task.CreatedAt.getDate()) {
        date.append(dateset)
        label.append(checkbox, span)
        text.append(task.name)
        item.append(label, text, remove, Status("Today"), date, setTime)
        div.append(item)
        list?.append(div)    
    } else if (task.DueDate.getDate() === task.CreatedAt.getDate() + 1){
        date.append(dateset)
        label.append(checkbox, span)
        text.append(task.name)
        item.append(label, text, remove, Status("Tomorrow"), date, setTime)
        div.append(item)
        list?.append(div)
    } else if (task.DueDate > task.CreatedAt) {
        date.append(dateset, setTime)
        label.append(checkbox, span)
        text.append(task.name)
        item.append(label, text, remove, Status("Later"), date, setTime)
        div.append(item)
        list?.append(div)
    } else {
        date.append(dateset)
        label.append(checkbox, span)
        text.append(task.name)
        item.append(label, text, remove, Status("Past Due"), date, setTime)
        div.append(item)
        list?.append(div)
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

setInterval(updateTaskStatus, 1000);

function updateTaskStatus(): void {
    const now = new Date();
    const listItems = document.querySelectorAll<HTMLLIElement>("#list li");
    listItems.forEach(item => {
        const date = item.querySelector<HTMLLabelElement>("#date");
        const day = item.querySelector<HTMLLabelElement>("#day")
        if (date) {
            const dateText = date.textContent!.trim();
            const dueDate = new Date(dateText);
            if (now.getMonth() === dueDate.getMonth() && now.getDate() === dueDate.getDate() && now.getHours() === dueDate.getHours()) {
                if (now.getMinutes() >= dueDate.getMinutes()) {
                    date.style.color = "red"
                    if (day) day.textContent = "| Past due"
                    if (day) day.style.color = "red"
                } else {
                    date.style.color = "#2b2828"
                }
            } else {
                console.log("")
            }
        }
    });
}


setInterval(sortTask, 10000) 

function sortTask(){
    const List = document.querySelector<HTMLElement>("#list")
    if (!List) return;
    const divList = List.querySelectorAll<HTMLElement>("div")
    const arrayList = Array.from(divList);
    arrayList.sort((a, b) => {
        const dateLabelA = a.querySelector<HTMLElement>("#date")?.textContent?.trim();
        const dateLabelB = b.querySelector<HTMLElement>("#date")?.textContent?.trim();
        if (!dateLabelA || !dateLabelB) return 0;

        const dateA = new Date(dateLabelA)
        const dateB = new Date(dateLabelB)

        return dateA.getTime() - dateB.getTime()
    })

    arrayList.forEach(element => {
        List.appendChild(element)
        console.log(List)
    })
}


// setInterval(Category, 60000)

// function Category() {

// }


// setInterval(Transition, 60000)

// function Transition() {
    
// }