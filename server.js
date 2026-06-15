require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose'); // Importar Mongoose

const { MercadoPagoConfig, Preference } = require('mercadopago');
const cors = require('cors'); // Para permitir peticiones desde el frontend

const app = express();
// En la nube, el puerto lo asigna el servicio mediante process.env.PORT
const PORT = process.env.PORT || process.env.SERVER_PORT || 3001; 

// Configurar Mercado Pago
if (!process.env.MP_ACCESS_TOKEN) {
  console.error("ERROR: MP_ACCESS_TOKEN no está definido en el archivo .env");
} else if (!process.env.MP_ACCESS_TOKEN.startsWith('TEST-') && !process.env.MP_ACCESS_TOKEN.startsWith('APP_USR-')) {
  console.warn("ADVERTENCIA: El MP_ACCESS_TOKEN en el .env no parece ser un token válido de Mercado Pago. Asegúrate de usar uno que empiece con 'TEST-' para pruebas locales.");
}

// Configuración del cliente con el token del .env
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PATCH', 'DELETE']
})); 
app.use(express.json()); // Para parsear el body de las peticiones JSON

// Seguridad para el panel admin
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

const authAdmin = (req, res, next) => {
  const password = req.headers['x-admin-password'];
  if (password === ADMIN_PASSWORD) {
    next();
  } else {
    res.status(401).json({ success: false, message: "No autorizado" });
  }
};

// Conexión a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado exitosamente a MongoDB');
  } catch (err) {
    console.error('❌ Error crítico de conexión a MongoDB:', err.message);
    process.exit(1); // Cerramos el proceso si no hay base de datos
  }
};

connectDB();

mongoose.connection.on('error', err => {
  console.error('⚠️ Error en la conexión de MongoDB después del inicio:', err);
});

// Esquema para Pedidos
const pedidoSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  fecha: { type: Date, default: Date.now },
  cliente: Object,
  items: Array,
  total: Number,
  estado: { type: String, default: 'pendiente' }
});
const Pedido = mongoose.model('Pedido', pedidoSchema);

// Esquema para Comentarios
const comentarioSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true },
  nombre: String,
  texto: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  fecha: { type: Date, default: Date.now }
});
const Comentario = mongoose.model('Comentario', comentarioSchema);


// Ruta de prueba para verificar salud del servidor
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Servidor de 1012Sabores funcionando en el puerto ' + PORT 
  });
});

// Ruta para registrar pedidos (Efectivo, Transferencia o MP) y persistirlos
app.post('/create_order', async (req, res) => {
  try {
    const { formData, cartItems, total } = req.body;

    const nuevoPedido = new Pedido({
      id: `ORD-${Date.now()}`,
      fecha: new Date(),
      cliente: formData,
      items: cartItems,
      total: total,
      estado: 'pendiente'
    });

    await nuevoPedido.save();
    console.log("📝 Pedido registrado en el sistema y guardado:", nuevoPedido.id);
    res.status(201).json({ success: true, orderId: nuevoPedido.id, pedido: nuevoPedido });
  } catch (error) {
    console.error("❌ Error al procesar el pedido:", error);
    res.status(500).json({ success: false, message: "Error al guardar el pedido en la base de datos" });
  }
});

// Ruta para obtener comentarios
app.get('/comments', async (req, res) => {
  try {
    const comentarios = await Comentario.find().sort({ fecha: -1 });
    res.status(200).json(comentarios);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al obtener opiniones" });
  }
});

// Ruta para eliminar un comentario (Solo Admin)
app.delete('/admin/comments/:id', authAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await Comentario.deleteOne({ id: parseInt(id) });

    if (resultado.deletedCount > 0) {
      res.json({ success: true, message: "Comentario eliminado de la base de datos" });
    } else {
      res.status(404).json({ success: false, message: "Opinión no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al eliminar" });
  }
});

// Ruta para registrar un comentario nuevo
app.post('/create_comment', async (req, res) => {
  try {
    const { nombre, texto, rating } = req.body;
    const nuevoComentario = new Comentario({
      id: Date.now(),
      nombre: nombre || "Anónimo",
      texto,
      rating: Number(rating) || 5,
      fecha: new Date()
    });
    await nuevoComentario.save();
    res.status(201).json(nuevoComentario);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al publicar opinión" });
  }
});

// Ruta para validar login de admin
app.post('/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: "Contraseña incorrecta" });
  }
});

// Ruta para obtener todos los pedidos (para la vista de administrador)
app.get('/admin/orders', authAdmin, async (req, res) => {
  try {
    const pedidos = await Pedido.find().sort({ fecha: -1 });
    res.status(200).json(pedidos);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al obtener historial" });
  }
});

// Ruta para actualizar el estado de un pedido
app.patch('/admin/orders/:id/status', authAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { nuevoEstado } = req.body;

    const pedidoActualizado = await Pedido.findOneAndUpdate(
      { id: id },
      { estado: nuevoEstado },
      { new: true }
    );

    if (pedidoActualizado) {
      res.json({ success: true, pedido: pedidoActualizado });
    } else {
      res.status(404).json({ success: false, message: "Pedido no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al actualizar estado" });
  }
});

// Ruta para crear una preferencia de pago
app.post('/create_preference', async (req, res) => {
  const { cartItems, total } = req.body;

  // Mapear los items del carrito al formato que espera Mercado Pago
  const items_mp = cartItems.map(item => ({
    title: String(item.nombre).substring(0, 255), 
    unit_price: parseFloat(Number(item.precioUnitarioTotal || 0).toFixed(2)), 
    quantity: parseInt(item.quantity || 1, 10), 
    currency_id: 'ARS', // Moneda de Argentina (ajusta según tu país)
  }));

  // Debug para ver qué estamos enviando (útil si vuelve a fallar)
  console.log("Items enviados a MP:", JSON.stringify(items_mp, null, 2));

  const preference = new Preference(client);

  try {
    const response = await preference.create({
      body: {
        items: items_mp,
        auto_return: 'approved',
        back_urls: {
          // Usamos una variable de entorno para la URL base en producción
          success: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/success`,
          pending: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/pending`,
          failure: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/failure`
        },
        external_reference: `ORDER-${Date.now()}`
      }
    });

    res.json({ id: response.id });
  } catch (error) {
    console.error("Error al crear la preferencia de Mercado Pago:", error);
    res.status(500).json({ error: 'Error al crear la preferencia de pago', details: error.message });
  }
});

// Iniciar el servidor
app.listen(PORT, async () => {
  console.log(`🚀 Servidor de backend activo en el puerto ${PORT}`);
});