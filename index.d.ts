import { Config } from "./interfaces/config";
import Vault from "./vault";
import Sessions from "./controllers/sessions";
import Users from "./controllers/users";
/**
 * Cerberus core
 */
export default class Cerberus {
    vault: Vault;
    sessions: Sessions;
    users: Users;
    protected config: Config;
    /**
     * Creating core object
     */
    constructor(config: Config);
}
