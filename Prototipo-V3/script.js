// Datos JSON proporcionados
const data = [
    { Data_Referencia: "2024-01-01", COGNOM: "GARCIA", Valor: "31505", ORDRE_COGNOM: 2 },
    { Data_Referencia: "2024-01-01", COGNOM: "GARCIA", Valor: "30727", ORDRE_COGNOM: 1 },
    // ... (resto de los datos)
];

// Función para mostrar los datos en la tabla
function displayData(dataToDisplay: any[]) {
    const tableBody = document.getElementById("table-body");
    if (tableBody) {
        tableBody.innerHTML = ""; // Limpiar la tabla antes de agregar nuevos datos

        dataToDisplay.forEach(item => {
            const row = document.createElement("tr");

            const cellCognom = document.createElement("td");
            cellCognom.textContent = item.COGNOM;
            row.appendChild(cellCognom);

            const cellValor = document.createElement("td");
            cellValor.textContent = item.Valor;
            row.appendChild(cellValor);

            const cellOrdre = document.createElement("td");
            cellOrdre.textContent = item.ORDRE_COGNOM;
            row.appendChild(cellOrdre);

            tableBody.appendChild(row);
        });
    }
}

// Función para filtrar los datos por apellido
function filterData() {
    const filterInput = document.getElementById("filter") as HTMLInputElement;
    const filterValue = filterInput.value.toUpperCase();

    const filteredData = data.filter(item => item.COGNOM.toUpperCase().includes(filterValue));
    displayData(filteredData);
}

// Función para ordenar los datos por valor (de mayor a menor)
function sortDataByValue() {
    const sortedData = data.slice().sort((a, b) => parseInt(b.Valor) - parseInt(a.Valor));
    displayData(sortedData);
}

// Función para obtener el total de valores usando reduce
function getTotalValue() {
    const total = data.reduce((acc, item) => acc + parseInt(item.Valor), 0);
    alert(`El valor total de todos los apellidos es: ${total}`);
}

// Función para mapear los datos y obtener solo los apellidos
function getCognoms() {
    const cognoms = data.map(item => item.COGNOM);
    alert(`Apellidos únicos: ${[...new Set(cognoms)].join(", ")}`);
}

// Función adicional: Obtener el apellido más común
function getMostCommonCognom() {
    const cognomCounts = data.reduce((acc, item) => {
        acc[item.COGNOM] = (acc[item.COGNOM] || 0) + 1;
        return acc;
    }, {} as { [key: string]: number });

    const mostCommon = Object.keys(cognomCounts).reduce((a, b) => cognom