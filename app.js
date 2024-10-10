// Espera a que el documento HTML esté completamente cargado y parseado
document.addEventListener('DOMContentLoaded', () => {
    // Obtiene referencias al formulario y al cuerpo de la tabla
    const form = document.getElementById('dataForm');
    const tableBody = document.querySelector('#dataTable tbody');
    
    // Recupera los datos almacenados en localStorage o inicializa un array vacío
    let data = JSON.parse(localStorage.getItem('medicalData')) || [];
    
    // Variable para rastrear el índice de la entrada que se está editando
    let editingIndex = null;

    // Añade un evento de escucha para el envío del formulario
    form.addEventListener('submit', handleFormSubmit);

    // Maneja el evento de envío del formulario
    function handleFormSubmit(e) {
        e.preventDefault();
        // Si hay una entrada en edición, actualiza la entrada
        if (editingIndex !== null) {
            updateEntry(editingIndex);
        } else {
            // Si no, añade una nueva entrada
            addEntry();
        }
    }

    // Añade una nueva entrada a los datos
    async function addEntry() {
        const entry = await createEntry();
        data.push(entry);
        updateLocalStorage();
        renderTable();
        form.reset();
    }

    // Crea una nueva entrada con los datos del formulario y la geolocalización
    async function createEntry() {
        const name = document.getElementById('name').value;
        const role = document.getElementById('role').value;
        const dateTime = new Date().toLocaleString();
        const geolocation = await getGeolocation();
        return { name, role, dateTime, geolocation };
    }

    // Actualiza los datos en localStorage
    function updateLocalStorage() {
        localStorage.setItem('medicalData', JSON.stringify(data));
    }

    // Renderiza la tabla con los datos actuales
    function renderTable() {
        tableBody.innerHTML = '';
        data.forEach((entry, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entry.name}</td>
                <td>${entry.role}</td>
                <td>${entry.dateTime}</td>
                <td>${entry.geolocation}</td>
                <td class="actions">
                    <button class="edit" onclick="editEntry(${index})">Editar</button>
                    <button class="delete" onclick="deleteEntry(${index})">Eliminar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Permite editar una entrada existente
    window.editEntry = (index) => {
        const entry = data[index];
        document.getElementById('name').value = entry.name;
        document.getElementById('role').value = entry.role;
        editingIndex = index;
    };

    // Actualiza una entrada existente con los nuevos datos del formulario
    function updateEntry(index) {
        const entry = data[index];
        entry.name = document.getElementById('name').value;
        entry.role = document.getElementById('role').value;
        updateLocalStorage();
        renderTable();
        form.reset();
        editingIndex = null;
    }

    // Elimina una entrada del array de datos
    window.deleteEntry = (index) => {
        data.splice(index, 1);
        updateLocalStorage();
        renderTable();
    };

    // Obtiene la geolocalización del usuario
    async function getGeolocation() {
        return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    resolve(`Lat: ${latitude}, Lon: ${longitude}`);
                },
                () => {
                    resolve('Geolocalización no disponible');
                }
            );
        });
    }

    // Renderiza la tabla al cargar la página
    renderTable();
});