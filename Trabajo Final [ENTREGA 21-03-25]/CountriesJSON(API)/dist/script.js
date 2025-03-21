"use strict";

// Función auxiliar para manejar promesas y generadores
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    // Función para adoptar un valor como promesa
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    // Retorna una nueva promesa
    return new (P || (P = Promise))(function (resolve, reject) {
        // Función para manejar el paso exitoso de la promesa
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        // Función para manejar el rechazo de la promesa
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        // Función para manejar los pasos de la promesa
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        // Inicia el generador
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

// Función auxiliar para manejar generadores
var __generator = (this && this.__generator) || function (thisArg, body) {
    // Variables internas para manejar el estado del generador
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    // Define el método next del iterador
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    // Función para manejar los verbos del generador
    function verb(n) { return function (v) { return step([n, v]); }; }
    // Función para manejar los pasos del generador
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// URL de la API de Rest Countries para obtener todos los países
var URL2 = 'https://restcountries.com/v3.1/all';

// Seleccionar elementos del DOM
var searchInput = document.getElementById("search");
var countryContainer = document.getElementById("country-container");
var searchButton = document.getElementById("search-button");
var suggestionsContainer = document.getElementById("suggestions-container");

// Inicializar una variable para almacenar los nombres de todos los países
var allCountryNames = [];

// Función para obtener los datos de la API
function fetchData() {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch(URL2)];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    allCountryNames = data.map(function (country) { return country.name.common; });
                    console.log(allCountryNames);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error:', error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}

// Llamar a la función fetchData para obtener los datos al cargar la página
fetchData();

// Función para mostrar sugerencias mientras se escribe en el campo de búsqueda
function showSuggestions() {
    var query = searchInput.value.toLowerCase(); // Obtener el valor del campo de búsqueda en minúsculas
    if (suggestionsContainer) {
        suggestionsContainer.innerHTML = ''; // Limpiar el contenedor de sugerencias
    }
    if (query.length > 0) {
        var filteredNames = allCountryNames.filter(function (name) { return name.toLowerCase().startsWith(query); }); // Filtrar los nombres que comienzan con la consulta
        filteredNames.forEach(function (name) {
            var suggestionItem = document.createElement('div'); // Crear un nuevo elemento div para cada sugerencia
            suggestionItem.textContent = name.charAt(0).toUpperCase() + name.slice(1); // Capitalizar la primera letra del nombre
            suggestionItem.classList.add('suggestion-item'); // Agregar una clase al elemento de sugerencia
            suggestionItem.addEventListener('click', function () {
                searchInput.value = name; // Establecer el valor del campo de búsqueda al nombre seleccionado
                if (suggestionsContainer) {
                    suggestionsContainer.innerHTML = ''; // Limpiar el contenedor de sugerencias cuando se selecciona un elemento
                }
                searchCountry(); // Llamar a la función searchCountry para buscar el país seleccionado
            });
            suggestionsContainer === null || suggestionsContainer === void 0 ? void 0 : suggestionsContainer.appendChild(suggestionItem); // Agregar el elemento de sugerencia al contenedor de sugerencias
        });
    }
}

// Función para buscar un país y mostrar su información
function searchCountry() {
    return __awaiter(this, void 0, void 0, function () {
        var searchedCountry, response, data, countryData, countryName, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    searchedCountry = searchInput === null || searchInput === void 0 ? void 0 : searchInput.value.toLowerCase(); // Obtener el valor del campo de búsqueda en minúsculas
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch(URL2)];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    countryData = data.find(function (country) { return country.name.common.toLowerCase() === searchedCountry; }); // Buscar el país en los datos obtenidos
                    if (countryData) {
                        countryName = countryData.name.common.charAt(0).toUpperCase() + countryData.name.common.slice(1); // Capitalizar la primera letra del nombre del país
                        if (countryContainer) {
                            countryContainer.innerHTML =
                                "\n          <h3 id=\"country-name\">".concat(countryName, "</h3>\n          <img id=\"country-flag\" src=\"").concat(countryData.flags.png, "\" alt=\"").concat(countryData.name.common, "\">\n          <p id=\"country-region\">Region: ").concat(countryData.region, "</p>\n        "); // Mostrar el nombre, la bandera y la región del país en el contenedor
                        }
                        else {
                            console.error('Country Container is null'); // Mostrar un mensaje de error si el contenedor es nulo
                        }
                    }
                    else {
                        console.error('Country not found'); // Mostrar un mensaje de error si no se encuentra el país
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _a.sent();
                    console.error(error_2); // Mostrar un mensaje de error en caso de fallo
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}

// Agregar un evento para llamar a la función searchCountry cuando se hace clic en el botón de búsqueda
searchButton === null || searchButton === void 0 ? void 0 : searchButton.addEventListener("click", searchCountry);

// Agregar un evento para llamar a la función searchCountry cuando se presiona una tecla
searchInput === null || searchInput === void 0 ? void 0 : searchInput.addEventListener("keypress", function (e) {
    // Si la tecla presionada es Enter, llamar a la función searchCountry
    if (e.key === "Enter") {
        searchCountry();
    }
});

// Agregar un evento para mostrar sugerencias mientras se escribe en el campo de búsqueda
searchInput === null || searchInput === void 0 ? void 0 : searchInput.addEventListener("input", showSuggestions);