import { User } from "../types/user/user";
import {supabase} from "../db/clilent"

export async function findAll(): Promise<User[]> {
    const {data, error} = await supabase
        .from('users')
        .select();
    return data as User[];
}

export async function findById(id: number): Promise<User | undefined> {
    const {data, error} = await supabase
        .from('users')
        .select()
        .eq('id', id)
        .single();
    return data as User;
}

export async function create(name: string): Promise<User> {
    const {data, error} = await supabase
        .from('users')
        .insert({
            name: name
        })
        .select()
        .single()
    return data as User;
}
