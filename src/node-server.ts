import * as http from 'http';
import * as url from 'url';

// 定数の型定義
const PORT: number = 3000;

// レスポンスの型定義
interface ApiResponse {
    message?: string;
    error?: string;
    data?: any;
}

// User型の定義
interface User {
    id: number;
    name: string;
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
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Invalid URL' }));
        return;
    }

    const parsedUrl = url.parse(req.url, true);

    // レスポンスヘッダーの設定
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // レスポンスオブジェクトの初期化
    let response: ApiResponse;

    try {
        // メソッドとパスに基づいてレスポンスを生成
        if (req.method === 'GET') {
            switch (parsedUrl.pathname) {
                case '/':
                    response = { message: "Hello, Node.js!" };
                    res.statusCode = 200;
                    break;

                case '/users':
                    response = { data: users };
                    res.statusCode = 200;
                    break;

                case '/users/1':
                    const user = users.find(u => u.id === 1);
                    response = { data: user };
                    res.statusCode = 200;
                    break;

                default:
                    response = { error: 'Not Found' };
                    res.statusCode = 404;
            }
        } else if (req.method === 'POST' && parsedUrl.pathname === '/users') {
            const body = await getRequestBody(req);
            const userData = JSON.parse(body);

            // 入力バリデーション
            if (!userData.name || typeof userData.name !== 'string') {
                response = { error: 'Invalid user data' };
                res.statusCode = 400;
            } else {
                // 新しいユーザーの作成
                const newUser: User = {
                    id: users.length + 1,
                    name: userData.name
                };
                users.push(newUser);

                response = {
                    message: 'User created successfully',
                    data: newUser
                };
                res.statusCode = 201;
            }
        } else if (req.method === 'OPTIONS') {
            // CORS プリフライトリクエストの処理
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            res.statusCode = 204;
            res.end();
            return;
        } else {
            response = { error: 'Method Not Allowed' };
            res.statusCode = 405;
        }
    } catch (err) {
        response = { error: 'Internal Server Error' };
        res.statusCode = 500;
    }

    res.end(JSON.stringify(response));
};

// サーバーの作成と起動
const nodeServer = http.createServer(handleRequest);

nodeServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});