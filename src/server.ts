import express from "express";
import { corsMiddleware } from "./middlewares/cors";
import { errorHandler } from "./middlewares/error";
import userRoutes from "./routes/users";
import {ErrorResponse} from "./types/errorResponse";
import {WelcomeResponse} from "./types/welcomeResponse";

const PORT: number = 3000;
const app = express();

// ミドルウェアの設定
app.use(express.json());
app.use(corsMiddleware);

// ルーティング
app.get("/", (req, res) => {
    const response: WelcomeResponse = { message: "Hello, Express!" };
    res.json(response);
});

app.use("/users", userRoutes);

// 404ハンドラー
app.use((req, res) => {
    const response: ErrorResponse = { error: "Not Found" };
    res.status(404).json(response);
});

// エラーハンドリングミドルウェアの適用
app.use(errorHandler);

// サーバーの起動
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

export default app;