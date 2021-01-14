import { IPaginationOptions } from "./pagination-options";
import { IUser } from "./user.interface";

export interface IVariales {
    id?: string | number;
    genre?: string;
    user?: IUser;
    pagination?: IPaginationOptions;
}