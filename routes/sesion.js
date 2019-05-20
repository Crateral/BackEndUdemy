// Requires
var express = require('express');
var Sesion = require('../models/Sesion');

var mdAutenticacion = require('../middlewares/autenticacion');

// Inicializar variables
var app = express();

//Obtener todos las sesiones
app.get('/', (req, res, next) => {

    Sesion.find((err, sesiones) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando planes de la BD',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            sesiones: sesiones,

        });

    });

});

//Actualizar sesion
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Sesion.findById(id).exec(
        (err, sesion) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar sesion',
                    errors: err
                });
            }

            if (!sesion) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La sesion con el ID: ' + id + ' no existe.',
                    errors: { message: 'No existe seson con el ID: ' + id }
                });
            }

            if (req.usuario.role == 'USER_ROLE') {
                sesion.tiempo = body.tiempo;
                sesion.repeticiones = body.repeticiones;
                sesion.comentarios = body.comentarios;
            } else {
                sesion.numero_semana = body.numero_semana;
                sesion.wod = body.wod;
                sesion.plan = body.plan;
            }

            sesion.save((err, sesionGuardada) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar sesion',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    sesion: sesionGuardada,
                });

            });

        });
});

//Crear sesion
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var sesion = new Sesion({
        numero_semana: body.numero_semana,
        wod: body.wod,
        plan: body.id_plan
    });

    sesion.save((err, sesionGuardada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el sesion',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            sesion: sesionGuardada,
        });

    });

});


module.exports = app;