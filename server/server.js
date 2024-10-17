const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = 3000;

// Importar y usar el middleware
require('./middleware')(app);

// Conectar a MongoDB
mongoose.connect('mongodb+srv://Victor:n9FzlbRqDpHztCPd@cluster0.yjp85.mongodb.net/', {
    
});

const entrySchema = new mongoose.Schema({
    name: String,
    role: String,
    dateTime: String,
    geolocation: String
});

const Entry = mongoose.model('Entry', entrySchema);

// Ruta raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Rutas
app.get('/entries', async (req, res) => {
    const entries = await Entry.find();
    res.json(entries);
});

app.post('/entries', async (req, res) => {
    const newEntry = new Entry(req.body);
    await newEntry.save();
    res.json(newEntry);
});

app.put('/entries/:id', async (req, res) => {
    const updatedEntry = await Entry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedEntry);
});

app.delete('/entries/:id', async (req, res) => {
    await Entry.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});