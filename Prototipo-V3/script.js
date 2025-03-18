document.addEventListener('DOMContentLoaded', function() {
    const provinciaSelect = document.getElementById('provincia-select');
    const municipioSelect = document.getElementById('municipio-select');
    const magnitudSelect = document.getElementById('magnitud-select');
    const orderSelect = document.getElementById('order-select');
    const filterButton = document.getElementById('filter-button');
    const dataContainer = document.getElementById('data-container');
    const meanContainer = document.getElementById('mean-container');

    // Datos de ejemplo (puedes cargarlos desde un archivo JSON)
    const data = [
        {
            "punto_muestreo": "28102001_1_38",
            "h10": "4",
            "h12": "4",
            "h11": "4",
            "h14": "4",
            "h13": "4",
            "h16": "",
            "h15": "",
            "h18": "",
            "h17": "",
            "h19": "",
            "v10": "T",
            "v12": "T",
            "v11": "T",
            "v14": "T",
            "v13": "T",
            "v16": "N",
            "v15": "N",
            "v18": "N",
            "v17": "N",
            "v19": "N",
            "municipio": "102",
            "h21": "",
            "h20": "",
            "h23": "",
            "h22": "",
            "h24": "",
            "v21": "N",
            "v20": "N",
            "v23": "N",
            "v22": "N",
            "v24": "N",
            "provincia": "28",
            "estacion": "1",
            "mes": 3,
            "ano": 2025,
            "h01": "4",
            "magnitud": "1",
            "h03": "4",
            "h02": "4",
            "h05": "4",
            "h04": "4",
            "h07": "4",
            "h06": "4",
            "h09": "4",
            "h08": "4",
            "v01": "T",
            "v03": "T",
            "v02": "T",
            "v05": "T",
            "v04": "T",
            "v07": "T",
            "dia": 17,
            "v06": "T",
            "v09": "T",
            "v08": "T"
        }
    ];

    // Mapeo de códigos de municipio a nombres (ejemplo)
    const municipiosMap = {
        "102": "Madrid Centro",
        // Agrega más mapeos según sea necesario
    };

    // Cargar municipios basados en la provincia seleccionada
    provinciaSelect.addEventListener('change', function() {
        const provincia = provinciaSelect.value;
        const municipios = [...new Set(data.filter(item => item.provincia === provincia).map(item => item.municipio))];
        municipioSelect.innerHTML = municipios.map(municipio => `
            <option value="${municipio}">${municipiosMap[municipio] || municipio}</option>
        `).join('');
    });

    // Filtrar y mostrar datos
    filterButton.addEventListener('click', function() {
        const provincia = provinciaSelect.value;
        const municipio = municipioSelect.value;
        const magnitud = magnitudSelect.value;
        const order = orderSelect.value;

        const filteredData = data.filter(item => item.provincia === provincia && item.municipio === municipio);
        const sortedData = filteredData.sort((a, b) => {
            const valueA = parseFloat(a[magnitud]) || 0;
            const valueB = parseFloat(b[magnitud]) || 0;
            return order === 'asc' ? valueA - valueB : valueB - valueA;
        });

        // Mostrar los datos filtrados
        dataContainer.innerHTML = sortedData.map(item => `
            <div class="data-item">
                <p>Municipio: ${municipiosMap[item.municipio] || item.municipio}</p>
                <p>Estación: ${item.estacion}</p>
                <p>${magnitud}: ${item[magnitud] || "N/A"}</p>
            </div>
        `).join('');

        // Calcular y mostrar la media
        const validValues = sortedData.map(item => parseFloat(item[magnitud])).filter(value => !isNaN(value));
        const mean = validValues.length > 0 ? validValues.reduce((sum, value) => sum + value, 0) / validValues.length : 0;
        meanContainer.innerHTML = `<p>Media de ${magnitud}: ${mean.toFixed(2)}</p>`;
    });

    // Cargar municipios al inicio
    provinciaSelect.dispatchEvent(new Event('change'));
});
