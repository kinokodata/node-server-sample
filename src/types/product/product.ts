import {ProductCategory} from "../product-category/productCategory";

export interface Product {
    id: number;                 // 商品ID
    name: string;               // 商品名
    category: ProductCategory;  // 商品カテゴリの情報
    basePrice: number;          // 価格
    createdAt: Date;            // 作成日
}
