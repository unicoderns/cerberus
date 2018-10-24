import { Fields, Models, Model } from "@unicoderns/orm";
export interface Row extends Models.Row {
    id?: number;
    created?: number;
    ip: string;
    user: number;
}
/**
 * User Model
 */
export declare class Sessions extends Model {
    id: Fields.CommonTypes;
    created: Fields.DataTimestampType;
    ip: Fields.VarCharType;
    user: Fields.ForeignKey;
}
