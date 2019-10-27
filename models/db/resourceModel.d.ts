import { Fields, Models, Model } from "@unicoderns/orm";
export interface Row extends Models.Row {
    id: number;
    created: number;
    name: string;
}
/**
 * User Model
 */
export declare class Resource extends Model {
    id: Fields.CommonTypes;
    created: Fields.DataTimestampType;
    name: Fields.VarCharType;
}
