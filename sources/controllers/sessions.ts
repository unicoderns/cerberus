////////////////////////////////////////////////////////////////////////////////////////////
// The MIT License (MIT)                                                                  //
//                                                                                        //
// Copyright (C) 2016  Unicoderns SA - info@unicoderns.com - unicoderns.com               //
//                                                                                        //
// Permission is hereby granted, free of charge, to any person obtaining a copy           //
// of this software and associated documentation files (the "Software"), to deal          //
// in the Software without restriction, including without limitation the rights           //
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell              //
// copies of the Software, and to permit persons to whom the Software is                  //
// furnished to do so, subject to the following conditions:                               //
//                                                                                        //
// The above copyright notice and this permission notice shall be included in all         //
// copies or substantial portions of the Software.                                        //
//                                                                                        //
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR             //
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,               //
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE            //
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER                 //
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,          //
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE          //
// SOFTWARE.                                                                              //
////////////////////////////////////////////////////////////////////////////////////////////

import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import * as users from "../models/db/usersModel";
import * as sessions from "../models/db/sessionsModel";

import { Config } from "../interfaces/config";
import { Response, Login } from "../interfaces/general";

import { Models } from "@unicoderns/orm"

import Responses from "../responses/responses";
import Vault from "../vault"

let ip = require("ip");

/**
 * Sessions Operations
 */
export default class Sessions {
    protected config: Config;
    protected vault: Vault;

    private sessionsTable: sessions.Sessions;
    private unsafeUsersTable: users.Users;

    private emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    constructor(config: Config, vault: Vault) {
        this.config = config;
        this.vault = vault;
        this.sessionsTable = new sessions.Sessions(config.DB);
        this.unsafeUsersTable = new users.Users(config.DB, "unsafe");
    }

    /**
     * Sign JWT token and response.
     *
     * @param data Session and user ids.
     * @return Response
     */
    private sign = (data: { session: number, user: number }): Response => {
        const config = this.config;
        const token = jwt.sign(data, config.token, {
            expiresIn: config.settings.expiration
        })

        return Responses.TokenCreated(token);
    }

    /**
     * Get auth token.
     *
     * @param req { Request } The request object.
     * @param res { Response } The response object.
     * @return json
     */
    public create = (login: Login): Promise<Response> => {
        let email = login.email;
        let password = login.password;

        let config = this.config;

        let unsafeUsersTable = this.unsafeUsersTable;
        let sessionTable = this.sessionsTable;

        let sign = this.sign;

        // Create promise
        const p: Promise<Response> = new Promise(
            (resolve: (reply: Response) => void, reject: (reply: Response) => void) => {
                if (!this.emailRegex.test(email)) {
                    reject(Responses.InvalidEmail);
                } else {
                    unsafeUsersTable.get({
                        where: { email: email, active: 1 }
                    }).then((user) => {
                        if (typeof user === "undefined") {
                            reject(Responses.WrongUserAndPassword);
                        } else {
                            bcrypt.compare(password, user.password).then(function (match) {
                                if (match) {
                                    if (config.settings.session == "stateful") {
                                        const temp: sessions.Row = {
                                            ip: ip.address(),
                                            user: user.id
                                        };
                                        sessionTable.insert(temp).then((data: any) => {
                                            resolve(sign({
                                                session: data.insertId,
                                                user: user.id
                                            }));
                                        }).catch(err => {
                                            reject(Responses.SessionCreationProblem);
                                        });
                                    } else {
                                        resolve(sign(JSON.parse(JSON.stringify(user))));
                                    }
                                } else {
                                    reject(Responses.WrongUserAndPassword);
                                }
                            });
                        }
                    }).catch(err => {
                        reject(Responses.DBSelectError(err));
                    });
                };
            });
        return p;
    }

    /**
     * Get new auth token.
     *
     * @param req { Request } The request object.
     * @param res { Response } The response object.
     * @return json
     */
    public renew = (user: any): Response => {
        // Clean old data
        delete user.iat;
        delete user.exp;

        return this.sign(user);
    };

