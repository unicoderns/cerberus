import { Config } from "../interfaces/config";
import { Reply, Login } from "../interfaces/general";
import { Models } from "@unicoderns/orm";
import Vault from "../vault";
/**
 * Index Endpoint
 *
 * @basepath /
 * @return express.Router
 */
export default class Sessions {
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
    create: (login: Login) => Promise<Reply>;
    /**
     * Get new auth token.
     *
     * @param req { Request } The request object.
     * @param res { Response } The response object.
     * @return json
     */
    renew: (user: any) => Reply;
    /**
    * Revoke a token for a stateful session.
    *
    * @param req { Request } The request object.
    * @param res { Response } The response object.
    * @return json
    */
    revoke: (user: number) => Promise<Reply>;
    /**
     * Get all sessions.
     *
     * @param req { Request } The request object.
     * @param res { Response } The response object.
     * @return array
     */
    listAll: () => Promise<any>;
    /**
     * Get some sessions.
     *
     * @param req { Request } The request object.
     * @param res { Response } The response object.
     * @return array
     */
    listSome: (where: string | Models.KeyValue | Models.KeyValue[]) => Promise<any>;
}
