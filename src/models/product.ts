import { Product } from "../types/product/product";
import pool from "../db/config";

export async function findAll(): Promise<Product[]> {
    const result = await pool.query(`
        SELECT 
            p.id,
            p.name,
            p.base_price as "basePrice",
            p.created_at as "createdAt",
            c.id as "categoryId",
            c.name as "categoryName",
            c.description as "categoryDescription"
        FROM products p
        LEFT JOIN product_categories c ON p.category_id = c.id
    `);

    return result.rows.map(row => ({
        id: row.id,
        name: row.name,
        basePrice: row.basePrice,
        createdAt: row.createdAt,
        category: {
            id: row.categoryId,
            name: row.categoryName,
            description: row.categoryDescription
        }
    }));
}

export async function findById(id: number): Promise<Product | undefined> {
    const result = await pool.query(`
        SELECT 
            p.id,
            p.name,
            p.base_price as "basePrice",
            p.created_at as "createdAt",
            c.id as "categoryId",
            c.name as "categoryName",
            c.description as "categoryDescription"
        FROM products p
        LEFT JOIN product_categories c ON p.category_id = c.id
        WHERE p.id = $1
    `, [id]);

    if (result.rows.length === 0) return undefined;

    const row = result.rows[0];
    return {
        id: row.id,
        name: row.name,
        basePrice: row.basePrice,
        createdAt: row.createdAt,
        category: {
            id: row.categoryId,
            name: row.categoryName,
            description: row.categoryDescription
        }
    };
}

export async function create(name: string, categoryId: number, basePrice: number): Promise<Product> {
    const result = await pool.query(`
        WITH inserted_product AS (
            INSERT INTO products (name, category_id, base_price)
            VALUES ($1, $2, $3)
            RETURNING id, name, base_price as "basePrice", created_at as "createdAt", category_id
        )
        SELECT 
            p.id,
            p.name,
            p."basePrice",
            p."createdAt",
            c.id as "categoryId",
            c.name as "categoryName",
            c.description as "categoryDescription"
        FROM inserted_product p
        LEFT JOIN product_categories c ON p.category_id = c.id
    `, [name, categoryId, basePrice]);

    const row = result.rows[0];
    return {
        id: row.id,
        name: row.name,
        basePrice: row.basePrice,
        createdAt: row.createdAt,
        category: {
            id: row.categoryId,
            name: row.categoryName,
            description: row.categoryDescription
        }
    };
}

export async function update(
    id: number,
    updates: { name?: string; categoryId?: number; basePrice?: number }
): Promise<Product | undefined> {
    const setColumns = [];
    const values: any[] = [id];
    let paramCounter = 2;

    if (updates.name) {
        setColumns.push(`name = $${paramCounter}`);
        values.push(updates.name);
        paramCounter++;
    }
    if (updates.categoryId !== undefined) {
        setColumns.push(`category_id = $${paramCounter}`);
        values.push(updates.categoryId);
        paramCounter++;
    }
    if (updates.basePrice !== undefined) {
        setColumns.push(`base_price = $${paramCounter}`);
        values.push(updates.basePrice);
    }

    if (setColumns.length === 0) {
        return findById(id);
    }

    const result = await pool.query(`
        WITH updated_product AS (
            UPDATE products 
            SET ${setColumns.join(", ")} 
            WHERE id = $1
            RETURNING id, name, base_price as "basePrice", created_at as "createdAt", category_id
        )
        SELECT 
            p.id,
            p.name,
            p."basePrice",
            p."createdAt",
            c.id as "categoryId",
            c.name as "categoryName",
            c.description as "categoryDescription"
        FROM updated_product p
        LEFT JOIN product_categories c ON p.category_id = c.id
    `, values);

    const row = result.rows[0];
    if (!row) return undefined;

    return {
        id: row.id,
        name: row.name,
        basePrice: row.basePrice,
        createdAt: row.createdAt,
        category: {
            id: row.categoryId,
            name: row.categoryName,
            description: row.categoryDescription
        }
    };
}

export async function deleteById(id: number): Promise<Product | undefined> {
    const result = await pool.query(`
        WITH deleted_product AS (
            DELETE FROM products 
            WHERE id = $1
            RETURNING id, name, base_price as "basePrice", created_at as "createdAt", category_id
        )
        SELECT 
            p.id,
            p.name,
            p."basePrice",
            p."createdAt",
            c.id as "categoryId",
            c.name as "categoryName",
            c.description as "categoryDescription"
        FROM deleted_product p
        LEFT JOIN product_categories c ON p.category_id = c.id
    `, [id]);

    const row = result.rows[0];
    if (!row) return undefined;

    return {
        id: row.id,
        name: row.name,
        basePrice: row.basePrice,
        createdAt: row.createdAt,
        category: {
            id: row.categoryId,
            name: row.categoryName,
            description: row.categoryDescription
        }
    };
}