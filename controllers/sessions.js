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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = __importStar(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
const users = __importStar(require("../models/db/usersModel"));
const sessions = __importStar(require("../models/db/sessionsModel"));
const responses_1 = __importDefault(require("../responses/responses"));
let ip = require("ip");
/**
 * Sessions Operations
 */
class Sessions {
    constructor(config, vault) {
        this.emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        /**
         * Sign JWT token and response.
         *
         * @param data Session and user ids.
         * @return Response
         */
        this.sign = (data) => {
            const config = this.config;
            const token = jwt.sign(data, config.token, {
                expiresIn: config.settings.expiration
            });
            return responses_1.default.TokenCreated(token);
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
                    reject(responses_1.default.InvalidEmail);
                }
                else {
                    unsafeUsersTable.get({
                        where: { email: email, active: 1 }
                    }).then((user) => {
                        if (typeof user === "undefined") {
                            reject(responses_1.default.WrongUserAndPassword);
                        }
                        else {
                            bcrypt.compare(password, user.password).then(function (match) {
                                if (match) {
                                    if (config.settings.session == "stateful") {
                                        const temp = {
                                            ip: ip.address(),
                                            user: user.id
                                        };
                                        sessionTable.insert(temp).then((data) => {
                                            resolve(sign({
                                                session: data.insertId,
                                                user: user.id
                                            }));
                                        }).catch(err => {
                                            reject(responses_1.default.SessionCreationProblem);
                                        });
                                    }
                                    else {
                                        resolve(sign(JSON.parse(JSON.stringify(user))));
                                    }
                                }
                                else {
                                    reject(responses_1.default.WrongUserAndPassword);
                                }
                            });
                        }
                    }).catch(err => {
                        reject(responses_1.default.DBSelectError(err));
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
        this.revoke = (user) => {
            let vault = this.vault;
            let config = this.config;
            // Create promise
            const p = new Promise((resolve, reject) => {
                if (config.settings.session == "stateful") {
                    this.sessionsTable.delete({ user: user }).then((done) => {
                        // Remove cached user
                        vault.removeUser(user);
                        resolve(responses_1.default.SessionRevoked);
                    }).catch(err => {
                        reject(responses_1.default.DBDeleteError(err));
                    });
                }
                else {
                    reject(responses_1.default.StatelessRevokeError);
                }
            });
            return p;
        };
        /**
         * Get context user
         *
         * @param req {Request} The request object.
         * @param res {Response} The response object.
         * @param next Callback.
         */
        this.get = (token) => {
            let vault = this.vault;
            let config = this.config;
            let sessionsTable = this.sessionsTable;
            const p = new Promise((resolve, reject) => {
                if (token) {
                    // Decode token
                    jwt.verify(token, config.token, function (err, decoded) {
                        if (err) {
                            reject(responses_1.default.InvalidToken(err));
                        }
                        else {
                            if (config.settings.session == "stateful") {
                                sessionsTable.get({
                                    where: {
                                        id: decoded.session,
                                        user: decoded.user
                                    }
                                }).then((session) => {
                                    if (typeof session === "undefined") {
                                        reject(responses_1.default.SessionNotFound);
                                    }
                                    else {
                                        vault.getUser(decoded.user).then((user) => {
                                            resolve(responses_1.default.GetUser(user));
                                        }).catch(err => {
                                            responses_1.default.VaultError(err);
                                        });
                                    }
                                }).catch(err => {
                                    reject(responses_1.default.DBSelectError(err));
                                });
                            }
                            else {
                                resolve(responses_1.default.GetUser(decoded));
                            }
                        }
                    });
                }
                else {
                    reject(responses_1.default.NoToken);
                }
            });
            return p;
        };
        /**
         * Force an update context user
         *
         * @param req {Request} The request object.
         * @param res {Response} The response object.
         * @param next Callback.
         */
        this.getUpdated = (token) => {
            let config = this.config;
            let vault = this.vault;
            const p = new Promise((resolve, reject) => {
                // Verifies secret and checks exp
                jwt.verify(token, config.token, function (err, decoded) {
                    if (err) {
                        reject(responses_1.default.InvalidToken(err));
                    }
                    else {
                        vault.getUser(decoded.user, false).then((user) => {
                            resolve(responses_1.default.UserUpdated);
                        }).catch((err) => {
                            responses_1.default.VaultError(err);
                        });
                    }
                });
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
                    reject(responses_1.default.DBSelectError(err));
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
                    reject(responses_1.default.DBSelectError(err));
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