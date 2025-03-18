import Ajv from 'ajv';
import schema from './schema.json'; // Importar el esquema
import data from './calidad_aire_datos_dia.json'; // Importar los datos

// Crear una instancia de AJV
const ajv = new Ajv();

// Compilar el esquema
const validate = ajv.compile(schema);

// Validar los datos
const isValid = validate(data);

if (!isValid) {
    console.error("Datos no válidos:", validate.errors);
    alert("Error: Los datos no son válidos. Por favor, revisa el archivo JSON.");
    throw new Error("Datos no válidos");
}

// Función para convertir valores de contaminación a números
function parseContaminationValue(value: string): number {
    return parseFloat(value) || 0; // Si no es un número válido, devuelve 0
}

// Filtrar datos por provincia
function filterByProvincia(data: any[], provincia: string): any[] {
    return data.filter((item) => item.provincia === provincia);
}

// Calcular la media de contaminación por provincia y magnitud
function calculateMeanByProvincia(data: any[], provincia: string, field: string): number {
    const filteredData = filterByProvincia(data, provincia);
    const total = filteredData.reduce((acc, item) => {
        return acc + parseContaminationValue(item[field]);
    }, 0);
    return filteredData.length > 0 ? total / filteredData.length : 0; // Evitar división por cero
}

// Función para ordenar datos por contaminación
function sortByContamination(data: any[], field: string, order: "asc" | "desc" = "asc"): any[] {
    return data.sort((a, b) => {
        const aValue = parseContaminationValue(a[field]);
        const bValue = parseContaminationValue(b[field]);
        return order === "asc" ? aValue - bValue : bValue - aValue;
    });
}

// Mostrar los datos en la página web
function displayData(data: any[], field: string): void {
    const container = document.getElementById('data-container');
    if (container) {
        container.innerHTML = data.map((item) => `
            <div class="data-item">
                <p><strong>Punto de Muestreo:</strong> ${item.punto_muestreo}</p>
                <p><strong>Municipio:</strong> ${item.municipio}</p>
                <p><strong>Provincia:</strong> ${item.provincia}</p>
                <p><strong>Contaminante:</strong> ${item.magnitud}</p>
                <p><strong>Contaminación (${field}):</strong> ${item[field]}</p>
            </div>
        `).join('');
    }
}

// Función principal
function main() {
    const provinciaSelect = document.getElementById('provincia-select') as HTMLSelectElement;
    const magnitudSelect = document.getElementById('magnitud-select') as HTMLSelectElement;
    const orderSelect = document.getElementById('order-select') as HTMLSelectElement;
    const filterButton = document.getElementById('filter-button');

    if (filterButton) {
        filterButton.addEventListener('click', () => {
            const provincia = provinciaSelect.value;
            const magnitud = magnitudSelect.value;
            const order = orderSelect.value as "asc" | "desc";

            const filteredData = filterByProvincia(data.data, provincia);
            const sortedData = sortByContamination(filteredData, magnitud, order);

            // Mostrar los datos filtrados y ordenados en la página web
            displayData(sortedData, magnitud);

            // Mostrar la media de contaminación
            const meanContamination = calculateMeanByProvincia(filteredData, provincia, magnitud);
            const meanContainer = document.getElementById('mean-container');
            if (meanContainer) {
                meanContainer.innerHTML = `<p><strong>Media de Contaminación (${magnitud}):</strong> ${meanContamination.toFixed(2)}</p>`;
            }
        });
    }
}

// Ejecutar la función principal
main();
