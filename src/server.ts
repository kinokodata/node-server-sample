import express, { Request, Response, NextFunction } from 'express';

// 定数の型定義
const PORT: number = 3000;

// User型の定義
interface User {
    id: number;
    name: string;
}

// APIのリクエスト・レスポンスの型定義
interface UserCreateRequest {
    name: string;
}

interface WelcomeResponse {
    message: string;
}

interface UsersResponse {
    data: User[];
}

interface UserResponse {
    data: User;
}

interface UserCreatedResponse {
    message: string;
    data: User;
}

interface ErrorResponse {
    error: string;
}

// メモリ上のユーザーストア
let users: User[] = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Doe" }
];

// Expressアプリケーションの初期化
const app = express();

// ミドルウェアの設定
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// エラーハンドリングミドルウェア
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    const response: ErrorResponse = { error: 'Internal Server Error' };
    res.status(500).json(response);
};

// ルートハンドラー
app.get('/', (req: Request, res: Response) => {
    const response: WelcomeResponse = { message: "Hello, Express!" };
    res.json(response);
});

// ユーザー一覧の取得
app.get('/users', (req: Request, res: Response) => {
    const response: UsersResponse = { data: users };
    res.json(response);
});

// 特定のユーザーの取得
app.get('/users/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.id === id);

    if (!user) {
        const response: ErrorResponse = { error: 'User not found' };
        res.status(404).json(response);
        return;
    }

    const response: UserResponse = { data: user as User};
    res.json(response);
});

// 新規ユーザーの作成
app.post('/users', (req: Request, res: Response) => {
    const { name } = req.body;

    if (!name || typeof name !== 'string') {
        const response: ErrorResponse = { error: 'Invalid user data' };
        res.status(400).json(response);
        return;
    }

    const newUser: User = {
        id: users.length + 1,
        name: name
    };

    users.push(newUser);

    const response: UserCreatedResponse = {
        message: 'User created successfully',
        data: newUser
    };

    res.status(201).json(response);
});

// 404ハンドラー
app.use((req: Request, res: Response) => {
    const response: ErrorResponse = { error: 'Not Found' };
    res.status(404).json(response);
});

// エラーハンドリングミドルウェアの適用
app.use(errorHandler);

// サーバーの起動
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

export default app;