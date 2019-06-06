// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Inicializar variables
var app = express();

// BodyParser
app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())


// Importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var planRoutes = require('./routes/plan');
var sesionRoutes = require('./routes/sesion');
var busquedaRoutes = require('./routes/busqueda');

// Conexion BD
mongoose.connection.openUri('mongodb://localhost:27017/InvincibleBD', (err, res) => {
    if (err) {
        throw err;
    }

    console.log('Bade de datos: \x1b[32m%s\x1b[0m', 'online');
});

// Rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/plan', planRoutes);
app.use('/sesion', sesionRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/', appRoutes);


// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});