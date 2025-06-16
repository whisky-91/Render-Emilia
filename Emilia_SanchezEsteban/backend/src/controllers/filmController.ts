import { Request, Response } from "express";
import { getDbPool } from "../database/db";

export const getFilms = async (_req: Request, res: Response) => {
  try {
    const db = getDbPool();
    const [rows] = await db.query(
      "SELECT film_id, title, description, release_year, language_id, rental_duration, rental_rate, length, replacement_cost, rating FROM film"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener films:", error);
    res.status(500).json({ message: "Error al obtener films", error });
  }
};

export const getAvailable = async (_req: Request, res: Response) => {
  const db = getDbPool();
  try {
    const [rows] = await db.query(`
    SELECT f.title, c.name AS category, COUNT(i.inventory_id) AS disponibles
    FROM film f
    JOIN film_category fc ON f.film_id = fc.film_id
    JOIN category c ON fc.category_id = c.category_id
    JOIN inventory i ON f.film_id = i.film_id
    LEFT JOIN rental r ON i.inventory_id = r.inventory_id AND r.return_date IS NULL
    WHERE r.rental_id IS NULL
    GROUP BY f.film_id, f.title, c.name
    ORDER BY disponibles DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al consultar datos", error });
  }
};
