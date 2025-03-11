import Ajv from 'ajv';

// Función para cargar los datos JSON
async function loadJSON(file: string): Promise<any> {
    const response = await fetch(file);
    return response.json();
}

// Función para validar los datos JSON usando un esquema
function validateJSON(data: any, schema: any): boolean {
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
function displayData(data: any[], container: HTMLElement) {
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
function processData(data: any[]): any[] {
    // 1. Filtrar: Seleccionar solo las farmacias que tienen foto
    const filteredData = data.filter((item: any) => item.properties.Foto);

    // 2. Mapear: Transformar los datos para incluir solo la información necesaria
    const mappedData = filteredData.map((item: any) => ({
        ...item,
        fullName: `${item.properties.Titular} - ${item.properties.Nombre}`
    }));

    // 3. Ordenar: Ordenar los datos por el nombre de la farmacia
    const sortedData = mappedData.sort((a: any, b: any) => a.properties.Nombre.localeCompare(b.properties.Nombre));

    // 4. Slice: Seleccionar solo los primeros 10 elementos
    const slicedData = sortedData.slice(0, 10);

    // 5. Función extra: Agregar un campo calculado (por ejemplo, si la farmacia está en un municipio específico)
    const finalData = slicedData.map((item: any) => ({
        ...item,
        isInSantaCruz: item.properties.Municipio === "Santa Cruz de La Palma"
    }));

    return finalData;
}

// Función principal
async function main() {
    const dataDisplay = document.getElementById('data-display') as HTMLDivElement;

    // Cargar los datos del archivo JSON
    const data = await loadJSON('Farmacias.geojson');

    // Validar los datos
    const schema = await loadJSON('schema.json');
    if (!validateJSON(data, schema)) {
        console.error('Datos no válidos');
        return;
    }

    // Procesar los datos
    const processedData = processData(data.features);

    // Mostrar los datos procesados
    displayData(processedData, dataDisplay);
}

// Ejecutar la función principal
main();
