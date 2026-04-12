const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

// POST /api/usuarios
router.post('/', async (req, res) => {
  const { usuario, password, rol, equipo } = req.body;

  if (!usuario || !password || !rol) {
    return res.status(400).json({ message: 'Datos incompletos' });
  }

  // Validación de equipo según rol
  if ((rol === 'usuario' || rol === 'capitan') && !equipo) {
    return res.status(400).json({ message: 'El rol requiere equipo' });
  }

  try {
    const nuevoUsuario = new Usuario({
      usuario,
      password,
      rol,
      equipo: equipo || null
    });

    await nuevoUsuario.save();
    res.status(201).json(nuevoUsuario);

  } catch (error) {
    res.status(500).json({ message: 'Error al crear usuario' });
  }
});

module.exports = router;