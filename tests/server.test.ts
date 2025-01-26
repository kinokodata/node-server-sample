import axios from 'axios';

const API_URL = 'http://localhost:3000';

describe('存在しないパス', () => {
    test('存在しないパスで404を返す', async () => {
        try {
            await axios.get(`${API_URL}/invalid-path/`);
            fail('エラーが発生すべき');
        } catch (error: any) {
            expect(error.response.status).toBe(404);
        }
    });
});

describe('ルートエンドポイント', () => {
    describe('GET /', () => {
        test('ウェルカムメッセージを返す', async () => {
            const response = await axios.get(API_URL);
            expect(response.status).toBe(200);
            expect(response.data).toEqual({
                message: 'Hello, Express!'
            });
        });
    });
});