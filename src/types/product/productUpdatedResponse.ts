import {Product} from "./product";

export interface ProductUpdatedResponse {
    message: string;
    data: Product;
}