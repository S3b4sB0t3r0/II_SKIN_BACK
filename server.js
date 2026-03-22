require('dotenv').config();
// 🔥 Forzar IPv4 primero (SOLUCIONA querySrv ECONNREFUSED en Windows)
require('dns').setDefaultResultOrder('ipv4first');

const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);

// ======================
// 🌐 CORS ORIGINS
// ======================

const allowedOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',')
    : ['http://localhost:5173', 'http://localhost:3000'];

// ======================
// 🔌 SOCKET.IO
// ======================

const io = socketIo(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"]
    }
});

// ======================
// 🔗 CONEXIÓN MONGODB
// ======================

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB conectado correctamente");
    })
    .catch((err) => {
        console.error("❌ Error al conectar MongoDB:", err.message);
        process.exit(1);
    });

mongoose.connection.on("disconnected", () => {
    console.log("⚠ MongoDB desconectado");
});

mongoose.connection.on("reconnected", () => {
    console.log("🔄 MongoDB reconectado");
});

// ======================
// MIDDLEWARES
// ======================

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
app.use(express.json());

// ======================
// RUTAS
// ======================

const userRoute = require('./routes/userRoutes');
app.use('/api/user', userRoute);

const productRoutes = require("./routes/product.routes");
app.use("/api/products", productRoutes);

const contactRoutes = require('./routes/contactRoutes');
app.use('/api', contactRoutes);

// ======================
// WEBSOCKETS
// ======================

io.on('connection', (socket) => {
    console.log('🔌 Usuario conectado');

    socket.on('mensaje', (data) => {
        console.log("📩 Mensaje recibido:", data);
    });

    socket.on('disconnect', () => {
        console.log('❌ Usuario desconectado');
    });
});

// ======================
// SERVIDOR
// ======================

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});