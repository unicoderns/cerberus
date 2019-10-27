import { Config } from "../interfaces/config";
import { Response } from "../interfaces/general";
import Vault from "../vault";
/**
 * Index Endpoint
 *
 * @basepath /
 * @return express.Router
 */
export default class Users {
    protected readonly config: Config;
    protected readonly vault: Vault;
    private readonly usersTable;
    private readonly unsafeUserTable;
    private readonly emailRegex;
    private readonly hashRounds;
    constructor(config: Config, vault: Vault);
    /**
     * Create a user.
     *
     * @param req { Request } The request object.
     * @param res { Response } The response object.
     * @return bool
     */
    signup: (newUser: any) => Promise<Response>;
    /**
     * Update user password.
     *
     * @param user { number } User Id.
     * @param oldPassword { string } Existing user password.
     * @param newPassword { string } New password.
     * @param verificationPassword { string } New password verification.
     * @return bool
     */
    updatePassword: (user: number, oldPassword: string, newPassword: string, verificationPassword: string) => Promise<Response>;
}
