import * as http from 'http';
import * as url from 'url';

// 定数の型定義
const PORT: number = 3000;

// レスポンスの型定義
interface ApiResponse {
    message?: string;
    error?: string;
}

// リクエストハンドラーの型定義
type RequestHandler = (
    req: http.IncomingMessage,
    res: http.ServerResponse
) => void;

// メインのハンドラー関数
const handleRequest: RequestHandler = (req, res) => {
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

    // パスに基づいてレスポンスを生成
    if (parsedUrl.pathname === '/') {
        response = { message: "Hello, Node.js!" };
        res.statusCode = 200;
    } else {
        response = { error: 'Not Found' };
        res.statusCode = 404;
    }

    res.end(JSON.stringify(response));
};

// サーバーの作成と起動
const server = http.createServer(handleRequest);

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});