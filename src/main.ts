type Task = {
    name: string
    completed: boolean
    CreatedAt: Date
}

const list = document.querySelector<HTMLUListElement>("#list")
const form_task = document.querySelector("#new-task-form") as HTMLFormElement | null
const new_task = document.querySelector<HTMLInputElement>("#new-task")


form_task?.addEventListener("submit", e => {
    e.preventDefault()
    if (new_task?.value == "" || new_task?.value == null) return

    const newTask: Task = {
        name: new_task.value,
        completed: false,
        CreatedAt: new Date(),
    }
    new_task.value = ""
    addListItem(newTask)
})

function addListItem(task: Task) {
    const item = document.createElement("li")
    const checkbox = document.createElement("input")
    const text = document.createElement("label")
    // const remove = document.createElement("button")
    const label = document.createElement("label")
    const span = document.createElement("span")
    const div = document.createElement("div")
    const remove = document.createElement("i")
    const date = document.createElement("label")
    checkbox.type = "checkbox"
    text.id = "text"
    span.id = "customcheckbox"
    item.id = "lists"
    div.id = "div"
    remove.className = "fa fa-trash-o"
    remove.id = "bin"
    remove.draggable = false;
    date.id = "date"

    checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
            text.style.textDecoration = "line-through"
            text.removeEventListener("click", onTextClick)
        } else {
            text.style.textDecoration = "none"
            text.addEventListener("click", onTextClick)
        }
    });
    remove.addEventListener("click", () => {
        div.remove()
    });

    text.addEventListener("click", onTextClick)
    // text.addEventListener("click", function(){
    function onTextClick() {
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
                } else {
                    div.remove();
                }
                checkbox.disabled = false;
            }
        });

        document.addEventListener('click', function () {
            input.focus()
        });

    }
    const datecheck = task.CreatedAt.toDateString().slice(0, 10)
    // remove.append(image)
    date.append(datecheck)
    label.append(checkbox, span)
    text.append(task.name)
    item.append(label, text, remove, date)
    div.append(item)
    list?.append(div)
}


if (new_task) {
    new_task.addEventListener('keydown', (key: KeyboardEvent) => {
        if (key.key === "Enter") {
            key.preventDefault();
        }
    });
}

