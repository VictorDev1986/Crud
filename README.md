

# Crud Centro Medico

El sistema permite al personal administrativo del centro médico registrar, editar, consultar y eliminar la información de los médicos. Los datos incluyen el nombre del médico, el cargo (como "Pediatra", "Cardiólogo", etc.) y la ubicación geográfica de su área de trabajo (por ejemplo, el hospital o clínica donde trabaja y coordenadas).

Alojada: [Crud](https://victordev1986.github.io/Crud/)

## Demo
![Crud App](https://github.com/user-attachments/assets/e6a4f189-7d7c-40af-bf20-30d2b04928f1)


## Guía de inicio rápido

## Prerequisitos

- Node.js (version 14 or later)
- npm (version 6 or later) or yarn (version 1.22 or later)

## Instalacion

1. **Clonar el repositorio:**

```sh
git clone https://github.com/VictorDev1986/Crud.git
cd Crud
```

1. **Instalacionn de dependencias::**

Instalar npm:

```sh
npm install
```
**Express:**
Es el framework que usaremos para manejar las rutas y las solicitudes HTTP.

```sh
npm install express
```
**Mongoose:**
El ODM que conecta Node.js con MongoDB,.

```sh
npm install mongoose
```

2. **Ejecución del servidor de desarrollo::**

Inicie el servidor de desarrollo para ejecutar la aplicación localmente:

Usando npm:

```sh
npm run dev
```

Abra su navegador y navegue a <http://localhost:3000/> para ver la aplicación.

3**Conexion a base de datos::**
**Crear la Base de Datos en MongoDB**
Si usas MongoDB Atlas (base de datos en la nube):

Crea una cuenta en MongoDB Atlas y sigue el asistente para crear un clúster.
En el clúster, crea una base de datos con el nombre que prefieras (por ejemplo, centro_medico).
Obtén la cadena de conexión (MongoDB URI) desde la sección de conexión del clúster y personalízala con tu usuario, contraseña y base de datos.
Si usas MongoDB Local (en tu computadora):

Asegúrate de tener MongoDB instalado y ejecutándose en tu máquina.
La cadena de conexión local suele ser mongodb://localhost:3000/centro_medico, donde centro_medico es el nombre de la base de datos.

**Estructura del proyecto::**

```sh
Crud/
│
├── README.md
├── package.json
├── package-lock.json
├── node_modules/
│
├── public/
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   └── images/
│
├── server/
│   ├── server.js
│   └── middleware/
└── config/
```

### Caracteristicas principales

**Estructura del código**

El código se divide en varias secciones:

**Inicialización:** El código se ejecuta cuando el documento está completamente cargado, gracias al evento DOMContentLoaded.
Variables y funciones: Se definen variables y funciones para manejar los datos, la tabla y las interacciones con el servidor.
Eventos: Se establecen eventos para manejar el envío del formulario, la edición y eliminación de entradas.
Funciones de renderizado: Se definen funciones para renderizar la tabla con los datos obtenidos del servidor.
Funciones clave

**handleFormSubmit:** Maneja el envío del formulario, actualizando o creando una nueva entrada según sea necesario.
**addEntry:** Crea una nueva entrada y la envía al servidor para almacenarla.
**updateEntry:** Actualiza una entrada existente y la envía al servidor para actualizarla.
**deleteEntry:** Elimina una entrada y la elimina del servidor.
**getGeolocation:** Obtiene la geolocalización del usuario utilizando la API de geolocalización del navegador.
**fetchEntries:** Obtiene las entradas del servidor y las almacena en el array de datos.
**renderTable:** Renderiza la tabla con los datos obtenidos del servidor.
Interacciones con el servidor

El código se comunica con un servidor para almacenar y recuperar los datos. Las interacciones con el servidor se realizan mediante las siguientes funciones:

**fetch:** Se utiliza para enviar solicitudes al servidor y obtener respuestas.
**JSON.stringify:** Se utiliza para convertir los datos en formato JSON para enviarlos al servidor.
**JSON.parse:** Se utiliza para convertir las respuestas del servidor en formato JSON a objetos JavaScript.
Seguridad

El código no incluye medidas de seguridad específicas, como la autenticación o la autorización. Es importante agregar estas medidas para proteger la aplicación y los datos de los usuarios.

Mejoras


### Java Script 

```

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
```

### Express

```Java Script
// Importa los módulos necesarios
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express(); // Crea una instancia de Express
const port = 3000; // Define el puerto en el que el servidor escuchará

// Importa y usa el middleware
require('./middleware')(app);

// Conecta a MongoDB usando Mongoose
mongoose.connect('mongodb+srv://Victor:n9FzlbRqDpHztCPd@cluster0.yjp85.mongodb.net/', {
    // Opciones de conexión pueden ser añadidas aquí
});

// Define el esquema de la entrada
const entrySchema = new mongoose.Schema({
    name: String,
    role: String,
    dateTime: String,
    geolocation: String
});

// Crea un modelo basado en el esquema
const Entry = mongoose.model('Entry', entrySchema);

// Define la ruta raíz que sirve el archivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Define la ruta para obtener todas las entradas
app.get('/entries', async (req, res) => {
    const entries = await Entry.find(); // Obtiene todas las entradas de la base de datos
    res.json(entries); // Envía las entradas como respuesta en formato JSON
});

// Define la ruta para crear una nueva entrada
app.post('/entries', async (req, res) => {
    const newEntry = new Entry(req.body); // Crea una nueva entrada con los datos del cuerpo de la solicitud
    await newEntry.save(); // Guarda la nueva entrada en la base de datos
    res.json(newEntry); // Envía la nueva entrada como respuesta en formato JSON
});

// Define la ruta para actualizar una entrada existente
app.put('/entries/:id', async (req, res) => {
    const updatedEntry = await Entry.findByIdAndUpdate(req.params.id, req.body, { new: true }); // Actualiza la entrada con el ID especificado
    res.json(updatedEntry); // Envía la entrada actualizada como respuesta en formato JSON
});

// Define la ruta para eliminar una entrada existente
app.delete('/entries/:id', async (req, res) => {
    await Entry.findByIdAndDelete(req.params.id); // Elimina la entrada con el ID especificado
    res.sendStatus(204); // Envía un estado 204 (Sin contenido) como respuesta
});

// Inicia el servidor y escucha en el puerto especificado
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
```.

### Mejoras a  futuro


Agregar validación de datos para asegurarse de que los usuarios ingresen datos válidos.
Agregar mensajes de error para informar a los usuarios de cualquier problema que surja.
Mejorar la experiencia del usuario mediante la adición de animaciones o efectos visuales.
Agregar funcionalidad para permitir a los usuarios filtrar o ordenar las entradas en la tabla



