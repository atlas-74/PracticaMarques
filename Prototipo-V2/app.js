var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

// Función para cargar los datos JSON
function loadJSON(file) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(file);
        return response.json();
    });
}

// Función para validar los datos JSON usando un esquema
function validateJSON(data, schema) {
    const ajv = new Ajv(); // Crear una instancia de Ajv
    const validate = ajv.compile(schema); // Compilar el esquema
    const valid = validate(data); // Validar los datos
    if (!valid) {
        console.error(validate.errors); // Mostrar errores de validación
        return false;
    }
    return true;
}

// Función para mostrar los datos en la página
function displayData(data, container) {
    container.innerHTML = ''; // Limpiar el contenedor
    data.forEach(item => {
        const div = document.createElement('div');
        div.className = 'data-item';
        div.innerHTML = `
            <h3>${item.properties.Nombre}</h3>
            <p><strong>Municipio:</strong> ${item.properties.Municipio}</p>
            <p><strong>Dirección:</strong> ${item.properties.Dirección}</p>
            <p><strong>Teléfono:</strong> ${item.properties.Teléfono}</p>
            <p><strong>Titular:</strong> ${item.properties.Titular}</p>
            <img src="${item.properties.Foto}" alt="Foto de ${item.properties.Nombre}" style="width:100px; height:auto;">
        `;
        container.appendChild(div);
    });
}

// Función para procesar los datos
function processData(data) {
    // 1. Filtrar: Seleccionar solo las farmacias que tienen foto
    const filteredData = data.filter((item) => item.properties.Foto);
    // 2. Mapear: Transformar los datos para incluir solo la información necesaria
    const mappedData = filteredData.map((item) => (Object.assign(Object.assign({}, item), { fullName: `${item.properties.Titular} - ${item.properties.Nombre}` })));
    // 3. Ordenar: Ordenar los datos por el nombre de la farmacia
    const sortedData = mappedData.sort((a, b) => a.properties.Nombre.localeCompare(b.properties.Nombre));
    // 4. Slice: Seleccionar solo los primeros 10 elementos
    const slicedData = sortedData.slice(0, 10);
    // 5. Función extra: Agregar un campo calculado (por ejemplo, si la farmacia está en un municipio específico)
    const finalData = slicedData.map((item) => (Object.assign(Object.assign({}, item), { isInSantaCruz: item.properties.Municipio === "Santa Cruz de La Palma" })));
    return finalData;
}

// Función principal
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const dataDisplay = document.getElementById('data-display');
        // Cargar los datos del archivo JSON
        const data = yield loadJSON('Farmacias.geojson');
        // Validar los datos
        const schema = yield loadJSON('schema.json');
        if (!validateJSON(data, schema)) {
            console.error('Datos no válidos');
            return;
        }
        // Procesar los datos
        const processedData = processData(data.features);
        // Mostrar los datos procesados
        displayData(processedData, dataDisplay);
    });
}

// Ejecutar la función principal
main();
