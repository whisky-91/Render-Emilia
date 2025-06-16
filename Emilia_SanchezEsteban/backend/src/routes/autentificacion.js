"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConfig = exports.authRouter = void 0;
// backend/src/routes/auth.ts
var express_1 = require("express");
var promise_1 = require("mysql2/promise");
var router = express_1.default.Router();
exports.authRouter = router;
// Esta variable guardará temporalmente la conexión si es válida
var dbConfig = null;
exports.dbConfig = dbConfig;
router.post('/connect', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, host, port, database, user, password, conn, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, host = _a.host, port = _a.port, database = _a.database, user = _a.user, password = _a.password;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 5, , 6]);
                return [4 /*yield*/, promise_1.default.createConnection({
                        host: host,
                        port: Number(port),
                        database: database,
                        user: user,
                        password: password
                    })];
            case 2:
                conn = _b.sent();
                return [4 /*yield*/, conn.query('SELECT 1')];
            case 3:
                _b.sent(); // test query
                return [4 /*yield*/, conn.end()];
            case 4:
                _b.sent();
                // Guardamos la config si es válida
                exports.dbConfig = dbConfig = { host: host, port: Number(port), database: database, user: user, password: password };
                res.status(200).json({ success: true });
                return [3 /*break*/, 6];
            case 5:
                err_1 = _b.sent();
                console.error('Connection failed:', err_1.message);
                res.status(401).json({ success: false, message: 'Datos incorrectos o conexión fallida.' });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.get('/config', function (req, res) {
    if (dbConfig) {
        res.status(200).json({ success: true });
    }
    else {
        res.status(403).json({ success: false });
    }
});
