import express, { Request, Response } from 'express';
import * as ProductModel from '../models/product';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const products = await ProductModel.findAll();
        res.json({ data: products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const product = await ProductModel.findById(id);

        if (!product) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }

        res.json({ data: product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/', async (req: Request, res: Response) => {
    try {
        const { name, categoryId, basePrice } = req.body;

        if (!name || typeof name !== 'string' ||
            typeof categoryId !== 'number' ||
            typeof basePrice !== 'number') {
            res.status(400).json({ error: 'Invalid request data' });
            return;
        }

        const newProduct = await ProductModel.create(name, categoryId, basePrice);

        res.status(201).json({
            message: '商品の作成が完了しました',
            data: newProduct
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.patch('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const { name, categoryId, basePrice } = req.body;

        if ((name !== undefined && typeof name !== 'string') ||
            (categoryId !== undefined && typeof categoryId !== 'number') ||
            (basePrice !== undefined && typeof basePrice !== 'number')) {
            res.status(400).json({ error: 'Invalid request data' });
            return;
        }

        const updatedProduct = await ProductModel.update(id, { name, categoryId, basePrice });

        if (!updatedProduct) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }

        res.json({
            message: '商品の更新が完了しました',
            data: updatedProduct
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const deletedProduct = await ProductModel.deleteById(id);

        if (!deletedProduct) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }

        res.json({
            message: '商品の削除が完了しました',
            data: deletedProduct
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;