    /**
    * Revoke a token for a stateful session.
    *
    * @param req { Request } The request object.
    * @param res { Response } The response object.
    * @return json
    */
    public revoke = (user: number): Promise<Response> => {
        let vault = this.vault;
        let config = this.config;

        // Create promise
        const p: Promise<Response> = new Promise(
            (resolve: (reply: Response) => void, reject: (reply: Response) => void) => {
                if (config.settings.session == "stateful") {
                    this.sessionsTable.delete({ user: user }).then((done) => {
                        // Remove cached user
                        vault.removeUser(user);
                        resolve(Responses.SessionRevoked);
                    }).catch(err => {
                        reject(Responses.DBDeleteError(err));
                    });
                } else {
                    reject(Responses.StatelessRevokeError);
                }
            });
        return p;
    }

    /**
     * Get context user
     * 
     * @param req {Request} The request object.
     * @param res {Response} The response object.
     * @param next Callback.
     */
    public get = (token: string): Promise<Response> => {
        let vault = this.vault;
        let config = this.config;
        let sessionsTable = this.sessionsTable;

        const p: Promise<Response> = new Promise(
            (resolve: (reply: Response) => void, reject: (reply: Response) => void) => {
                if (token) {
                    // Decode token
                    jwt.verify(token, config.token, function (err: NodeJS.ErrnoException, decoded: any) {
                        if (err) {
                            reject(Responses.InvalidToken(err))
                        } else {
                            if (config.settings.session == "stateful") {
                                sessionsTable.get({
                                    where: {
                                        id: decoded.session,
                                        user: decoded.user
                                    }
                                }).then((session: any) => {
                                    if (typeof session === "undefined") {
                                        reject(Responses.SessionNotFound)
                                    } else {
                                        vault.getUser(decoded.user).then((user: any) => {
                                            resolve(Responses.GetUser(user));
                                        }).catch(err => {
                                            Responses.VaultError(err)
                                        });
                                    }
                                }).catch(err => {
                                    reject(Responses.DBSelectError(err))
                                });
                            } else {
                                resolve(Responses.GetUser(decoded));
                            }
                        }
                    });
                } else {
                    reject(Responses.NoToken)
                }
            });
        return p;
    }

    /**
     * Force an update context user
     * 
     * @param req {Request} The request object.
     * @param res {Response} The response object.
     * @param next Callback.
     */
    public getUpdated = (token: string): Promise<Response> => {
        let config = this.config;
        let vault = this.vault;

        const p: Promise<Response> = new Promise(
            (resolve: (reply: Response) => void, reject: (reply: Response) => void) => {
                // Verifies secret and checks exp
                jwt.verify(token, config.token, function (err: NodeJS.ErrnoException, decoded: any) {
                    if (err) {
                        reject(Responses.InvalidToken(err));
                    } else {
                        vault.getUser(decoded.user, false).then((user: any) => {
                            resolve(Responses.UserUpdated);
                        }).catch((err: NodeJS.ErrnoException) => {
                            Responses.VaultError(err)
                        });
                    }
                });
            });
        return p;
    }

    /**
     * Get all sessions.
     *
     * @param req { Request } The request object.
     * @param res { Response } The response object.
     * @return array
     */
    public listAll = (): Promise<any> => {
        // Create promise
        const p: Promise<any> = new Promise(
            (resolve: (data: any) => void, reject: (reply: Response) => void) => {
                this.sessionsTable.join([{
                    keyField: this.sessionsTable.user,
                    fields: ["username", "email", "firstName", "lastName"],
                    kind: "LEFT"
                }]).getAll({}).then((data) => {
                    resolve(data);
                }).catch(err => {
                    reject(Responses.DBSelectError(err));
                });
            });
        return p;
    };

    /**
     * Get some sessions.
     *
     * @param req { Request } The request object.
     * @param res { Response } The response object.
     * @return array
     */
    public listSome = (where: string | Models.KeyValue | Models.KeyValue[]): Promise<any> => {
        // Create promise
        const p: Promise<any> = new Promise(
            (resolve: (data: any) => void, reject: (reply: Response) => void) => {
                this.sessionsTable.join([{
                    keyField: this.sessionsTable.user,
                    fields: ["username", "email", "firstName", "lastName"],
                    kind: "LEFT"
                }]).getSome({ where: where }).then((data) => {
                    resolve(data);
                }).catch(err => {
                    reject(Responses.DBSelectError(err));
                });
            });
        return p;
    };
}