import axios from 'axios';

const API_URL = 'http://localhost:3000';

describe('商品管理API', () => {
    let createdProductId: number;
    const categoryId = 1;  // 既存のカテゴリIDを想定

    describe('GET /products', () => {
        test('商品一覧を返す', async () => {
            const response = await axios.get(`${API_URL}/products`);
            expect(response.status).toBe(200);
            expect(Array.isArray(response.data.data)).toBe(true);
        });
    });

    describe('POST /products', () => {
        test('新規商品を作成する', async () => {
            const productData = {
                name: 'Test Product',
                categoryId: categoryId,
                basePrice: 1000
            };
            const response = await axios.post(`${API_URL}/products`, productData);
            expect(response.status).toBe(201);
            expect(response.data.data.name).toBe(productData.name);
            expect(response.data.data.basePrice).toBe(productData.basePrice);
            createdProductId = response.data.data.id;
        });

        test('不正なデータで400エラーを返す', async () => {
            try {
                await axios.post(`${API_URL}/products`, {});
                fail('エラーが発生すべき');
            } catch (error: any) {
                expect(error.response.status).toBe(400);
            }
        });
    });

    describe('GET /products/:id', () => {
        test('存在する商品の情報を返す', async () => {
            const response = await axios.get(`${API_URL}/products/1`);
            expect(response.status).toBe(200);
            expect(response.data.data.id).toBe(1);
        });

        test('存在しない商品で404エラーを返す', async () => {
            try {
                await axios.get(`${API_URL}/products/999`);
                fail('エラーが発生すべき');
            } catch (error: any) {
                expect(error.response.status).toBe(404);
            }
        });
    });

    describe('PATCH /products/:id', () => {
        test('商品を更新する', async () => {
            const updateData = {
                name: 'Updated Product',
                basePrice: 2000
            };
            const response = await axios.patch(
                `${API_URL}/products/${createdProductId}`,
                updateData
            );
            expect(response.status).toBe(200);
            expect(response.data.data.name).toBe(updateData.name);
            expect(response.data.data.basePrice).toBe(updateData.basePrice);
        });

        test('存在しない商品の更新で404エラーを返す', async () => {
            try {
                await axios.patch(`${API_URL}/products/999`, { name: 'Test' });
                fail('エラーが発生すべき');
            } catch (error: any) {
                expect(error.response.status).toBe(404);
            }
        });
    });

    describe('DELETE /products/:id', () => {
        test('商品を削除する', async () => {
            const response = await axios.delete(
                `${API_URL}/products/${createdProductId}`
            );
            expect(response.status).toBe(200);
            expect(response.data.message).toBeTruthy();
        });

        test('存在しない商品の削除で404エラーを返す', async () => {
            try {
                await axios.delete(`${API_URL}/products/999`);
                fail('エラーが発生すべき');
            } catch (error: any) {
                expect(error.response.status).toBe(404);
            }
        });
    });
});
