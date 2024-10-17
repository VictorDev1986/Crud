const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const path = require('path');

module.exports = (app) => {
    // Middleware para parsear JSON
    app.use(bodyParser.json());

    // Middleware para habilitar CORS
    app.use(cors());

    // Middleware para servir archivos estáticos
    app.use(express.static(path.join(__dirname, '../public')));
};