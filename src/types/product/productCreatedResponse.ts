import {Product} from "./product";

export interface ProductCreatedResponse {
    message: string;
    data: Product;
}