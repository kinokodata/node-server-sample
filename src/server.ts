import * as http from 'http';
import * as url from 'url';

const PORT = 3000;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url!, true);

// Set CORS headers
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');

// Handle root path
    if (parsedUrl.pathname === '/') {
        const response = {
            message: "Hello, Node.js!"
        };

        res.statusCode = 200;
        res.end(JSON.stringify(response));
        return;
    }

// Handle 404 for other routes
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Not Found' }));
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});