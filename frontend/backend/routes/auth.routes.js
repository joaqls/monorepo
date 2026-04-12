const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

// POST /api/login
router.post('/login', async (req, res) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.status(400).json({ message: 'Datos incompletos' });
  }

  try {
    const user = await Usuario.findOne({ usuario, password });

    if (!user) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // Devolvemos el usuario completo (SIN password en un proyecto real)
    res.json({
      usuario: user.usuario,
      rol: user.rol,
      equipo: user.equipo || null
    });

  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

module.exports = router;