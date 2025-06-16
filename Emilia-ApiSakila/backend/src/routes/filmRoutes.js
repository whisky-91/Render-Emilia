"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var filmController_1 = require("../controllers/filmController");
var router = (0, express_1.Router)();
router.get('/', filmController_1.getFilms);
router.get('/available', filmController_1.getAvailable);
exports.default = router;
