import axios from 'axios';

describe('APIサーバのテスト', () => {
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
});