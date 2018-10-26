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
const users = __importStar(require("../models/db/usersModel"));
const sessions = __importStar(require("../models/db/sessionsModel"));
const verifications = __importStar(require("../models/db/verificationsModel"));
let ip = require("ip");
/**
 * Index Endpoint
 *
 * @basepath /
 * @return express.Router
 */
class Users {
    constructor(config, vault) {
        this.emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        /**
         * Create a user.
         *
         * @param req { Request } The request object.
         * @param res { Response } The response object.
         * @return bool
         */
        this.signup = (newUser) => {
            let usersTable = this.usersTable;
            // Create promise
            const p = new Promise((resolve, reject) => {
                this.usersTable.get({
                    where: [{ username: newUser.username }, { email: newUser.email }]
                }).then((user) => {
                    if (typeof user === "undefined") {
                        if (!this.emailRegex.test(newUser.email)) {
                            reject({
                                success: false, message: "Invalid email address."
                            });
                        }
                        else {
                            bcrypt.hash(newUser.password, 12).then(function (hash) {
                                newUser.password = hash;
                                usersTable.insert(newUser).then((data) => {
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
                    }
                    else {
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
        };
        this.config = config;
        this.vault = vault;
        this.usersTable = new users.Users(config.DB);
        this.sessionsTable = new sessions.Sessions(config.DB);
        this.verificationsTable = new verifications.Verifications(config.DB);
    }
}
exports.default = Users;
//# sourceMappingURL=users.js.map