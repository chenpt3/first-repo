const dialog = document.querySelector("dialog");
const addBtn = document.getElementById("add");
const cancelBtn = document.getElementById("cancel");
const openBtn = document.getElementById("add-book");
const container = document.querySelector(".books-wrap");
const library = [];
const errorArea = document.getElementById("error");
const hebEngReg = /^[a-z\u0590-\u05fe]+$/i;
const numReg = /^[1-9]\d*$/;
const form = document.querySelector("form");

function Book(title, author, length, genre, read) {
    this.title = title;
    this.author = author;
    this.length = length;
    this.genre = genre;
    this.read = read;
};


let titleDupe = function () {
    const title = document.getElementById("new-title").value;
    let dupe = false;
    library.forEach(book => {
        if (book.title === title) {dupe = true;};
    });
    return dupe;
};  
let titleValidation = function () {
    const title = document.getElementById("new-title").value;
    let titleError = document.createElement("p");
    titleError.classList.add("error-text");
    if (title < 2) {
        errorArea.appendChild(titleError);
        titleError.innerText = "Title is too short";
        return false;
    } else if (title.length > 15) {
        errorArea.appendChild(titleError);
        titleError.innerText = "Title is too long";
        return false;
    } else if (titleDupe() === true) {
        errorArea.appendChild(titleError);
        titleError.innerText = "Book already added";
        return false;
    } else {return true;};
};
let authorValidation = function () {
    const author = document.getElementById("new-author").value;
    let authorError = document.createElement("p");
    authorError.classList.add("error-text");
    if (author.length < 2) {
        errorArea.appendChild(authorError);
        authorError.innerText = "Author name is too short";
        return false;
    } else if (author.length > 15) {
        errorArea.appendChild(authorError);
        authorError.innerText = "Author name is too long";
        return false;
    } else if (!hebEngReg.test(author)) {
        errorArea.appendChild(authorError);
        authorError.innerText = "Author name must be in English or Hebrew";
        return false;
    } else {return true;};
};
let lengthValidation = function () {
    const length = document.getElementById("new-length").value;
    let lengthError = document.createElement("p");
    lengthError.classList.add("error-text");
    if (!numReg.test(length)) {
        errorArea.appendChild(lengthError);
        lengthError.innerText = "NUMBER of pages";
        return false;
    } if (length < 1) {
        errorArea.appendChild(lengthError);
        lengthError.innerText = "Number of pages must be greater than 0";
        return false;
    } if (length > 9999) {
        errorArea.appendChild(lengthError);
        lengthError.innerText = "fuck off";
        return false;
    } else {return true;};
};
let genreValidation = function () {
    const genre = document.getElementById("new-genre").value;
    let genreError = document.createElement("p");
    genreError.classList.add("error-text");
    if (genre.length < 2) {
        errorArea.appendChild(genreError);
        genreError.innerText = "Genre is too short";
        return false;
    } else if (genre.length > 15) {
        errorArea.appendChild(genreError);
        genreError.innerText = "Genre is too long";
        return false;
    } else if (!hebEngReg.test(genre)) {
        errorArea.appendChild(genreError);
        genreError.innerText = "Genre must be in English or Hebrew";
        return false;
    } else {return true;};
};
let newBookValidation = function () {
    let i = 0;
    if (titleValidation()) {i++};
    if (authorValidation()) {i++};
    if (lengthValidation()) {i++};
    if (genreValidation()) {i++};
    if (i === 4) {return true} else {return false};
};
let newBook = function() {
    const title = document.getElementById("new-title").value;
    const author = document.getElementById("new-author").value;
    const length = document.getElementById("new-length").value;
    const genre = document.getElementById("new-genre").value;
    const read = document.getElementById("read-check").checked;
    errorArea.innerHTML = "";
    if (newBookValidation() === true) {
        container.innerHTML = "";
        library.push(new Book(title, author, length, genre, read));
        library.forEach(book => {
            let row = document.createElement("div");
            row.classList.add("book");
            container.appendChild(row);
            for (const key in book) {
                if (Object.hasOwnProperty.call(book, key)) {
                    const element = book[key];
                    let cell = document.createElement("div");
                    let toggle = document.createElement("button");
                    cell.classList.add("cell");
                    row.appendChild(cell);
                    cell.innerText = element;
                    if (key === "read") {
                        if (element === true) {
                            cell.innerText = "Already read ";
                        } else {cell.innerText = "Not read ";};
                    };
                    
                };
            };
            let delBtn = document.createElement("button");
            delBtn.classList.add("del-btn");
            delBtn.innerText = "Delete";
            row.appendChild(delBtn);
            delBtn.addEventListener("click", function() {
                let parent = delBtn.parentElement;
                let bookName = parent.firstChild.innerText;
                let index = library.includes(bookName);
                if (index > -1) {
                    library.splice(index, 1);
                };
                parent.remove();
            });
        });
        dialog.close();
        form.reset();
    };
};

openBtn.addEventListener("click", () => {
    dialog.showModal();
});

cancelBtn.addEventListener("click", () => {
    dialog.close();
    form.reset();
});

addBtn.addEventListener("click", newBook);

form.addEventListener("submit", function() {
    event.preventDefault();
});

