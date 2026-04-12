const express = require('express');
const cors = require('cors');
const conectarDB = require('./config/db');

const authRoutes = require('./routes/auth.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const partidosRoutes = require('./routes/partidos.routes');

const app = express();

// Conectar a MongoDB
conectarDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas API
app.use('/api', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/partidos', partidosRoutes);

// Ruta de comprobación API
app.get('/api', (req, res) => {
  res.send('API Liga Deportiva funcionando');
});

// Ruta raíz
app.get('/', (req, res) => {
  res.send('Servidor backend activo');
});

// Arrancar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en puerto ${PORT}`);
});
