import express, { Request, Response } from 'express';
import * as UserModel from '../models/user';
import {UserResponse} from "../types/userResponse";
import {ErrorResponse} from "../types/errorResponse";
import {UserCreatedResponse} from "../types/userCreatedResponse";
import {CreateUserRequest} from "../types/createUserRequest";
import {UsersResponse} from "../types/usersResponse";
import {User} from "../types/user";

const router = express.Router();

// ユーザー一覧の取得
router.get('/', (req: Request, res: Response) => {
    const response: UsersResponse = { data: UserModel.users };
    res.json(response);
});

// 特定のユーザーの取得
router.get('/:id', (req: Request<{ id: string }>, res: Response) => {
    const id = parseInt(req.params.id);
    const user= UserModel.findById(id);

    if (!user) {
        const response: ErrorResponse = { error: 'User not found' };
        res.status(404).json(response);
    }

    const response: UserResponse = { data: user as User };
    res.json(response);
});

// 新規ユーザーの作成
router.post('/', (req: Request<{}, {}, CreateUserRequest>, res: Response) => {
    const { name } = req.body;

    if (!name || typeof name !== 'string') {
        const response: ErrorResponse = { error: 'Invalid user data' };
        res.status(400).json(response);
    }

    const newUser = UserModel.create(name);
    const response: UserCreatedResponse = {
        message: 'User created successfully',
        data: newUser
    };

    res.status(201).json(response);
});

export default router;