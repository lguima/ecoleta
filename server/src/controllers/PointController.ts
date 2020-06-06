import { Request, Response } from 'express';
import knex from '../database/connection';

class PointController {
  async index(request: Request, response: Response) {
    const { city, state, categories } = request.query;

    const parsedCategories = String(categories)
      .split(',')
      .map(category => Number(category.trim()));

    const points = await knex('points')
      .join('point_categories', 'points.id', '=', 'point_categories.point_id')
      .whereIn('point_categories.category_id', parsedCategories)
      .where('city', String(city))
      .where('state', String(state))
      .distinct()
      .select('points.*');

    const serializedPoints = points.map(point => {
      return {
        ...point,
        image_url: `http://localhost:3333/uploads/storage/${point.image}`,
      };
    });

    return response.json(serializedPoints);
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const point = await knex('points').where('id', id).first();

    if (!point) {
      return response.status(404).json({ message: 'Point not found.' });
    }

    const serializedPoint = {
      ...point,
      image_url: `http://localhost:3333/uploads/storage/${point.image}`,
    };

    const categories = await knex('categories')
      .join('point_categories', 'categories.id', '=', 'point_categories.category_id')
      .where('point_categories.point_id', id)
      .select('categories.id', 'categories.title');

    return response.json({ point: serializedPoint, categories });
  }

  async store(request: Request, response: Response) {
    const {
      summary,
      email,
      phone,
      latitude,
      longitude,
      city,
      state,
      categories,
    } = request.body;
  
    const trx = await knex.transaction();

    const point = {
      summary,
      image: request.file.filename,
      email,
      phone,
      latitude,
      longitude,
      city,
      state,
    };
  
    const insertedIds = await trx('points').insert(point);
  
    const pointId = insertedIds[0];
  
    const pointCategories = categories
      .split(',')
      .map((category: string) => Number(category.trim()))
      .map((category_id: number) => {
        return {
          category_id,
          point_id: pointId,
        }
      }
    );
  
    await trx('point_categories').insert(pointCategories);

    await trx.commit();
  
    return response.json({
      id: pointId,
      ...point,
    });
  }
}

export default PointController;
