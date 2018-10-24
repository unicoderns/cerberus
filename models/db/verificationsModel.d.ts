import { Fields, Models, Model } from "@unicoderns/orm";
export interface Row extends Models.Row {
    id?: number;
    created?: number;
    token: string;
    user: number;
}
/**
 * User Model
 */
export declare class Verifications extends Model {
    id: Fields.CommonTypes;
    created: Fields.DataTimestampType;
    token: Fields.VarCharType;
    user: Fields.ForeignKey;
    getToken(id: number): Promise<string>;
}
