import {Product} from "./product";

export interface ProductDeletedResponse {
    message: string;
    data: Product;
}