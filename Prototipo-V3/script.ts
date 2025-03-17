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

// Filtrar datos por provincia
function filterByProvincia(data: any[], provincia: string): any[] {
    return data.filter((item) => item.provincia === provincia);
}

// Calcular la media de contaminación por provincia
function calculateMeanByProvincia(data: any[], provincia: string): number {
    const filteredData = filterByProvincia(data, provincia);
    const total = filteredData.reduce((acc, item) => {
        return acc + parseFloat(item.h01 || 0); // Usar h01 como contaminante
    }, 0);
    return total / filteredData.length;
}

// Función extra: Ordenar datos por contaminación (h01)
function sortByContamination(data: any[], order: "asc" | "desc" = "asc"): any[] {
    return data.sort((a, b) => {
        const aValue = parseFloat(a.h01 || 0);
        const bValue = parseFloat(b.h01 || 0);
        return order === "asc" ? aValue - bValue : bValue - aValue;
    });
}

// Mostrar los datos en la página web
function displayData(data: any[]): void {
    const container = document.getElementById('data-container');
    if (container) {
        container.innerHTML = data.map((item) => `
            <div class="data-item">
                <p><strong>Punto de Muestreo:</strong> ${item.punto_muestreo}</p>
                <p><strong>Municipio:</strong> ${item.municipio}</p>
                <p><strong>Provincia:</strong> ${item.provincia}</p>
                <p><strong>Contaminante:</strong> ${item.magnitud}</p>
                <p><strong>Contaminación (h01):</strong> ${item.h01}</p>
            </div>
        `).join('');
    }
}

// Función principal
function main() {
    // Filtrar datos por provincia (ejemplo: provincia 28)
    const provinciaSelect = document.getElementById('provincia-select') as HTMLSelectElement;
    const orderSelect = document.getElementById('order-select') as HTMLSelectElement;
    const filterButton = document.getElementById('filter-button');

    if (filterButton) {
        filterButton.addEventListener('click', () => {
            const provincia = provinciaSelect.value;
            const order = orderSelect.value as "asc" | "desc";

            const filteredData = filterByProvincia(data.data, provincia);
            const sortedData = sortByContamination(filteredData, order);

            // Mostrar los datos filtrados y ordenados en la página web
            displayData(sortedData);

            // Mostrar la media de contaminación
            const meanContamination = calculateMeanByProvincia(filteredData, provincia);
            const meanContainer = document.getElementById('mean-container');
            if (meanContainer) {
                meanContainer.innerHTML = `<p><strong>Media de Contaminación:</strong> ${meanContamination.toFixed(2)}</p>`;
            }
        });
    }
}

// Ejecutar la función principal
main();
