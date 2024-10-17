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