import { Fields, Models, Model } from "@unicoderns/orm";
export interface Row extends Models.Row {
    id?: number;
    created?: number;
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    timezone?: number;
    admin?: boolean;
    verified?: boolean;
    active?: boolean;
}
/**
 * User Model
 */
export declare class Users extends Model {
    id: Fields.CommonTypes;
    created: Fields.DataTimestampType;
    username: Fields.VarCharType;
    email: Fields.VarCharType;
    password: Fields.VarCharType;
    firstName: Fields.VarCharType;
    lastName: Fields.VarCharType;
    timezone: Fields.StaticKey;
    admin: Fields.BoolType;
    verified: Fields.BoolType;
    active: Fields.BoolType;
}
