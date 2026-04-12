const mongoose = require('mongoose');

const PartidoSchema = new mongoose.Schema({
  equipoLocal: {
    type: String,
    required: true
  },
  equipoVisitante: {
    type: String,
    required: true
  },
  deporte: {
    type: String,
    required: true
  },
  fecha: {
    type: Date,
    required: true
  },
  arbitro: {
    type: String,
    required: true
  },
  ubicacion: {
    type: String,
    required: true
  },

  // Resultado final confirmado
  resultadoLocal: {
    type: Number,
    default: null
  },
  resultadoVisitante: {
    type: Number,
    default: null
  },

  // Resultados introducidos por los capitanes
  resultadoCapitanLocal: {
    type: String,
    default: null
  },
  resultadoCapitanVisitante: {
    type: String,
    default: null
  },

  estado: {
    type: String,
    enum: ['pendiente', 'confirmado', 'revision_admin'],
    default: 'pendiente'
  }

}, {
  timestamps: true
});

module.exports = mongoose.model('Partido', PartidoSchema);