// Espera a que el contenido del documento esté completamente cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', () => {
    // Obtiene referencias al formulario y al cuerpo de la tabla
    const form = document.getElementById('dataForm');
    const tableBody = document.querySelector('#dataTable tbody');
    let editingIndex = null; // Índice del elemento que se está editando
    let data = []; // Array para almacenar los datos

    // Añade un evento de escucha para el envío del formulario
    form.addEventListener('submit', handleFormSubmit);

    // Maneja el envío del formulario
    async function handleFormSubmit(e) {
        e.preventDefault(); // Previene el comportamiento por defecto del formulario
        if (editingIndex !== null) {
            await updateEntry(editingIndex); // Actualiza la entrada si se está editando
        } else {
            await addEntry(); // Añade una nueva entrada si no se está editando
        }
    }

    // Añade una nueva entrada
    async function addEntry() {
        const entry = await createEntry(); // Crea una nueva entrada
        const response = await fetch('http://localhost:3000/entries', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entry) // Envía la entrada como JSON
        });
        const newEntry = await response.json(); // Obtiene la respuesta del servidor
        data.push(newEntry); // Añade la nueva entrada al array de datos
        renderTable(); // Renderiza la tabla con los nuevos datos
        form.reset(); // Resetea el formulario
    }

    // Crea una nueva entrada con los datos del formulario y la geolocalización
    async function createEntry() {
        const name = document.getElementById('name').value;
        const role = document.getElementById('role').value;
        const dateTime = new Date().toLocaleString();
        const geolocation = await getGeolocation();
        return { name, role, dateTime, geolocation };
    }

    // Actualiza una entrada existente
    async function updateEntry(index) {
        const entry = data[index];
        entry.name = document.getElementById('name').value;
        entry.role = document.getElementById('role').value;
        const response = await fetch(`http://localhost:3000/entries/${entry._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entry) // Envía la entrada actualizada como JSON
        });
        const updatedEntry = await response.json(); // Obtiene la respuesta del servidor
        data[index] = updatedEntry; // Actualiza la entrada en el array de datos
        renderTable(); // Renderiza la tabla con los datos actualizados
        form.reset(); // Resetea el formulario
        editingIndex = null; // Resetea el índice de edición
    }

    // Elimina una entrada
    async function deleteEntry(index) {
        const entry = data[index];
        await fetch(`http://localhost:3000/entries/${entry._id}`, {
            method: 'DELETE'
        });
        data.splice(index, 1); // Elimina la entrada del array de datos
        renderTable(); // Renderiza la tabla con los datos actualizados
    }

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

    // Obtiene las entradas del servidor
    async function fetchEntries() {
        const response = await fetch('http://localhost:3000/entries');
        data = await response.json(); // Almacena las entradas en el array de datos
        renderTable(); // Renderiza la tabla con los datos obtenidos
    }

    // Renderiza la tabla con los datos
    function renderTable() {
        tableBody.innerHTML = ''; // Limpia el cuerpo de la tabla
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
            tableBody.appendChild(row); // Añade la fila a la tabla
        });
    }

    // Función global para editar una entrada
    window.editEntry = (index) => {
        const entry = data[index];
        document.getElementById('name').value = entry.name;
        document.getElementById('role').value = entry.role;
        editingIndex = index; // Establece el índice de edición
    };

    // Función global para eliminar una entrada
    window.deleteEntry = deleteEntry;

    // Obtiene las entradas al cargar la página
    fetchEntries();
});