import axios from 'axios';

const API_URL = 'http://localhost:3000';

describe('ユーザー管理API', () => {
    describe('GET /users', () => {
        test('ユーザー一覧を返す', async () => {
            const response = await axios.get(`${API_URL}/users`);
            expect(response.status).toBe(200);
            expect(Array.isArray(response.data.data)).toBe(true);
        });
    });

    describe('POST /users', () => {
        test('新規ユーザーを作成する', async () => {
            const userData = { name: 'Test User' };
            const response = await axios.post(`${API_URL}/users`, userData);
            expect(response.status).toBe(201);
            expect(response.data.data.name).toBe(userData.name);
        });

        test('不正なデータで400エラーを返す', async () => {
            try {
                await axios.post(`${API_URL}/users`, {});
                fail('エラーが発生すべき');
            } catch (error: any) {
                expect(error.response.status).toBe(400);
            }
        });
    });

    describe('GET /users/:id', () => {
        test('存在するユーザーの情報を返す', async () => {
            const response = await axios.get(`${API_URL}/users/1`);
            expect(response.status).toBe(200);
            expect(response.data.data.id).toBe(1);
        });

        test('存在しないユーザーで404エラーを返す', async () => {
            try {
                await axios.get(`${API_URL}/users/999`);
                fail('エラーが発生すべき');
            } catch (error: any) {
                expect(error.response.status).toBe(404);
            }
        });
    });
});
