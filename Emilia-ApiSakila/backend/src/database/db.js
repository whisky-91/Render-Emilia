"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDbPool = getDbPool;
var promise_1 = require("mysql2/promise");
var autentificacion_1 = require("../routes/autentificacion"); //importada dbConfig desde autentificacion para chuquear que haya conexion
var pool = null;
function getDbPool() {
    if (!autentificacion_1.dbConfig) {
        throw new Error('No hay configuración de base de datos válida');
    }
    if (!pool) {
        pool = promise_1.default.createPool({
            host: autentificacion_1.dbConfig.host,
            port: autentificacion_1.dbConfig.port,
            database: autentificacion_1.dbConfig.database,
            user: autentificacion_1.dbConfig.user,
            password: autentificacion_1.dbConfig.password,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }
    return pool;
}
;
