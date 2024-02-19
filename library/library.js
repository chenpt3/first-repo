const dialog = document.querySelector("dialog");
const addBtn = document.getElementById("add");
const cancelBtn = document.getElementById("cancel");
const openBtn = document.getElementById("add-book");

openBtn.addEventListener("click", () => {
    dialog.showModal();
});

cancelBtn.addEventListener("click", () => {
    dialog.close();
});

const container = document.querySelector(".books-wrap");
const library = [];

function Book(title, author, length, genre, read) {
    this.title = title;
    this.author = author;
    this.length = length;
    this.genre = genre;
    this.read = read;
};

