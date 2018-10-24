import { Config } from "../interfaces/config";
import { Reply, Login } from "../interfaces/general";
import Vault from "../vault";
/**
 * Index Endpoint
 *
 * @basepath /
 * @return express.Router
 */
export default class IndexEndPoint {
    protected config: Config;
    protected vault: Vault;
    private sessionsTable;
    private unsafeUsersTable;
    private emailRegex;
    constructor(config: Config, vault: Vault);
    /**
     * Sign JWT token and reply.
     *
     * @param req { Request } The request object.
     * @param res { Response } The response object.
     * @param config { Object } The config object.
     * @param data { Object } Data to sign and create token.
     * @return json
     */
    private sign;
    /**
     * Get auth token.
     *
     * @param req { Request } The request object.
     * @param res { Response } The response object.
     * @return json
     */
    getToken: (login: Login) => Promise<Reply>;
    /**
     * Get new auth token.
     *
     * @param req { Request } The request object.
     * @param res { Response } The response object.
     * @return json
     */
    renewToken: (user: any) => Reply;
    /**
    * Revoke a token for a stateful session.
    *
    * @param req { Request } The request object.
    * @param res { Response } The response object.
    * @return json
    */
    revokeToken: (user: number) => Promise<Reply>;
}
