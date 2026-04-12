const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  usuario: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  rol: {
    type: String,
    enum: ['admin', 'usuario', 'capitan', 'arbitro'],
    required: true
  },

  // SOLO para usuario y capitán
  equipo: {
    type: String,
    default: null
  }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);