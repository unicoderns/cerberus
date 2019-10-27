import { Config } from "../interfaces/config";
import { Response, Login } from "../interfaces/general";
import { Models } from "@unicoderns/orm";
import Vault from "../vault";
/**
 * Sessions Operations
 */
export default class Sessions {
    protected config: Config;
    protected vault: Vault;
    private sessionsTable;
    private unsafeUsersTable;
    private emailRegex;
    constructor(config: Config, vault: Vault);
    /**
     * Sign JWT token and response.
     *
     * @param data Session and user ids.
     * @return Response
     */
    private sign;
    /**
     * Get auth token.
     *
     * @param req { Request } The request object.
     * @param res { Response } The response object.
     * @return json
     */
    create: (login: Login) => Promise<Response>;
    /**
     * Get new auth token.
     *
     * @param req { Request } The request object.
     * @param res { Response } The response object.
     * @return json
     */
    renew: (user: any) => Response;
    /**
    * Revoke a token for a stateful session.
    *
    * @param req { Request } The request object.
    * @param res { Response } The response object.
    * @return json
    */
    revoke: (user: number) => Promise<Response>;
    /**
     * Get context user
     *
     * @param req {Request} The request object.
     * @param res {Response} The response object.
     * @param next Callback.
     */
    get: (token: string) => Promise<Response>;
    /**
     * Force an update context user
     *
     * @param req {Request} The request object.
     * @param res {Response} The response object.
     * @param next Callback.
     */
    getUpdated: (token: string) => Promise<Response>;
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
