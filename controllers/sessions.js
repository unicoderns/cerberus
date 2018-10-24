"use strict";
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = __importStar(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const users = __importStar(require("../models/db/usersModel"));
const sessions = __importStar(require("../models/db/sessionsModel"));
let ip = require("ip");
/**
 * Index Endpoint
 *
 * @basepath /
 * @return express.Router
 */
class Sessions {
    constructor(config, vault) {
        this.emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        /**
         * Sign JWT token and reply.
         *
         * @param req { Request } The request object.
         * @param res { Response } The response object.
         * @param config { Object } The config object.
         * @param data { Object } Data to sign and create token.
         * @return json
         */
        this.sign = (data) => {
            let config = this.config;
            let token = jwt.sign(data, config.token, {
                expiresIn: config.settings.expiration // 5 years
            });
            return {
                success: true,
                message: "Enjoy your token!",
                token: token
            };
        };
        /**
         * Get auth token.
         *
         * @param req { Request } The request object.
         * @param res { Response } The response object.
         * @return json
         */
        this.create = (login) => {
            let email = login.email;
            let password = login.password;
            let config = this.config;
            let unsafeUsersTable = this.unsafeUsersTable;
            let sessionTable = this.sessionsTable;
            let sign = this.sign;
            // Create promise
            const p = new Promise((resolve, reject) => {
                if (!this.emailRegex.test(email)) {
                    reject({
                        success: false,
                        message: "Invalid email address."
                    });
                }
                else {
                    // find the user
                    unsafeUsersTable.get({
                        where: { email: email, active: 1 }
                    }).then((user) => {
                        if (typeof user === "undefined") {
                            reject({
                                success: false,
                                message: "Authentication failed. User and password don't match."
                            });
                        }
                        else {
                            bcrypt.compare(password, user.password).then(function (match) {
                                if (match) {
                                    // if user is found and password is right
                                    // create a token
                                    if (config.settings.session == "stateful") {
                                        let temp = {
                                            ip: ip.address(),
                                            user: user.id
                                        };
                                        sessionTable.insert(temp).then((data) => {
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
                                    }
                                    else {
                                        resolve(sign(JSON.parse(JSON.stringify(user))));
                                    }
                                }
                                else {
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
                }
                ;
            });
            return p;
        };
        /**
         * Get new auth token.
         *
         * @param req { Request } The request object.
         * @param res { Response } The response object.
         * @return json
         */
        this.renew = (user) => {
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
        this.revoke = (user) => {
            let vault = this.vault;
            let config = this.config;
            // Create promise
            const p = new Promise((resolve, reject) => {
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
                }
                else {
                    reject({
                        success: false,
                        message: "This kind of sessions can't be revoked!",
                    });
                }
            });
            return p;
        };
        /**
         * Get all sessions.
         *
         * @param req { Request } The request object.
         * @param res { Response } The response object.
         * @return array
         */
        this.listAll = () => {
            // Create promise
            const p = new Promise((resolve, reject) => {
                this.sessionsTable.join([{
                        keyField: this.sessionsTable.user,
                        fields: ["username", "email", "firstName", "lastName"],
                        kind: "LEFT"
                    }]).getAll({}).then((data) => {
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
        /**
         * Get some sessions.
         *
         * @param req { Request } The request object.
         * @param res { Response } The response object.
         * @return array
         */
        this.listSome = (where) => {
            // Create promise
            const p = new Promise((resolve, reject) => {
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
        this.config = config;
        this.vault = vault;
        this.sessionsTable = new sessions.Sessions(config.DB);
        this.unsafeUsersTable = new users.Users(config.DB, "unsafe");
    }
}
exports.default = Sessions;
//# sourceMappingURL=sessions.js.map