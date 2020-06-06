import express, { request, response } from 'express';
import { celebrate, Joi } from 'celebrate'

import multer from 'multer';
import multerConfig from './config/multer';

import PointController from './controllers/PointController';
import CategoryController from './controllers/CategoryController';

const routes = express.Router();
const upload = multer(multerConfig);

const pointController = new PointController();
const categoryController = new CategoryController();

routes.get('/categories', categoryController.index);

routes.get('/points', pointController.index);
routes.get('/points/:id', pointController.show);

routes.post(
  '/points',
  upload.single('image'),
  celebrate({
    body: Joi.object().keys({
      summary: Joi.string().required(),
      email: Joi.string().required().email(),
      phone: Joi.string().required(),
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      city: Joi.string().required(),
      state: Joi.string().required().max(2),
      categories: Joi.string().required(),
    }),
  }, {
    abortEarly: false,
  }),
  pointController.store,
);

export default routes;
