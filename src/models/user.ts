import { User } from "../types/user";
import pool from "../db/config";

export async function findAll(): Promise<User[]> {
    const result = await pool.query("SELECT id, name FROM users");
    return result.rows;
}

export async function findById(id: number): Promise<User | undefined> {
    const result = await pool.query("SELECT id, name FROM users WHERE id = $1", [id]);
    return result.rows[0];
}

export async function create(name: string): Promise<User> {
    const result = await pool.query(
        "INSERT INTO users (name) VALUES ($1) RETURNING id, name",
        [name]
    );
    return result.rows[0];
}
