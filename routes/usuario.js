// Requires
var express = require('express');
var Usuario = require('../models/usuario');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');

// Inicializar variables
var app = express();


//Obtener todos los usuarios
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({}, 'nombre email img role')
        .skip(desde)
        .limit(5)
        .exec(
            (err, usuarios) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuarios de la BD',
                        errors: err
                    });
                }

                Usuario.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        usuarios: usuarios,
                        total: conteo
                    });
                });

            });

});

//Actualizar usuarios
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, 'nombre email img role').exec(
        (err, usuario) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar usuario',
                    errors: err
                });
            }

            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El usuario con el ID: ' + id + ' no existe.',
                    errors: { message: 'No existe usuario con el ID: ' + id }
                });
            }

            usuario.nombre = body.nombre;
            usuario.email = body.email;
            usuario.role = body.role;

            usuario.save((err, usuarioGuardado) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar usuario',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    usuario: usuarioGuardado,
                });

            });

        });
});

//Crear usuarios
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
        });

    });

});

//Borrar usuario por id
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al borrar el usuario con ID: ' + id,
                errors: err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe el usuario con ID: ' + id,
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioBorrado,
        });
    })

});

module.exports = app;