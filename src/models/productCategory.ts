import { ProductCategory } from "../types/product-category/productCategory";
import {supabase} from "../db/clilent";

export async function findAll(): Promise<ProductCategory[]> {
    const {data, error} = await supabase
        .from("product_categories")
        .select();

    if(error) {
        console.log(error);
        return [];
    }

    return data as ProductCategory[];
}

export async function findById(id: number): Promise<ProductCategory | undefined> {
    const {data, error} = await supabase
        .from("product_categories")
        .select()
        .eq("id", id)
        .single();

    if(error) {
        console.log(error);
        return undefined;
    }

    return data as ProductCategory;
}

export async function create(name: string, description?: string): Promise<ProductCategory> {
    const {data, error} = await supabase
        .from("product_categories")
        .insert({
            name: name,
            description: description || null
        })
        .select()
        .single();

    if(error) {
        console.log(error);
    }

    return data as ProductCategory;
}

export async function update(id: number, name?: string, description?: string): Promise<ProductCategory | undefined> {
    const updateData: { name?: string; description?: string } = {};

    if(!!name) {
        updateData.name = name;
    }
    if(!!description) {
        updateData.description = description;
    }

    const {data, error} = await supabase
        .from("product_categories")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

    if(error) {
        console.log(error);
        return undefined;
    }

    return data as ProductCategory;
}

export async function deleteById(id: number): Promise<ProductCategory | undefined> {
    const {data, error} = await supabase
        .from("product_categories")
        .delete()
        .eq("id", id)
        .select()
        .single();

    if(error) {
        console.log(error);
        return undefined;
    }

    return data as ProductCategory;
}