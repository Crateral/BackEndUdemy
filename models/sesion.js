var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var planSchema = new Schema({

    numero_semana: { type: String, required: [true, 'El numerodelasemana es necesario'] },
    wod: { type: String, required: [true, 'El WOD es necesario'] },
    tiempo: { type: String, required: false },
    repeticiones: { type: String, required: false },
    comentarios: { type: String, required: false },
    plan: { type: Schema.Types.ObjectId, ref: 'Planes' },

}, { collection: 'sesiones' });

module.exports = mongoose.model('Sesion', planSchema);