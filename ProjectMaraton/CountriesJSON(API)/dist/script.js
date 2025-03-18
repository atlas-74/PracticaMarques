"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
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
var URL2 = 'https://restcountries.com/v3.1/all';
var searchInput = document.getElementById("search");
var countryContainer = document.getElementById("country-container");
var searchButton = document.getElementById("search-button");
var suggestionsContainer = document.getElementById("suggestions-container");
var allCountryNames = [];
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
fetchData();
function showSuggestions() {
    var query = searchInput.value.toLowerCase();
    if (suggestionsContainer) {
        suggestionsContainer.innerHTML = ''; // Clear the suggestions container
    }
    if (query.length > 0) {
        var filteredNames = allCountryNames.filter(function (name) { return name.toLowerCase().startsWith(query); });
        filteredNames.forEach(function (name) {
            var suggestionItem = document.createElement('div');
            suggestionItem.textContent = name.charAt(0).toUpperCase() + name.slice(1);
            suggestionItem.classList.add('suggestion-item');
            suggestionItem.addEventListener('click', function () {
                searchInput.value = name;
                if (suggestionsContainer) {
                    suggestionsContainer.innerHTML = ''; // Clear the suggestions container when an item is selected
                }
                searchCountry();
            });
            suggestionsContainer === null || suggestionsContainer === void 0 ? void 0 : suggestionsContainer.appendChild(suggestionItem);
        });
    }
}
function searchCountry() {
    return __awaiter(this, void 0, void 0, function () {
        var searchedCountry, response, data, countryData, countryName, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    searchedCountry = searchInput === null || searchInput === void 0 ? void 0 : searchInput.value.toLowerCase();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch(URL2)];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    countryData = data.find(function (country) { return country.name.common.toLowerCase() === searchedCountry; });
                    if (countryData) {
                        countryName = countryData.name.common.charAt(0).toUpperCase() + countryData.name.common.slice(1);
                        if (countryContainer) {
                            countryContainer.innerHTML =
                                "\n          <h3 id=\"country-name\">".concat(countryName, "</h3>\n          <img id=\"country-flag\" src=\"").concat(countryData.flags.png, "\" alt=\"").concat(countryData.name.common, "\">\n          <p id=\"country-region\">Region: ").concat(countryData.region, "</p>\n        ");
                        }
                        else {
                            console.error('Country Container is null');
                        }
                    }
                    else {
                        console.error('Country not found');
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _a.sent();
                    console.error(error_2);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// Event listener to call the searchCountry function when the search button is clicked
searchButton === null || searchButton === void 0 ? void 0 : searchButton.addEventListener("click", searchCountry);
// Event listener to call the searchCountry function when a key is pressed
searchInput === null || searchInput === void 0 ? void 0 : searchInput.addEventListener("keypress", function (e) {
    // If the pressed key is Enter, call the searchCountry function
    if (e.key === "Enter") {
        searchCountry();
    }
});
// Event listener to show suggestions while typing
searchInput === null || searchInput === void 0 ? void 0 : searchInput.addEventListener("input", showSuggestions);
