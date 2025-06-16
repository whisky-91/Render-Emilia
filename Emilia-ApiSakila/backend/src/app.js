"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var path_1 = require("path");
var filmRoutes_1 = require("./routes/filmRoutes");
var autentificacion_1 = require("./routes/autentificacion");
var app = (0, express_1.default)();
var publicPath = path_1.default.join(__dirname, '../../frontend/public');
var distPath = path_1.default.join(__dirname, '../../frontend/dist');
// Middlewares globales
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Rutas de autenticación (login, connect, config)
app.use('/', autentificacion_1.authRouter);
// Protección de root e index antes de servir los archivos estátitcos
app.get(['/', '/index.html'], function (_req, res, next) {
    if (!autentificacion_1.dbConfig) {
        return res.redirect('/login.html');
    }
    next();
});
// Servimos archivos estáticos
app.use(express_1.default.static(publicPath));
app.use('/dist', express_1.default.static(distPath));
// API protegida: FILMS
app.use('/api/films', 
// middleware de auth
function (req, res, next) {
    if (!autentificacion_1.dbConfig) {
        res.status(403).json({ message: 'Autenticar conexión primero' });
        return; // ¡aquí salimos sin devolver el Response!
    }
    next(); // continuamos hacia filmRoutes
}, filmRoutes_1.default);
exports.default = app;
