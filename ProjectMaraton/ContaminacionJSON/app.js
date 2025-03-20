const URL = 'https://openlibrary.org/search.json?q=the&limit=500';

const searchInput = document.getElementById("search");
const bookContainer = document.getElementById("book-container");
const suggestionsContainer = document.getElementById("suggestions-container");
const searchType = document.getElementById("search-type");
const container = document.querySelector(".container");

let allBooks = [];

// Función para obtener los datos de la API
async function fetchData() {
  try {
    const response = await fetch(URL);
    const data = await response.json();
    allBooks = data.docs;
    displayBooks(allBooks);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Función para mostrar los libros
function displayBooks(books) {
  bookContainer.innerHTML = '';
  books.forEach(book => {
    const bookCard = document.createElement('div');
    bookCard.classList.add('book-card');

    const title = book.title || 'Título desconocido';
    const author = book.author_name ? book.author_name.join(', ') : 'Autor desconocido';
    const cover = book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : 'https://via.placeholder.com/150';
    const year = book.first_publish_year || 'Año desconocido';

    bookCard.innerHTML = `
      <img src="${cover}" alt="${title}">
      <h3>${title}</h3>
      <p>Autor: ${author}</p>
      <p>Año: ${year}</p>
    `;
    bookContainer.appendChild(bookCard);
  });
}

// Función para mostrar sugerencias de autocompletado
function showSuggestions(query) {
  suggestionsContainer.innerHTML = '';
  if (query.length > 0) {
    const searchBy = searchType.value; // Obtener el tipo de búsqueda (título o autor)
    const filteredBooks = allBooks.filter(book => {
      if (searchBy === 'title') {
        return book.title.toLowerCase().includes(query.toLowerCase());
      } else if (searchBy === 'author') {
        return book.author_name?.some(author => author.toLowerCase().includes(query.toLowerCase()));
      }
      return false;
    });

    filteredBooks.slice(0, 5).forEach(book => {
      const suggestionItem = document.createElement('div');
      suggestionItem.textContent = searchBy === 'title' ? book.title : book.author_name?.join(', ');
      suggestionItem.classList.add('suggestion-item');
      suggestionItem.addEventListener('click', () => {
        searchInput.value = searchBy === 'title' ? book.title : book.author_name?.join(', ');
        suggestionsContainer.style.display = 'none';
        container.style.marginTop = '0'; // Restaurar posición
        filterBooks(searchInput.value);
      });
      suggestionsContainer.appendChild(suggestionItem);
    });
    suggestionsContainer.style.display = 'block'; // Mostrar sugerencias
    container.style.marginTop = '60px'; // Desplazar el contenido hacia abajo
  } else {
    suggestionsContainer.style.display = 'none'; // Ocultar sugerencias
    container.style.marginTop = '0'; // Restaurar posición
  }
}

// Función para filtrar libros
function filterBooks(query) {
  const searchBy = searchType.value;
  const filteredBooks = allBooks.filter(book => {
    if (searchBy === 'title') {
      return book.title.toLowerCase().includes(query.toLowerCase());
    } else if (searchBy === 'author') {
      return book.author_name?.some(author => author.toLowerCase().includes(query.toLowerCase()));
    }
    return false;
  });
  displayBooks(filteredBooks);
}

// Event listener para el campo de búsqueda
searchInput.addEventListener('input', (e) => {
  const query = e.target.value;
  console.log("Input cambiado:", query); // Depuración
  showSuggestions(query);
  filterBooks(query);
});

// Event listener para el selector de tipo de búsqueda
searchType.addEventListener('change', () => {
  searchInput.value = ''; // Limpiar el campo de búsqueda
  suggestionsContainer.style.display = 'none'; // Ocultar sugerencias
  container.style.marginTop = '0'; // Restaurar posición
  displayBooks(allBooks); // Mostrar todos los libros
});

// Ocultar sugerencias al hacer clic fuera
document.addEventListener('click', (e) => {
  if (e.target !== searchInput && e.target !== searchType) {
    suggestionsContainer.style.display = 'none';
    container.style.marginTop = '0'; // Restaurar posición
  }
});

// Cargar los datos al iniciar
fetchData();
