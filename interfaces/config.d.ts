import { DB } from "@unicoderns/orm";
/*** Main configuration interface */
export interface Config {
    dev: boolean;
    token: string;
    DB: DB;
    settings: Settings;
}
export interface Settings {
    expiration: any;
    session: string;
}
