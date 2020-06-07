"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var celebrate_1 = require("celebrate");
var multer_1 = __importDefault(require("multer"));
var multer_2 = __importDefault(require("./config/multer"));
var PointController_1 = __importDefault(require("./controllers/PointController"));
var CategoryController_1 = __importDefault(require("./controllers/CategoryController"));
var routes = express_1.default.Router();
var upload = multer_1.default(multer_2.default);
var pointController = new PointController_1.default();
var categoryController = new CategoryController_1.default();
routes.get('/categories', categoryController.index);
routes.get('/points', pointController.index);
routes.get('/points/:id', pointController.show);
routes.post('/points', upload.single('image'), celebrate_1.celebrate({
    body: celebrate_1.Joi.object().keys({
        summary: celebrate_1.Joi.string().required(),
        email: celebrate_1.Joi.string().required().email(),
        phone: celebrate_1.Joi.string().required(),
        latitude: celebrate_1.Joi.number().required(),
        longitude: celebrate_1.Joi.number().required(),
        city: celebrate_1.Joi.string().required(),
        state: celebrate_1.Joi.string().required().max(2),
        categories: celebrate_1.Joi.string().required(),
    }),
}, {
    abortEarly: false,
}), pointController.store);
exports.default = routes;
