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


import * as bcrypt from "bcryptjs";
import * as users from "../models/db/usersModel";

import { Config } from "../interfaces/config";
import { Response } from "../interfaces/general";

import Responses from "../responses/responses";
import Vault from "../vault"

let ip = require("ip");

/**
 * Index Endpoint
 * 
 * @basepath /
 * @return express.Router
 */
export default class Users {
    protected readonly config: Config;
    protected readonly vault: Vault;

    private readonly usersTable: users.Users;
    private readonly unsafeUserTable: users.Users;

    private readonly emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    private readonly hashRounds: number = 12;

    constructor(config: Config, vault: Vault) {
        this.config = config;
        this.vault = vault;
        this.usersTable = new users.Users(config.DB);
        this.unsafeUserTable = new users.Users(config.DB, "unsafe");
    }

    /**
     * Create a user.
     *
     * @param req { Request } The request object.
     * @param res { Response } The response object.
     * @return bool
     */
    public signup = (newUser: any): Promise<Response> => {
        let usersTable = this.usersTable;
        const p: Promise<Response> = new Promise(
            (resolve: (reply: Response) => void, reject: (reply: Response) => void) => {

                this.usersTable.get({
                    where: [{ username: newUser.username }, { email: newUser.email }]
                }).then((user) => {
                    if (typeof user === "undefined") {
                        if (!this.emailRegex.test(newUser.email)) {
                            reject(Responses.InvalidEmail);
                        } else {
                            bcrypt.hash(newUser.password, this.hashRounds).then(function (hash: string) {
                                newUser.password = hash;
                                usersTable.insert(newUser).then((data: any) => {
                                    newUser.id = data.insertId;
                                    resolve(Responses.UserCreated);
                                }).catch(err => {
                                    reject(Responses.DBInsertError(err));
                                });
                            });
                        }
                    } else {
                        reject(Responses.UsernameOrEmailExists);
                    }
                }).catch(err => {
                    reject(Responses.DBSelectError(err));
                });
            });
        return p;
    }

    /**
     * Update user password.
     *
     * @param user { number } User Id.
     * @param oldPassword { string } Existing user password.
     * @param newPassword { string } New password.
     * @param verificationPassword { string } New password verification.
     * @return bool
     */
    public updatePassword = (user: number, oldPassword: string, newPassword: string, verificationPassword: string): Promise<Response> => {
        const hashRounds = this.hashRounds;
        let usersTable = this.usersTable;

        const p: Promise<Response> = new Promise(
            (resolve: (reply: Response) => void, reject: (reply: Response) => void) => {

                if ((newPassword.length >= 6) && (newPassword === verificationPassword)) {
                    this.unsafeUserTable.get({
                        where: { id: user }
                    }).then((dbUser: any) => {
                        bcrypt.compare(oldPassword, dbUser.password).then(function (match) {
                            if (match) {
                                usersTable.update({
                                    data: { password: bcrypt.hashSync(dbUser.password, hashRounds) },
                                    where: { id: user }
                                }).then((data) => {
                                    resolve(Responses.UserUpdated);
                                }).catch(err => {
                                    reject(Responses.DBUpdateError(err));
                                });
                            } else {
                                reject(Responses.WrongUserAndPassword);
                            }
                        });
                    }).catch(err => {
                        reject(Responses.DBSelectError(err));
                    });
                } else {
                    reject(Responses.UnacceptablePassword);
                }
            });
        return p;
    };

}
