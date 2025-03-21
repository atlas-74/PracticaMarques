// URL de la API de Rest Countries para obtener todos los países
const URL2 = 'https://restcountries.com/v3.1/all';

// Seleccionar elementos del DOM
const searchInput = document.getElementById("search") as HTMLInputElement;
const countryContainer = document.getElementById("country-container");
const searchButton = document.getElementById("search-button");
const suggestionsContainer = document.getElementById("suggestions-container");

// Definir la interfaz para los datos de un país
interface Country {
  name: {
    common: string; // Nombre común del país
  };
  flags: {
    png: string; // URL de la imagen de la bandera en formato PNG
  };
  region: string; // Región del país
}

// Inicializar una variable para almacenar los nombres de todos los países
let allCountryNames: string[] = [];

// Función para obtener los datos de la API
async function fetchData() {
  try {
    const response = await fetch(URL2); // Hacer la solicitud a la API
    const data: Country[] = await response.json(); // Convertir la respuesta a JSON
    allCountryNames = data.map(country => country.name.common); // Extraer y almacenar los nombres de los países
    console.log(allCountryNames); // Mostrar los nombres de los países en la consola
  } catch (error) {
    console.error('Error:', error); // Mostrar un mensaje de error en caso de fallo
  }
}

// Llamar a la función fetchData para obtener los datos al cargar la página
fetchData();

// Función para mostrar sugerencias mientras se escribe en el campo de búsqueda
function showSuggestions() {
  const query = searchInput.value.toLowerCase(); // Obtener el valor del campo de búsqueda en minúsculas
  if (suggestionsContainer) {
    suggestionsContainer.innerHTML = ''; // Limpiar el contenedor de sugerencias
  }
  if (query.length > 0) {
    const filteredNames = allCountryNames.filter(name => name.toLowerCase().startsWith(query)); // Filtrar los nombres que comienzan con la consulta
    filteredNames.forEach(name => {
      const suggestionItem = document.createElement('div'); // Crear un nuevo elemento div para cada sugerencia
      suggestionItem.textContent = name.charAt(0).toUpperCase() + name.slice(1); // Capitalizar la primera letra del nombre
      suggestionItem.classList.add('suggestion-item'); // Agregar una clase al elemento de sugerencia
      suggestionItem.addEventListener('click', () => {
        searchInput.value = name; // Establecer el valor del campo de búsqueda al nombre seleccionado
        if (suggestionsContainer) {
          suggestionsContainer.innerHTML = ''; // Limpiar el contenedor de sugerencias cuando se selecciona un elemento
        }
        searchCountry(); // Llamar a la función searchCountry para buscar el país seleccionado
      });
      suggestionsContainer?.appendChild(suggestionItem); // Agregar el elemento de sugerencia al contenedor de sugerencias
    });
  }
}

// Función para buscar un país y mostrar su información
async function searchCountry() {
  const searchedCountry = searchInput?.value.toLowerCase(); // Obtener el valor del campo de búsqueda en minúsculas
  try {
    const response = await fetch(URL2); // Hacer la solicitud a la API
    const data: Country[] = await response.json(); // Convertir la respuesta a JSON
    const countryData = data.find(country => country.name.common.toLowerCase() === searchedCountry); // Buscar el país en los datos obtenidos
    if (countryData) {
      let countryName = countryData.name.common.charAt(0).toUpperCase() + countryData.name.common.slice(1); // Capitalizar la primera letra del nombre del país
      if (countryContainer) {
        countryContainer.innerHTML = 
        `
          <h3 id="country-name">${countryName}</h3>
          <img id="country-flag" src="${countryData.flags.png}" alt="${countryData.name.common}">
          <p id="country-region">Region: ${countryData.region}</p>
        `; // Mostrar el nombre, la bandera y la región del país en el contenedor
      } else {
        console.error('Country Container is null'); // Mostrar un mensaje de error si el contenedor es nulo
      }
    } else {
      console.error('Country not found'); // Mostrar un mensaje de error si no se encuentra el país
    }
  } catch (error) {
    console.error('Error fetching country data:', error); // Mostrar un mensaje de error en caso de fallo
  }
}

// Agregar un evento para llamar a la función searchCountry cuando se hace clic en el botón de búsqueda
searchButton?.addEventListener("click", searchCountry);

// Agregar un evento para llamar a la función searchCountry cuando se presiona una tecla
searchInput?.addEventListener("keypress", e => {
  // Si la tecla presionada es Enter, llamar a la función searchCountry
  if (e.key === "Enter") {
    searchCountry();
  }
});

// Agregar un evento para mostrar sugerencias mientras se escribe en el campo de búsqueda
searchInput?.addEventListener("input", showSuggestions);