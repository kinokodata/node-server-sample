import axios from 'axios';

const API_URL = 'http://localhost:3000';

describe('商品カテゴリ管理API', () => {
    let createdCategoryId: number;

    describe('GET /product-categories', () => {
        test('商品カテゴリ一覧を返す', async () => {
            const response = await axios.get(`${API_URL}/product-categories`);
            expect(response.status).toBe(200);
            expect(Array.isArray(response.data.data)).toBe(true);
        });
    });

    describe('POST /product-categories', () => {
        test('新規商品カテゴリを作成する', async () => {
            const categoryData = {
                name: 'Test Category',
                description: 'Test Description'
            };
            const response = await axios.post(`${API_URL}/product-categories`, categoryData);
            expect(response.status).toBe(201);
            expect(response.data.data.name).toBe(categoryData.name);
            expect(response.data.data.description).toBe(categoryData.description);
            createdCategoryId = response.data.data.id;
        });

        test('不正なデータで400エラーを返す', async () => {
            try {
                await axios.post(`${API_URL}/product-categories`, {});
                fail('エラーが発生すべき');
            } catch (error: any) {
                expect(error.response.status).toBe(400);
            }
        });
    });

    describe('GET /product-categories/:id', () => {
        test('存在する商品カテゴリの情報を返す', async () => {
            const response = await axios.get(`${API_URL}/product-categories/1`);
            expect(response.status).toBe(200);
            expect(response.data.data.id).toBe(1);
        });

        test('存在しない商品カテゴリで404エラーを返す', async () => {
            try {
                await axios.get(`${API_URL}/product-categories/999`);
                fail('エラーが発生すべき');
            } catch (error: any) {
                expect(error.response.status).toBe(404);
            }
        });
    });

    describe('PATCH /product-categories/:id', () => {
        test('商品カテゴリを更新する', async () => {
            const updateData = {
                name: 'Updated Category',
                description: 'Updated Description'
            };
            const response = await axios.patch(
                `${API_URL}/product-categories/${createdCategoryId}`,
                updateData
            );
            expect(response.status).toBe(200);
            expect(response.data.data.name).toBe(updateData.name);
            expect(response.data.data.description).toBe(updateData.description);
        });

        test('存在しない商品カテゴリの更新で404エラーを返す', async () => {
            try {
                await axios.patch(`${API_URL}/product-categories/999`, { name: 'Test' });
                fail('エラーが発生すべき');
            } catch (error: any) {
                expect(error.response.status).toBe(404);
            }
        });
    });

    describe('DELETE /product-categories/:id', () => {
        test('商品カテゴリを削除する', async () => {
            const response = await axios.delete(
                `${API_URL}/product-categories/${createdCategoryId}`
            );
            expect(response.status).toBe(200);
            expect(response.data.message).toBeTruthy();
        });

        test('存在しない商品カテゴリの削除で404エラーを返す', async () => {
            try {
                await axios.delete(`${API_URL}/product-categories/999`);
                fail('エラーが発生すべき');
            } catch (error: any) {
                expect(error.response.status).toBe(404);
            }
        });
    });
});
