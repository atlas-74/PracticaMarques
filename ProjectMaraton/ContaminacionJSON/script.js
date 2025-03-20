

// Función para convertir valores de contaminación a números
function parseContaminationValue(value) {
    return parseFloat(value) || 0; // Si no es un número válido, devuelve 0
}

// Filtrar datos por provincia
function filterByProvincia(data, provincia) {
    return data.filter((item) => item.provincia === provincia);
}

// Calcular la media de contaminación por provincia y magnitud
function calculateMeanByProvincia(data, provincia, field) {
    const filteredData = filterByProvincia(data, provincia);
    const validValues = filteredData.map((item) => parseContaminationValue(item[field])).filter((value) => !isNaN(value));
    return validValues.length > 0 ? validValues.reduce((acc, value) => acc + value, 0) / validValues.length : 0;
}

// Función para ordenar datos por contaminación
function sortByContamination(data, field, order = "asc") {
    return data.sort((a, b) => {
        const aValue = parseContaminationValue(a[field]);
        const bValue = parseContaminationValue(b[field]);
        return order === "asc" ? aValue - bValue : bValue - aValue;
    });
}

// Mostrar los datos en la página web
function displayData(data, field) {
    const container = document.getElementById('data-container');
    if (container) {
        container.innerHTML = data.map((item) => `
            <div class="data-item">
                <p><strong>Punto de Muestreo:</strong> ${item.punto_muestreo}</p>
                <p><strong>Municipio:</strong> ${item.municipio}</p>
                <p><strong>Provincia:</strong> ${item.provincia}</p>
                <p><strong>Contaminante:</strong> ${item.magnitud}</p>
                <p><strong>Contaminación (${field}):</strong> ${item[field] || "N/A"}</p>
            </div>
        `).join('');
    }
}

// Función principal
function main() {
    const provinciaSelect = document.getElementById('provincia-select');
    const magnitudSelect = document.getElementById('magnitud-select');
    const orderSelect = document.getElementById('order-select');
    const filterButton = document.getElementById('filter-button');

    if (filterButton) {
        filterButton.addEventListener('click', () => {
            const provincia = provinciaSelect.value;
            const magnitud = magnitudSelect.value;
            const order = orderSelect.value;

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
