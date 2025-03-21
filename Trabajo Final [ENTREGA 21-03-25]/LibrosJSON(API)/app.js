// URL base de la API de Open Library con límite de resultados
const BASE_URL = 'https://openlibrary.org/search.json?limit=500&q=';

// Seleccionar elementos del DOM
const bookContainer = document.getElementById('book-container');
const searchType = document.getElementById('search-type');
const searchInput = document.getElementById('search');

// Verificar si los elementos del DOM existen
if (!bookContainer || !searchType || !searchInput) {
  console.error('Error: No se encontraron los elementos del DOM necesarios.');
}

// Inicializar variable para almacenar los libros
let allBooks = [];

// Función para obtener los datos de la API
async function fetchData(query = 'the') {
  try {
    const response = await fetch(`${BASE_URL}${query}`); // Hacer la solicitud a la API
    const data = await response.json(); // Convertir la respuesta a JSON

    console.log('Datos obtenidos de la API:', data); // Verificar los datos obtenidos

    if (!data.docs) throw new Error("Datos no válidos"); // Verificar si hay datos

    allBooks = data.docs; // Almacenar los libros
    displayBooks(allBooks); // Mostrar todos los libros
  } catch (error) {
    console.error('Error:', error);
  }
}

// Función para mostrar los libros en la página
function displayBooks(books) {
  bookContainer.innerHTML = ''; // Limpiar el contenedor de libros
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

// Función para filtrar libros (ajustada a Open Library)
function filterBooks(query) {
  const searchBy = searchType.value;
  const filteredBooks = allBooks.filter(book => {
    if (searchBy === 'title') {
      return book.title?.toLowerCase().includes(query.toLowerCase());
    } else if (searchBy === 'author') {
      return book.author_name?.some(author => author.toLowerCase().includes(query.toLowerCase()));
    }
    return false;
  });
  displayBooks(filteredBooks);
}

// Agregar evento de búsqueda
searchInput.addEventListener('input', () => {
  const query = searchInput.value;
  filterBooks(query);
});

// Cargar los datos al iniciar
fetchData();