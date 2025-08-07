// Función para cargar los circuitos disponibles en el desplegable
function loadCircuitNames() {
    fetch('datos/circuitos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar los circuitos');
            }
            return response.json();
        })
        .then(data => {
            const circuitSelect = document.getElementById('circuit-select');
            data.circuitos.forEach(circuit => {
                const option = document.createElement('option');
                option.value = circuit.nombre; // Nombre del archivo
                option.textContent = circuit.descripcion; // Descripción que se mostrará
                circuitSelect.appendChild(option);
            });

            // Cargar el primer circuito por defecto
            if (data.circuitos.length > 0) {
                circuitSelect.value = data.circuitos[0].nombre; // Selecciona el primer circuito
                updateCircuit(data.circuitos[0].nombre); // Carga el primer circuito
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Función para actualizar el circuito seleccionado
function updateCircuit(circuitName) {
    // Cargar imagen del circuito
    const img = document.getElementById('circuit-img');
    img.src = `datos/${circuitName}.png`;
    img.style.display = 'block'; // Muestra la imagen

    // Verificar si el archivo .sim1 existe
    const sim1Link = document.getElementById('sim1-link');
    const sim1FilePath = `datos/${circuitName}.sim1`;

    fetch(sim1FilePath, { method: 'HEAD' })
        .then(response => {
            if (response.ok) {
                sim1Link.href = sim1FilePath;
                sim1Link.textContent = `Descargar ${circuitName}.sim1`;
                sim1Link.style.display = 'inline'; // Muestra el enlace
            } else {
                sim1Link.style.display = 'none'; // Oculta el enlace si no existe
            }
        })
        .catch(error => {
            console.error('Error al verificar el archivo .sim1:', error);
            sim1Link.style.display = 'none'; // Oculta el enlace en caso de error
        });

    // Cargar conexiones
    fetch(`datos/${circuitName}.txt`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el archivo de conexiones');
            }
            return response.text();
        })
        .then(data => {
            const connectionsList = document.getElementById('connections-list');
            connectionsList.innerHTML = ''; // Limpia la lista anterior
            const connections = data.split('\n');

            connections.forEach(connection => {
                if (connection.trim()) {
                    const li = document.createElement('li');
                    li.innerHTML = `<a href="#">${connection.trim()}</a>`;
                    connectionsList.appendChild(li);
                }
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });

    // Cargar explicación
    fetch(`datos/${circuitName}.md`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el archivo de explicación');
            }
            return response.text();
        })
        .then(data => {
            const explanationDiv = document.getElementById('explanation');
            explanationDiv.innerHTML = marked(data); // Usa la librería Marked para convertir Markdown a HTML
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Cargar los circuitos al iniciar
loadCircuitNames();

// Actualizar el circuito cuando se cambia la selección
document.getElementById('circuit-select').addEventListener('change', function() {
    const circuitName = this.value;
    updateCircuit(circuitName);
});
