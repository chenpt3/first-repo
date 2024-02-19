const input = document.querySelector("input");
const btn = document.querySelector("button");
const list = document.querySelector("ul");
const delButtons = document.getElementsByClassName("del-btn");

btn.addEventListener("click", function() {
    let newItem = input.value;
    const listItem = document.createElement("li");
    list.appendChild(listItem);
    listItem.innerText = newItem;
    const delBtn = document.createElement("button");
    listItem.appendChild(delBtn);
    delBtn.innerText = "Delete";
    delBtn.classList.add("del-btn");
    delBtn.addEventListener("click", function() {
        listItem.remove();
    })
    input.value = "";
    input.focus()
})
