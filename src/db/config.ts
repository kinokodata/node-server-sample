import { Pool } from "pg";

const pool = new Pool({
    user: "admin",
    host: "postgres", // Docker Composeで定義したサービス名
    database: "myapp",
    password: "secretpassword",
    port: 5432,
});

export default pool;
