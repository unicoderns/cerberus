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
import * as users from "../models/db/usersModel";
import * as sessions from "../models/db/sessionsModel";
import * as verifications from "../models/db/verificationsModel";

import { Config } from "../interfaces/config";
import { Reply } from "../interfaces/general";

import Vault from "../vault"

let ip = require("ip");

/**
 * Index Endpoint
 * 
 * @basepath /
 * @return express.Router
 */
export default class Users {
    protected config: Config;
    protected vault: Vault;

    private usersTable: users.Users;
    private sessionsTable: sessions.Sessions;
    private verificationsTable: verifications.Verifications;
    private emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    constructor(config: Config, vault: Vault) {
        this.config = config;
        this.vault = vault;
        this.usersTable = new users.Users(config.DB);
        this.sessionsTable = new sessions.Sessions(config.DB);
        this.verificationsTable = new verifications.Verifications(config.DB);
    }

    /**
     * Create a user.
     *
     * @param req { Request } The request object.
     * @param res { Response } The response object.
     * @return bool
     */
    public signup = (newUser: any): Promise<Reply> => {
        let usersTable = this.usersTable;
        // Create promise
        const p: Promise<Reply> = new Promise(
            (resolve: (reply: Reply) => void, reject: (reply: Reply) => void) => {

                this.usersTable.get({
                    where: [{ username: newUser.username }, { email: newUser.email }]
                }).then((user) => {
                    if (typeof user === "undefined") {
                        if (!this.emailRegex.test(newUser.email)) {
                            reject({
                                success: false, message: "Invalid email address."
                            });
                        } else {
                            bcrypt.hash(newUser.password, 12).then(function (hash: string) {
                                newUser.password = hash;
                                usersTable.insert(newUser).then((data: any) => {
                                    resolve({
                                        success: true,
                                        message: "User created!"
                                    });
                                }).catch(err => {
                                    reject({
                                        success: false,
                                        message: "Something went wrong.",
                                        error: err
                                    });
                                });
                            });
                        }
                    } else {
                        reject({
                            success: false,
                            message: "Username or email already exists."
                        });
                    }
                }).catch(err => {
                    reject({
                        success: false,
                        message: "Something went wrong.",
                        error: err
                    });
                });
            });
        return p;
    }

}
