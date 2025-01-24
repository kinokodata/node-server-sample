import {User} from "./user";

export interface UserCreatedResponse {
    message: string;
    data: User;
}