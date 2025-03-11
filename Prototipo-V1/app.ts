// Función para cargar los datos JSON
async function loadJSON(file: string): Promise<any> {
    const response = await fetch(file);
    return response.json();
}

// Función para mostrar los datos en la página
function displayData(data: any[], container: HTMLElement) {
    container.innerHTML = ''; // Limpiar el contenedor
    data.forEach(item => {
        const div = document.createElement('div');
        div.className = 'data-item';
        div.textContent = JSON.stringify(item, null, 2);
        container.appendChild(div);
    });
}

// Función principal
async function main() {
    const dataSelect = document.getElementById('data-select') as HTMLSelectElement;
    const loadButton = document.getElementById('load-data') as HTMLButtonElement;
    const dataDisplay = document.getElementById('data-display') as HTMLDivElement;

    loadButton.addEventListener('click', async () => {
        const selectedData = dataSelect.value;
        const data = await loadJSON(`${selectedData}.json`);

        // Aplicar funciones de procesamiento
        const processedData = processData(data);

        // Mostrar los datos procesados
        displayData(processedData, dataDisplay);
    });
}

// Función para procesar los datos
function processData(data: any[]): any[] {
    // 1. Filtrar: Seleccionar solo los elementos que cumplen una condición
    const filteredData = data.filter((item: any) => item.active);

    // 2. Mapear: Transformar los datos
    const mappedData = filteredData.map((item: any) => ({
        ...item,
        fullName: `${item.firstName} ${item.lastName}`
    }));

    // 3. Ordenar: Ordenar los datos por un campo específico
    const sortedData = mappedData.sort((a: any, b: any) => a.age - b.age);

    // 4. Reducir: Calcular la suma de las edades
    const totalAge = sortedData.reduce((acc: number, item: any) => acc + item.age, 0);

    // 5. Slice: Seleccionar solo los primeros 10 elementos
    const slicedData = sortedData.slice(0, 10);

    // 6. Función extra: Agregar un campo calculado
    const finalData = slicedData.map((item: any) => ({
        ...item,
        isAdult: item.age >= 18
    }));

    console.log(`Total de edades: ${totalAge}`);
    return finalData;
}

// Ejecutar la función principal
main();
