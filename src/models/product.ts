import { Product } from "../types/product/product";
import {supabase} from "../db/clilent";

export async function findAll(): Promise<Product[]> {
    const {data, error} = await supabase
        .from("products")
        .select(`
            *,
            product_categories(*)
        `);

    if(error) {
        console.log(error);
        return [];
    }

    if(!data) {
        return [];
    }

    return data.map(v => {
        return {
            id: v.id,
            name: v.name,
            basePrice: v.base_price,
            createdAt: v.created_at,
            category: v.product_categories
        } as Product;
    });
}

export async function findById(id: number): Promise<Product | undefined> {
    const {data, error} = await supabase
        .from("products")
        .select(`
            *,
            product_categories(*)
        `)
        .eq("id", id)
        .single();

    if(error) {
        console.log(error);
        return undefined;
    }

    return {
        id: data.id,
        name: data.name,
        basePrice: data.base_price,
        createdAt: data.created_at,
        category: data.product_categories
    } as Product;
}

export async function create(name: string, categoryId: number, basePrice: number): Promise<Product | undefined> {
    const {data, error} = await supabase
        .from("products")
        .insert({
            name: name,
            category_id: categoryId,
            base_price: basePrice
        })
        .select(`
            *,
            product_categories(*)
        `)
        .single();

    if(error) {
        console.log(error);
        return undefined;
    }

    return {
        id: data.id,
        name: data.name,
        basePrice: data.base_price,
        createdAt: data.created_at,
        category: data.product_categories
    } as Product;
}

export async function update(
    id: number,
    updates: { name?: string; categoryId?: number; basePrice?: number }
): Promise<Product | undefined> {
    const updatesSnakeCase = {
        name: updates.name,
        category_id: updates.categoryId,
        base_price: updates.basePrice
    };

    const {data, error} = await supabase
        .from("products")
        .update(updatesSnakeCase)
        .eq("id", id)
        .select(`
            *,
            product_categories(*)
        `)
        .single();

    if(error) {
        console.log(error);
        return undefined;
    }

    return {
        id: data.id,
        name: data.name,
        basePrice: data.base_price,
        createdAt: data.created_at,
        category: data.product_categories
    } as Product;
}

export async function deleteById(id: number): Promise<Product | undefined> {
    const {data, error} = await supabase
        .from("products")
        .delete()
        .eq("id", id)
        .select(`
            *,
            product_categories(*)
        `)
        .single();

    if(error) {
        console.log(error);
        return undefined;
    }

    return {
        id: data.id,
        name: data.name,
        basePrice: data.base_price,
        createdAt: data.created_at,
        category: data.product_categories
    } as Product;
}