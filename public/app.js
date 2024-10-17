document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('dataForm');
    const tableBody = document.querySelector('#dataTable tbody');
    let editingIndex = null;
    let data = [];

    form.addEventListener('submit', handleFormSubmit);

    async function handleFormSubmit(e) {
        e.preventDefault();
        if (editingIndex !== null) {
            await updateEntry(editingIndex);
        } else {
            await addEntry();
        }
    }

    async function addEntry() {
        const entry = await createEntry();
        const response = await fetch('http://localhost:3000/entries', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entry)
        });
        const newEntry = await response.json();
        data.push(newEntry);
        renderTable();
        form.reset();
    }

    async function createEntry() {
        const name = document.getElementById('name').value;
        const role = document.getElementById('role').value;
        const dateTime = new Date().toLocaleString();
        const geolocation = await getGeolocation();
        return { name, role, dateTime, geolocation };
    }

    async function updateEntry(index) {
        const entry = data[index];
        entry.name = document.getElementById('name').value;
        entry.role = document.getElementById('role').value;
        const response = await fetch(`http://localhost:3000/entries/${entry._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entry)
        });
        const updatedEntry = await response.json();
        data[index] = updatedEntry;
        renderTable();
        form.reset();
        editingIndex = null;
    }

    async function deleteEntry(index) {
        const entry = data[index];
        await fetch(`http://localhost:3000/entries/${entry._id}`, {
            method: 'DELETE'
        });
        data.splice(index, 1);
        renderTable();
    }

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

    async function fetchEntries() {
        const response = await fetch('http://localhost:3000/entries');
        data = await response.json();
        renderTable();
    }

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

    window.editEntry = (index) => {
        const entry = data[index];
        document.getElementById('name').value = entry.name;
        document.getElementById('role').value = entry.role;
        editingIndex = index;
    };

    window.deleteEntry = deleteEntry;

    fetchEntries();
});