import { ProductCategory } from "../types/product-category/productCategory";
import pool from "../db/config";

export async function findAll(): Promise<ProductCategory[]> {
    const result = await pool.query("SELECT id, name, description FROM product_categories");
    return result.rows;
}

export async function findById(id: number): Promise<ProductCategory | undefined> {
    const result = await pool.query(
        "SELECT id, name, description FROM product_categories WHERE id = $1",
        [id]
    );
    return result.rows[0];
}

export async function create(name: string, description?: string): Promise<ProductCategory> {
    const result = await pool.query(
        "INSERT INTO product_categories (name, description) VALUES ($1, $2) RETURNING id, name, description",
        [name, description]
    );
    return result.rows[0];
}

export async function update(id: number, name?: string, description?: string): Promise<ProductCategory | undefined> {
    const setColumns = [];
    const values: [string | number] = [id];
    let paramCounter = 2;

    if (name) {
        setColumns.push(`name = $${paramCounter}`);
        values.push(name);
        paramCounter++;
    }
    if (description !== undefined) {
        setColumns.push(`description = $${paramCounter}`);
        values.push(description);
    }

    if (setColumns.length === 0) {
        return findById(id);
    }

    const result = await pool.query(
        `UPDATE product_categories SET ${setColumns.join(", ")} WHERE id = $1 RETURNING id, name, description`,
        values
    );
    return result.rows[0];
}

export async function deleteById(id: number): Promise<ProductCategory | undefined> {
    const result = await pool.query(
        "DELETE FROM product_categories WHERE id = $1 RETURNING id, name, description",
        [id]
    );
    return result.rows[0];
}