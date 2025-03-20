// URL de la API de Open Library
const URL = 'https://openlibrary.org/search.json?q=the&limit=500';

// Referencias a los elementos del DOM
const searchInput = document.getElementById("search"); // Campo de búsqueda
const bookContainer = document.getElementById("book-container"); // Contenedor de libros
const suggestionsContainer = document.getElementById("suggestions-container"); // Contenedor de sugerencias
const searchType = document.getElementById("search-type"); // Selector de tipo de búsqueda

// Variable para almacenar todos los libros
let allBooks = [];

// Esquema JSON para validación
const schema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "docs": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "title": { "type": "string" },
          "author_name": { "type": "array", "items": { "type": "string" } },
          "cover_i": { "type": "number" },
          "first_publish_year": { "type": "number" }
        },
        "required": ["title"] // El título es obligatorio
      }
    }
  },
  "required": ["docs"] // La propiedad "docs" es obligatoria
};

// Función para validar los datos contra el esquema
function validateData(data) {
  const ajv = new Ajv(); // Crear una instancia de Ajv
  const validate = ajv.compile(schema); // Compilar el esquema
  const isValid = validate(data); // Validar los datos

  if (!isValid) {
    console.error("Errores de validación:", validate.errors); // Mostrar errores en la consola
    return false;
  }
  return true;
}

// Función para obtener los datos de la API
async function fetchData() {
  try {
    const response = await fetch(URL); // Hacer la solicitud a la API
    const data = await response.json(); // Convertir la respuesta a JSON

    // Validar los datos
    if (!validateData(data)) {
      throw new Error("Datos no válidos"); // Lanzar un error si los datos no son válidos
    }

    allBooks = data.docs; // Almacenar los libros en la variable allBooks
    displayBooks(allBooks); // Mostrar todos los libros al cargar la página
  } catch (error) {
    console.error('Error:', error); // Manejo de errores
  }
}

// Función para mostrar los libros en la página
function displayBooks(books) {
  bookContainer.innerHTML = ''; // Limpiar el contenedor de libros
  books.forEach(book => {
    const bookCard = document.createElement('div'); // Crear un div para cada libro
    bookCard.classList.add('book-card'); // Añadir la clase book-card

    // Extraer la información del libro (o usar valores por defecto si no están disponibles)
    const title = book.title || 'Título desconocido';
    const author = book.author_name ? book.author_name.join(', ') : 'Autor desconocido';
    const cover = book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : 'https://via.placeholder.com/150';
    const year = book.first_publish_year || 'Año desconocido';

    // Crear el contenido HTML para la tarjeta del libro
    bookCard.innerHTML = `
      <img src="${cover}" alt="${title}">
      <h3>${title}</h3>
      <p>Autor: ${author}</p>
      <p>Año: ${year}</p>
    `;
    bookContainer.appendChild(bookCard); // Añadir la tarjeta al contenedor
  });
}

// Función para mostrar sugerencias de autocompletado
function showSuggestions(query) {
  suggestionsContainer.innerHTML = ''; // Limpiar sugerencias anteriores
  if (query.length > 0) {
    const searchBy = searchType.value; // Obtener el tipo de búsqueda (título o autor)
    const filteredBooks = allBooks.filter(book => {
      if (searchBy === 'title') {
        return book.title.toLowerCase().includes(query.toLowerCase()); // Filtrar por título
      } else if (searchBy === 'author') {
        return book.author_name?.some(author => author.toLowerCase().includes(query.toLowerCase())); // Filtrar por autor
      }
      return false;
    });

    // Mostrar solo las primeras 5 sugerencias
    filteredBooks.slice(0, 5).forEach(book => {
      const suggestionItem = document.createElement('div');
      suggestionItem.textContent = searchBy === 'title' ? book.title : book.author_name?.join(', '); // Mostrar título o autor
      suggestionItem.classList.add('suggestion-item'); // Añadir clase para estilos
      suggestionItem.addEventListener('click', () => {
        searchInput.value = searchBy === 'title' ? book.title : book.author_name?.join(', '); // Completar el campo de búsqueda
        suggestionsContainer.style.display = 'none'; // Ocultar sugerencias
        filterBooks(searchInput.value); // Filtrar libros
      });
      suggestionsContainer.appendChild(suggestionItem); // Añadir la sugerencia al contenedor
    });
    suggestionsContainer.style.display = 'block'; // Mostrar el contenedor de sugerencias
  } else {
    suggestionsContainer.style.display = 'none'; // Ocultar el contenedor si no hay consulta
  }
}

// Función para filtrar libros
function filterBooks(query) {
  const searchBy = searchType.value; // Obtener el tipo de búsqueda
  const filteredBooks = allBooks.filter(book => {
    if (searchBy === 'title') {
      return book.title.toLowerCase().includes(query.toLowerCase()); // Filtrar por título
    } else if (searchBy === 'author') {
      return book.author_name?.some(author => author.toLowerCase().includes(query.toLowerCase())); // Filtrar por autor
    }
    return false;
  });
  displayBooks(filteredBooks); // Mostrar los libros filtrados
}

// Event listener para el campo de búsqueda
searchInput.addEventListener('input', (e) => {
  const query = e.target.value; // Obtener el valor del campo de búsqueda
  showSuggestions(query); // Mostrar sugerencias
  filterBooks(query); // Filtrar libros
});

// Event listener para el selector de tipo de búsqueda
searchType.addEventListener('change', () => {
  searchInput.value = ''; // Limpiar el campo de búsqueda
  suggestionsContainer.style.display = 'none'; // Ocultar sugerencias
  displayBooks(allBooks); // Mostrar todos los libros
});

// Ocultar sugerencias al hacer clic fuera
document.addEventListener('click', (e) => {
  if (e.target !== searchInput && e.target !== searchType) {
    suggestionsContainer.style.display = 'none'; // Ocultar sugerencias
  }
});

// Cargar los datos al iniciar
fetchData();
