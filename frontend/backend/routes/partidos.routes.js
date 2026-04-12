const express = require('express');
const router = express.Router();
const Partido = require('../models/Partido');

/* ============================
   FASE 6.1 — ADMIN
   Crear y listar partidos
   ============================ */

// Crear partido (ADMIN)
router.post('/', async (req, res) => {
  try {
    const partido = new Partido(req.body);
    await partido.save();
    res.status(201).json(partido);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear partido' });
  }
});

// Listar todos los partidos
router.get('/', async (req, res) => {
  try {
    const partidos = await Partido.find().sort({ fecha: 1 });
    res.json(partidos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener partidos' });
  }
});

/* ============================
   FASE 6.2 — VISUALIZACIÓN POR ROL
   Árbitros y usuarios
   ============================ */

// Partidos por árbitro
router.get('/arbitro/:arbitro', async (req, res) => {
  try {
    const partidos = await Partido.find({ arbitro: req.params.arbitro });
    res.json(partidos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener partidos del árbitro' });
  }
});

// Partidos por equipo
router.get('/equipo/:equipo', async (req, res) => {
  try {
    const partidos = await Partido.find({
      $or: [
        { equipoLocal: req.params.equipo },
        { equipoVisitante: req.params.equipo }
      ]
    });
    res.json(partidos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener partidos del equipo' });
  }
});

/* ============================
   FASE 6.3 — CAPITANES
   Introducción y validación de resultados
   ============================ */

// Capitán introduce resultado
router.put('/resultado/:id', async (req, res) => {
  try {
    const { rol, resultado } = req.body;
    const partido = await Partido.findById(req.params.id);

    if (!partido) {
      return res.status(404).json({ message: 'Partido no encontrado' });
    }

    // ✅ CONTROL DE FECHA (CLAVE DEL ENUNCIADO)
    const hoy = new Date();
    if (partido.fecha > hoy) {
      return res.status(400).json({
        message: 'No se puede introducir el resultado antes de la fecha del partido'
      });
    }

    if (rol === 'capitanLocal') {
      partido.resultadoCapitanLocal = resultado;
    }

    if (rol === 'capitanVisitante') {
      partido.resultadoCapitanVisitante = resultado;
    }

    // Si ambos capitanes han introducido resultado
    if (
      partido.resultadoCapitanLocal &&
      partido.resultadoCapitanVisitante
    ) {
      if (
        partido.resultadoCapitanLocal === partido.resultadoCapitanVisitante
      ) {
        const [local, visitante] =
          partido.resultadoCapitanLocal.split('-');

        partido.resultadoLocal = Number(local);
        partido.resultadoVisitante = Number(visitante);
        partido.estado = 'confirmado';
      } else {
        partido.estado = 'revision_admin';
      }
    }

    await partido.save();
    res.json(partido);

  } catch (error) {
    res.status(500).json({ message: 'Error al introducir resultado' });
  }
});

/* ============================
   FASE 6.4 — ADMIN
   Revisión de conflictos
   ============================ */

// Listar partidos pendientes de revisión
router.get('/revision', async (req, res) => {
  try {
    const partidos = await Partido.find({ estado: 'revision_admin' });
    res.json(partidos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener partidos en revisión' });
  }
});

// Admin confirma resultado definitivo
router.put('/confirmar/:id', async (req, res) => {
  try {
    const { resultadoLocal, resultadoVisitante } = req.body;

    const partido = await Partido.findById(req.params.id);
    if (!partido) {
      return res.status(404).json({ message: 'Partido no encontrado' });
    }

    partido.resultadoLocal = Number(resultadoLocal);
    partido.resultadoVisitante = Number(resultadoVisitante);
    partido.estado = 'confirmado';

    await partido.save();
    res.json(partido);

  } catch (error) {
    res.status(500).json({ message: 'Error al confirmar partido' });
  }
});

module.exports = router;