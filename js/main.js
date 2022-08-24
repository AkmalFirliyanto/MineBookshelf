const books = [];
const RENDER_EVENT = "render-book";

// input book
document.addEventListener('DOMContentLoaded', function(e) {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function(event) {
        
        event.preventDefault();
        addBook();
        
    });
    if (isStorageExist()) {
            loadDataFromStorage();
        }
});

function addBook() {
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const year = document.getElementById("year").value;
    const isComplete = document.getElementById("isComplete");

    const genId = generateId();
    const bookObj = generateBookObject(genId, title, author, year, false);
    books.push(bookObj);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    makeBook(bookObj);
    alert("Suksess, Buku kamu telah ditambahkan");
}


function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted: isComplete.checked,
    }
}

// manage buku 

function makeBook(bookObj) {
    const textTitle = document.createElement('h3');
    textTitle.classList.add('title');
    textTitle.innerText = bookObj.title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = bookObj.author;

    const textYear = document.createElement('p');
    textYear.innerText = bookObj.year;

    const checkButtonImg = document.createElement('img');
    checkButtonImg.src = "./assets/check.png";

    const undoButtonImg = document.createElement('img');
    undoButtonImg.src = "./assets/refresh.png";

    const trashButtonImg = document.createElement('img');
    trashButtonImg.src = "./assets/trash.png";

    const button = document.createElement('div');
    button.classList.add('action');

    const container = document.createElement('article');
    container.classList.add('book_item');

    container.append(textTitle, textAuthor, textYear, button);
    container.setAttribute('id', `book-${bookObj.id}`);
    
    if(bookObj.isCompleted){
        const undoButton = document.createElement('button');
        undoButton.classList.add('refresh-button')
    
        undoButton.addEventListener('click', function(e){
        undoBookFromCompleted(bookObj.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');

        trashButton.addEventListener('click', function(e){
        removeBookFromCompleted(bookObj.id);
        });
        
        trashButton.append(trashButtonImg);
        undoButton.append(undoButtonImg);
        button.append(undoButton, trashButton);
    }else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');

        checkButton.addEventListener('click', function () {
        checkBookFromCompleted(bookObj.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');

        trashButton.addEventListener('click', function(e){   
            removeBookFromCompleted(bookObj.id);
        });

        trashButton.append(trashButtonImg);
        checkButton.append(checkButtonImg);
        button.append(checkButton, trashButton);
  }

    return container;
}


document.addEventListener(RENDER_EVENT, function(e){
    const unFinishedBookList = document.getElementById('unfinished-read');
    unFinishedBookList.innerHTML = '';

    const finishedBookList = document.getElementById('finished-read');
    finishedBookList.innerHTML = '';
 
    for(const bookItem of books){
        const bookElement = makeBook(bookItem);
        if(!bookItem.isCompleted){
            unFinishedBookList.append(bookElement);
        }else{
            finishedBookList.append(bookElement);
        }
    }
});

function checkBookFromCompleted (bookId) {
  const bookTarget = findBook(bookId);
 
  if (bookTarget == null) return;
 
  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function removeBookFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);
 
  if (bookTarget === -1) return;
 
  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
 
 
function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);
 
  if (bookTarget == null) return;
 
  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
 
  return -1;
}


// search book by title
const searchBook = document.getElementById("cari-buku");

searchBook.addEventListener('keyup', listBuku);

function listBuku(e){
    const searchBook = e.target.value.toLowerCase(); 
    let bookItem = document.querySelectorAll(".book_item");

    bookItem.forEach((book) => {        
        const bookShelf = book.firstChild.textContent.toLowerCase();

        if(bookShelf.indexOf(searchBook) != -1 ){
            book.setAttribute("style", "display: block;");
        }else{
            book.setAttribute("style", "display: none !important;");
        }
    })
};

// local storages

const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

function isStorageExist(){
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}


function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
 
  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
 
  document.dispatchEvent(new Event(RENDER_EVENT));
}
