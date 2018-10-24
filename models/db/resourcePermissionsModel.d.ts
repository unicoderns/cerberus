import { Fields, Model } from "@unicoderns/orm";
export interface Row {
    id?: number;
    created?: number;
    resource: number;
    user: number;
}
/**
 * User Model
 */
export declare class Resource_Permissions extends Model {
    id: Fields.CommonTypes;
    created: Fields.DataTimestampType;
    resource: Fields.CommonTypes;
    user: Fields.CommonTypes;
}
