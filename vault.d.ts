import { DB } from "@unicoderns/orm";
/**
 * Cerberus vault
 */
export default class Vault {
    private DB;
    /*** Users Cache */
    protected userCache: any;
    /**
     * Creating core object
     */
    constructor(DB: DB);
    /**
     * User cache factory
     *
     * @param id {number} The user id.
     * @return Promise.
     */
    getUser: (id: number, cached?: boolean) => Promise<any>;
    /**
     * Remove user cache from factory
     *
     * @param id {number} The user id.
     * @return Promise.
     */
    removeUser: (id: number, cached?: boolean) => void;
}
