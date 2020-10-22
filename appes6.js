class Book {
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI {
    addBookToList(book){
        const list = document.getElementById('book-list');
        //create tr element
        const row = document.createElement('tr');
        // insert cols
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="delete">X</a></td>
        `;
    
        list.appendChild(row);
    }
    showAlert(message, className) {
        //create div
        const div = document.createElement('div');
        //add classes
        div.className = `alert ${className}`;
        // add text
        div.appendChild(document.createTextNode(message));
        //get parent
        const container = document.querySelector('.container');
        //get form
        const form = document.querySelector('#book-form');
        //insert alert
        container.insertBefore(div, form);
        //timeout after 3 seconds
        setTimeout(function(){
            document.querySelector('.alert').remove();
        }, 3000);

    }

    deleteBook(target){
        if (target.className === 'delete'){
            target.parentElement.parentElement.remove();
        }
    }
    clearFields(){
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }
}

//LOCAL STORAGE CLASS
class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null){
              books = [];
         } else {
              books = JSON.parse(localStorage.getItem('books'));
         }
        return books;
    }
        static displayBooks() {
            const books = Store.getBooks();

            books.forEach(function(book){
                const ui = new UI;

                //Add book to UI
                ui.addBookToList(book);
            });
        }
         static addBook(book) {
            const books = Store.getBooks();

            books.push(book);

            localStorage.setItem('books', JSON.stringify(books));
        }

        static removeBook(isbn) {
            const books = Store.getBooks();

            books.forEach(function(book, index){
                if(book.isbn === isbn) {
                    books.splice(index,1);
                }
            });       
            
            localStorage.setItem('books', JSON.stringify(books));
        }
    }

// DOM LOAD EVENT LISTENER
document.addEventListener('DOMContentLoaded', Store.displayBooks);

// EVENT LISTENER FOR ADD BOOK
document.getElementById('book-form').addEventListener('submit', function(e){
    //Get Form Values
    const title = document.getElementById('title').value,
         author = document.getElementById('author').value,
         isbn = document.getElementById('isbn').value
         console.log(title, author, isbn);
    //instantiate book
    const book = new Book(title, author, isbn);

    //instantiate ui
    const ui = new UI();
    console.log(ui);
    //Validate
    if(title === '' || author === '' || isbn === ''){
        //Error alert
        ui.showAlert('Please fill in all fields', 'error')
    } else {
        //Add book to list
    ui.addBookToList(book);

    //add to LS
    Store.addBook(book);

        // Show success
    ui.showAlert('Book added!', 'success');

    //clear fields
    ui.clearFields();
    }

    console.log(book);
    e.preventDefault();
});

// EVENT LISTENER FOR DELETE
document.getElementById('book-list').addEventListener('click', function(e){
    //instantiate ui
    const ui = new UI();
    //delete book
    ui.deleteBook(e.target);

    //Remove from LS
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    //show message
    ui.showAlert('Book Removed!', 'success');

    e.preventDefault();
});
