import * as http from 'http';
import * as url from 'url';

// 定数の型定義
const PORT: number = 3000;

// User型の定義
interface User {
    id: number;
    name: string;
}

// APIのリクエスト・レスポンスの型定義
interface CreateUserRequest {
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

// リクエストボディを取得する関数
const getRequestBody = (req: http.IncomingMessage): Promise<string> => {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            resolve(body);
        });
        req.on('error', error => {
            reject(error);
        });
    });
};

// リクエストハンドラーの型定義
type RequestHandler = (
    req: http.IncomingMessage,
    res: http.ServerResponse
) => void;

// メインのハンドラー関数
const handleRequest: RequestHandler = async (req, res) => {
    // URLが必ず存在することを保証
    if (!req.url) {
        const errorResponse: ErrorResponse = { error: 'Invalid URL' };
        res.statusCode = 400;
        res.end(JSON.stringify(errorResponse));
        return;
    }

    const parsedUrl = url.parse(req.url, true);

    // レスポンスヘッダーの設定
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');

    try {
        // メソッドとパスに基づいてレスポンスを生成
        if (req.method === 'GET') {
            switch (parsedUrl.pathname) {
                case '/': {
                    const response: WelcomeResponse = { message: "Hello, Node.js!" };
                    res.statusCode = 200;
                    res.end(JSON.stringify(response));
                    break;
                }

                case '/users': {
                    const response: UsersResponse = { data: users };
                    res.statusCode = 200;
                    res.end(JSON.stringify(response));
                    break;
                }

                case '/users/1': {
                    const user = users.find(u => u.id === 1);
                    if (!user) {
                        const errorResponse: ErrorResponse = { error: 'User not found' };
                        res.statusCode = 404;
                        res.end(JSON.stringify(errorResponse));
                        return;
                    }
                    const response: UserResponse = { data: user };
                    res.statusCode = 200;
                    res.end(JSON.stringify(response));
                    break;
                }

                default: {
                    const errorResponse: ErrorResponse = { error: 'Not Found' };
                    res.statusCode = 404;
                    res.end(JSON.stringify(errorResponse));
                }
            }
        } else if (req.method === 'POST' && parsedUrl.pathname === '/users') {
            const body = await getRequestBody(req);
            const userData = JSON.parse(body) as CreateUserRequest;

            // 入力バリデーション
            if (!userData.name || typeof userData.name !== 'string') {
                const errorResponse: ErrorResponse = { error: 'Invalid user data' };
                res.statusCode = 400;
                res.end(JSON.stringify(errorResponse));
                return;
            }

            // 新しいユーザーの作成
            const newUser: User = {
                id: users.length + 1,
                name: userData.name
            };
            users.push(newUser);

            const response: UserCreatedResponse = {
                message: 'User created successfully',
                data: newUser
            };
            res.statusCode = 201;
            res.end(JSON.stringify(response));

        } else if (req.method === 'OPTIONS') {
            // CORS プリフライトリクエストの処理
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            res.statusCode = 204;
            res.end();
            return;
        } else {
            const errorResponse: ErrorResponse = { error: 'Method Not Allowed' };
            res.statusCode = 405;
            res.end(JSON.stringify(errorResponse));
        }
    } catch (err) {
        const errorResponse: ErrorResponse = { error: 'Internal Server Error' };
        res.statusCode = 500;
        res.end(JSON.stringify(errorResponse));
    }
};

// サーバーの作成と起動
const server = http.createServer(handleRequest);

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});