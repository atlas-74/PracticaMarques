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
                <p>Punto de Muestreo: ${item.punto_muestreo}</p>
                <p>Municipio: ${item.municipio}</p>
                <p>Provincia: ${item.provincia}</p>
                <p>Contaminante: ${item.magnitud}</p>
                <p>Contaminación (h01): ${item.h01}</p>
            </div>
        `).join('');
    }
}

// Función principal
function main() {
    // Filtrar datos por provincia (ejemplo: provincia 28)
    const filteredData = filterByProvincia(data.data, "28");

    // Calcular la media de contaminación para la provincia 28
    const meanContamination = calculateMeanByProvincia(filteredData, "28");
    console.log("Media de contaminación en la provincia 28:", meanContamination);

    // Ordenar datos por contaminación (ascendente por defecto)
    const sortedData = sortByContamination(filteredData, "desc"); // Cambiar a "asc" para orden ascendente
    console.log("Datos ordenados por contaminación:", sortedData);

    // Mostrar los datos filtrados y ordenados en la página web
    displayData(sortedData);
}

// Ejecutar la función principal
main();
