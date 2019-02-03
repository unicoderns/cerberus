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
import { Reply, Login } from "../interfaces/general";

import { Models } from "@unicoderns/orm"

import Vault from "../vault"

let ip = require("ip");

/**
 * Index Endpoint
 * 
 * @basepath /
 * @return express.Router
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
     * Sign JWT token and reply.
     *
     * @param req { Request } The request object.
     * @param res { Response } The response object.
     * @param config { Object } The config object.
     * @param data { Object } Data to sign and create token.
     * @return json
     */
    private sign = (data: any): Reply => {
        let config = this.config;
        let token = jwt.sign(data, config.token, {
            expiresIn: config.settings.expiration
        });

        return {
            success: true,
            message: "Enjoy your token!",
            token: token
        };
    }

    /**
     * Get auth token.
     *
     * @param req { Request } The request object.
     * @param res { Response } The response object.
     * @return json
     */
    public create = (login: Login): Promise<Reply> => {
        let email = login.email;
        let password = login.password;

        let config = this.config;

        let unsafeUsersTable = this.unsafeUsersTable;
        let sessionTable = this.sessionsTable;

        let sign = this.sign;

        // Create promise
        const p: Promise<Reply> = new Promise(
            (resolve: (reply: Reply) => void, reject: (reply: Reply) => void) => {
                if (!this.emailRegex.test(email)) {
                    reject({
                        success: false,
                        message: "Invalid email address."
                    });
                } else {
                    // find the user
                    unsafeUsersTable.get({
                        where: { email: email, active: 1 }
                    }).then((user) => {
                        if (typeof user === "undefined") {
                            reject({
                                success: false,
                                message: "Authentication failed. User and password don't match."
                            });
                        } else {
                            bcrypt.compare(password, user.password).then(function (match) {
                                if (match) {
                                    // if user is found and password is right
                                    // create a token
                                    if (config.settings.session == "stateful") {
                                        let temp: sessions.Row = {
                                            ip: ip.address(),
                                            user: user.id
                                        };
                                        sessionTable.insert(temp).then((data: any) => {
                                            resolve(sign({
                                                session: data.insertId,
                                                user: user.id
                                            }));
                                        }).catch(err => {
                                            reject({
                                                success: false,
                                                message: "Session could't get created.",
                                                error: err
                                            });
                                        });
                                    } else {
                                        resolve(sign(JSON.parse(JSON.stringify(user))));
                                    }
                                } else {
                                    reject({
                                        success: false,
                                        message: "Authentication failed. User and password don't match."
                                    });
                                }
                            });
                        }
                    }).catch(err => {
                        reject({
                            success: false,
                            message: "Something went wrong.",
                            error: err
                        });
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
    public renew = (user: any): Reply => {
        // query for user here.?
        // Clean data
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
    public revoke = (user: number): Promise<Reply> => {
        let vault = this.vault;
        let config = this.config;

        // Create promise
        const p: Promise<Reply> = new Promise(
            (resolve: (reply: Reply) => void, reject: (reply: Reply) => void) => {
                if (config.settings.session == "stateful") {
                    this.sessionsTable.delete({ user: user }).then((done) => {
                        // Remove cached user
                        vault.removeUser(user);
                        resolve({
                            success: true,
                            message: "Session revoked!"
                        });
                    }).catch(err => {
                        console.error(err);
                        reject({
                            success: false,
                            message: "Something went wrong.",
                            error: err
                        });
                    });
                } else {
                    reject({
                        success: false,
                        message: "This kind of sessions can't be revoked!",
                    });
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
    public get = (token: string): Promise<Reply> => {
        let vault = this.vault;
        let config = this.config;
        let sessionsTable = this.sessionsTable;

        const p: Promise<Reply> = new Promise(
            (resolve: (reply: Reply) => void, reject: (reply: Reply) => void) => {
                if (token) {
                    // Decode token
                    jwt.verify(token, config.token, function (err: NodeJS.ErrnoException, decoded: any) {
                        if (err) {
                            reject({
                                success: false,
                                message: "Token invalid!",
                                error: err
                            })
                        } else {
                            if (config.settings.session == "stateful") {
                                sessionsTable.get({
                                    where: {
                                        id: decoded.session,
                                        user: decoded.user
                                    }
                                }).then((session: any) => {
                                    if (typeof session === "undefined") {
                                        reject({
                                            success: false,
                                            message: "No session available."
                                        })
                                    } else {
                                        vault.getUser(decoded.user).then((user: any) => {
                                            resolve({
                                                success: true,
                                                message: "User from vault.",
                                                user: user
                                            });
                                        }).catch(err => {
                                            reject({
                                                success: false,
                                                message: "Vault error.",
                                                error: err
                                            })
                                        });
                                    }
                                }).catch(err => {
                                    reject({
                                        success: false,
                                        message: "Something went wrong.",
                                        error: err
                                    })
                                });
                            } else {
                                // If everything is good, save to request for use in other routes
                                resolve({
                                    success: true,
                                    message: "Stateless user.",
                                    user: decoded
                                });
                            }
                        }
                    });
                } else {
                    reject({
                        success: false,
                        message: "No token provided.",
                    })
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
    public getUpdated = (token: string): Promise<Reply> => {
        let config = this.config;
        let vault = this.vault;

        const p: Promise<Reply> = new Promise(
            (resolve: (reply: Reply) => void, reject: (reply: Reply) => void) => {
                // Verifies secret and checks exp
                jwt.verify(token, config.token, function (err: NodeJS.ErrnoException, decoded: any) {
                    if (err) {
                        reject({
                            success: false,
                            message: "Token invalid!",
                            error: err
                        });
                    } else {
                        vault.getUser(decoded.user, false).then((user: any) => {
                            resolve({
                                success: true,
                                message: "User vault updated.",
                                user: user
                            });
                        }).catch((err: NodeJS.ErrnoException) => {
                            reject({
                                success: false,
                                message: "Vault error.",
                                error: err
                            });
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
            (resolve: (data: any) => void, reject: (reply: Reply) => void) => {
                this.sessionsTable.join([{
                    keyField: this.sessionsTable.user,
                    fields: ["username", "email", "firstName", "lastName"],
                    kind: "LEFT"
                }]).getAll({}).then((data) => {
                    resolve(data);
                }).catch(err => {
                    reject({
                        success: false,
                        message: "Something went wrong.",
                        error: err
                    });
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
            (resolve: (data: any) => void, reject: (reply: Reply) => void) => {
                this.sessionsTable.join([{
                    keyField: this.sessionsTable.user,
                    fields: ["username", "email", "firstName", "lastName"],
                    kind: "LEFT"
                }]).getSome({ where: where }).then((data) => {
                    resolve(data);
                }).catch(err => {
                    console.error(err);
                    reject({
                        success: false,
                        message: "Something went wrong.",
                        error: err
                    });
                });
            });
        return p;
    };
}