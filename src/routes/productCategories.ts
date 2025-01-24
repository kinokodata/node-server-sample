import express, { Request, Response } from 'express';
import * as ProductCategoryModel from '../models/productCategory';
import {ProductCategoriesResponse} from "../types/product-category/productCategoriesResponse";
import {ErrorResponse} from "../types/errorResponse";
import {ProductCategoryResponse} from "../types/product-category/productCategoryResponse";
import {ProductCategoryCreateRequest} from "../types/product-category/productCategoryCreateRequest";
import {ProductCategoryUpdateRequest} from "../types/product-category/productCategoryUpdateRequest";
import {ProductCategoryUpdatedResponse} from "../types/product-category/productCategoryUpdatedResponse";
import {ProductCategoryDeletedResponse} from "../types/product-category/productCategoryDeletedResponse";
import {ProductCategoryCreatedResponse} from "../types/product-category/productCategoryCreatedResponse";

const router = express.Router();

router.get('/', async (_req: Request, res: Response) => {
    try {
        const categories = await ProductCategoryModel.findAll();
        const response: ProductCategoriesResponse = { data: categories };
        res.json(response);
    } catch (err) {
        const response: ErrorResponse = { error: 'データの取得に失敗しました' };
        res.status(500).json(response);
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const category = await ProductCategoryModel.findById(id);

        if (!category) {
            const response: ErrorResponse = { error: '商品カテゴリが見つかりません' };
            res.status(404).json(response);
            return;
        }

        const response: ProductCategoryResponse = { data: category };
        res.json(response);
    } catch (err) {
        const response: ErrorResponse = { error: 'データの取得に失敗しました' };
        res.status(500).json(response);
    }
});

router.post('/', async (req: Request<{}, {}, ProductCategoryCreateRequest>, res: Response) => {
    try {
        const { name, description } = req.body;

        if (!name || typeof name !== 'string') {
            const response: ErrorResponse = { error: '不正なリクエストデータです' };
            res.status(400).json(response);
            return;
        }

        const newCategory = await ProductCategoryModel.create(name, description);
        const response: ProductCategoryCreatedResponse = {
            message: '商品カテゴリの作成が完了しました',
            data: newCategory
        };

        res.status(201).json(response);
    } catch (err) {
        const response: ErrorResponse = { error: 'データの作成に失敗しました' };
        res.status(500).json(response);
    }
});

router.patch('/:id', async (req: Request<{ id: string }, {}, ProductCategoryUpdateRequest>, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const { name, description } = req.body;

        // 更新対象の存在確認
        const existingCategory = await ProductCategoryModel.findById(id);
        if (!existingCategory) {
            const response: ErrorResponse = { error: '商品カテゴリが見つかりません' };
            res.status(404).json(response);
            return;
        }

        const updatedCategory = await ProductCategoryModel.update(id, name, description);

        if(!updatedCategory) {
            const response: ErrorResponse = { error: '商品カテゴリが見つかりません' };
            res.status(404).json(response);
            return;
        }

        const response: ProductCategoryUpdatedResponse = {
            message: '商品カテゴリの更新が完了しました',
            data: updatedCategory
        };

        res.json(response);
    } catch (err) {
        const response: ErrorResponse = { error: 'データの更新に失敗しました' };
        res.status(500).json(response);
    }
});

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const deletedCategory = await ProductCategoryModel.deleteById(id);

        if (!deletedCategory) {
            const response: ErrorResponse = { error: '商品カテゴリが見つかりません' };
            res.status(404).json(response);
            return;
        }

        const response: ProductCategoryDeletedResponse = {
            message: '商品カテゴリの削除が完了しました',
            data: deletedCategory
        };

        res.json(response);
    } catch (err) {
        const response: ErrorResponse = { error: 'データの削除に失敗しました' };
        res.status(500).json(response);
    }
});

export default router;
