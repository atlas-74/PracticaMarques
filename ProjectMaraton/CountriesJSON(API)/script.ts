const URL2 = 'https://restcountries.com/v3.1/all';

const searchInput = document.getElementById("search") as HTMLInputElement;
const countryContainer = document.getElementById("country-container");
const searchButton = document.getElementById("search-button");
const suggestionsContainer = document.getElementById("suggestions-container");

interface Country {
  name: {
    common: string;
  };
  flags: {
    png: string;
  };
  region: string;
}

let allCountryNames: string[] = [];

async function fetchData() {
  try {
    const response = await fetch(URL2);
    const data: Country[] = await response.json();
    allCountryNames = data.map(country => country.name.common);
    console.log(allCountryNames);
  } catch (error) {
    console.error('Error:', error);
  }
}

fetchData();

function showSuggestions() {
  const query = searchInput.value.toLowerCase();
  if (suggestionsContainer) {
    suggestionsContainer.innerHTML = ''; // Clear the suggestions container
  }
  if (query.length > 0) {
    const filteredNames = allCountryNames.filter(name => name.toLowerCase().startsWith(query));
    filteredNames.forEach(name => {
      const suggestionItem = document.createElement('div');
      suggestionItem.textContent = name.charAt(0).toUpperCase() + name.slice(1);
      suggestionItem.classList.add('suggestion-item');
      suggestionItem.addEventListener('click', () => {
        searchInput.value = name;
        if (suggestionsContainer) {
          suggestionsContainer.innerHTML = ''; // Clear the suggestions container when an item is selected
        }
        searchCountry();
      });
      suggestionsContainer?.appendChild(suggestionItem);
    });
  }
}

async function searchCountry() {
  const searchedCountry = searchInput?.value.toLowerCase();
  try {
    const response = await fetch(URL2);
    const data: Country[] = await response.json();
    const countryData = data.find(country => country.name.common.toLowerCase() === searchedCountry);
    if (countryData) {
      let countryName = countryData.name.common.charAt(0).toUpperCase() + countryData.name.common.slice(1);
      if (countryContainer) {
        countryContainer.innerHTML = 
        `
          <h3 id="country-name">${countryName}</h3>
          <img id="country-flag" src="${countryData.flags.png}" alt="${countryData.name.common}">
          <p id="country-region">Region: ${countryData.region}</p>
        `;
      } else {
        console.error('Country Container is null');
      }
    } else {
      console.error('Country not found');
    }
  } catch (error) {
    console.error('Error fetching country data:', error);
  }
}

// Event listener to call the searchCountry function when the search button is clicked
searchButton?.addEventListener("click", searchCountry);

// Event listener to call the searchCountry function when a key is pressed
searchInput?.addEventListener("keypress", e => {
  // If the pressed key is Enter, call the searchCountry function
  if (e.key === "Enter") {
    searchCountry();
  }
});

// Event listener to show suggestions while typing
searchInput?.addEventListener("input", showSuggestions);