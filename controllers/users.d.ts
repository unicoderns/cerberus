import { Config } from "../interfaces/config";
import { Reply } from "../interfaces/general";
import Vault from "../vault";
/**
 * Index Endpoint
 *
 * @basepath /
 * @return express.Router
 */
export default class Users {
    protected config: Config;
    protected vault: Vault;
    private usersTable;
    private sessionsTable;
    private verificationsTable;
    private emailRegex;
    constructor(config: Config, vault: Vault);
    /**
     * Create a user.
     *
     * @param req { Request } The request object.
     * @param res { Response } The response object.
     * @return bool
     */
    signup: (newUser: any) => Promise<Reply>;
}
