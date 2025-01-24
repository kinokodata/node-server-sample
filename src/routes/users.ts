import express, { Request, Response } from 'express';
import * as UserModel from '../models/user';
import {UserResponse} from "../types/user/userResponse";
import {ErrorResponse} from "../types/errorResponse";
import {UserCreatedResponse} from "../types/user/userCreatedResponse";
import {UserCreateRequest} from "../types/user/userCreateRequest";
import {UsersResponse} from "../types/user/usersResponse";
import {User} from "../types/user/user";

const router = express.Router();

// ユーザー一覧の取得
router.get('/', async (req: Request, res: Response) => {
    const users = await UserModel.findAll();
    const response: UsersResponse = {data: users};
    res.json(response);
});

// 特定のユーザーの取得
router.get('/:id', async (req: Request<{ id: string }>, res: Response) => {
    const id = parseInt(req.params.id);
    const user= await UserModel.findById(id);

    if (!user) {
        const response: ErrorResponse = { error: 'User not found' };
        res.status(404).json(response);
        return;
    }

    const response: UserResponse = { data: user as User };
    res.json(response);
});

// 新規ユーザーの作成
router.post('/', async (req: Request<{}, {}, UserCreateRequest>, res: Response) => {
    const { name } = req.body;

    if (!name || typeof name !== 'string') {
        const response: ErrorResponse = { error: 'Invalid user data' };
        res.status(400).json(response);
        return;
    }

    const newUser = await UserModel.create(name);
    const response: UserCreatedResponse = {
        message: 'User created successfully',
        data: newUser
    };

    res.status(201).json(response);
});

export default router;