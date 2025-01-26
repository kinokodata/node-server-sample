import { Product } from "../types/product/product";
import {supabase} from "../db/clilent";


export async function findAll(): Promise<Product[]> {
    const {data, error} = await supabase
        .from("products")
        .select(`
            id,
            name, 
            basePrice, 
            createdAt,
            category(id, name, description)
        `);
    if(!data) {
        return [];
    }
    console.log(data);
    const result = data.map(v => {
        return {
            category: v.category[0]
        } as Product;
    });
    return result as Product[];
}

export async function findById(id: number): Promise<Product | undefined> {
    const {data, error} = await supabase
        .from("products")
        .select(`
            id,
            name, 
            basePrice, 
            createdAt,
            category(id, name, description)
        `)
        .eq("id", id)
        .single();
    if(!data) {
        return undefined;
    }
    console.log(data);
    return {
        category: data.category[0]
    } as Product;
}

export async function create(name: string, categoryId: number, basePrice: number): Promise<Product> {
    const {data, error} = await supabase
        .from("products")
        .insert({
            name: name,
            categoryId: categoryId,
            basePrice: basePrice
        })
        .select()
        .single();
    console.log(data);
    return {
        category: data.category[0]
    } as Product;
}

export async function update(
    id: number,
    updates: { name?: string; categoryId?: number; basePrice?: number }
): Promise<Product | undefined> {
    const {data, error} = await supabase
        .from("products")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
    console.log(data);
    return {
        category: data.category[0]
    } as Product;
}

export async function deleteById(id: number): Promise<Product | undefined> {
    const {data, error} = await supabase
        .from("products")
        .delete()
        .eq("id", id)
        .select()
        .single();
    return data as Product;
}