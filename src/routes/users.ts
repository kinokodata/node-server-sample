import express, { Request, Response } from 'express';
import { ApiResponse } from '../types/api';
import * as UserModel from '../models/user';

const router = express.Router();

// ユーザー一覧の取得
router.get('/', (req: Request, res: Response) => {
    const response: ApiResponse = { data: UserModel.users };
    res.json(response);
});

// 特定のユーザーの取得
router.get('/:id', (req: Request<{ id: string }>, res: Response) => {
    const id = parseInt(req.params.id);
    const user = UserModel.findById(id);

    if (!user) {
        const response: ApiResponse = { error: 'User not found' };
        res.status(404).json(response);
    }

    const response: ApiResponse = { data: user };
    res.json(response);
});

// 新規ユーザーの作成
router.post('/', (req: Request, res: Response) => {
    const { name } = req.body;

    if (!name || typeof name !== 'string') {
        const response: ApiResponse = { error: 'Invalid user data' };
        res.status(400).json(response);
    }

    const newUser = UserModel.create(name);
    const response: ApiResponse = {
        message: 'User created successfully',
        data: newUser
    };

    res.status(201).json(response);
});

export default router;