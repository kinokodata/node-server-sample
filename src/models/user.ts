import { User } from "../types/user";

// メモリ上のユーザーストア
export let users: User[] = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Doe" }
];

// ユーザー操作のメソッド
export const findById = (id: number): User | undefined => {
    return users.find(u => u.id === id);
};

export const create = (name: string): User => {
    const newUser: User = {
        id: users.length + 1,
        name
    };
    users.push(newUser);
    return newUser;
};