var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var planSchema = new Schema({

    fecha_ini: { type: String, required: [true, 'El nombre es necesario'] },
    fecha_fin: { type: String, required: [true, 'El correo es necesario'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: [true, 'El usuario es necesario'] },

}, { collection: 'planes' });

module.exports = mongoose.model('Plan', planSchema);