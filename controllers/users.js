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
const users = __importStar(require("../models/db/usersModel"));
const responses_1 = __importDefault(require("../responses/responses"));
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
        this.hashRounds = 12;
        /**
         * Create a user.
         *
         * @param req { Request } The request object.
         * @param res { Response } The response object.
         * @return bool
         */
        this.signup = (newUser) => {
            let usersTable = this.usersTable;
            const p = new Promise((resolve, reject) => {
                this.usersTable.get({
                    where: [{ username: newUser.username }, { email: newUser.email }]
                }).then((user) => {
                    if (typeof user === "undefined") {
                        if (!this.emailRegex.test(newUser.email)) {
                            reject(responses_1.default.InvalidEmail);
                        }
                        else {
                            bcrypt.hash(newUser.password, this.hashRounds).then(function (hash) {
                                newUser.password = hash;
                                usersTable.insert(newUser).then((data) => {
                                    newUser.id = data.insertId;
                                    resolve(responses_1.default.UserCreated);
                                }).catch(err => {
                                    reject(responses_1.default.DBInsertError(err));
                                });
                            });
                        }
                    }
                    else {
                        reject(responses_1.default.UsernameOrEmailExists);
                    }
                }).catch(err => {
                    reject(responses_1.default.DBSelectError(err));
                });
            });
            return p;
        };
        /**
         * Update user password.
         *
         * @param user { number } User Id.
         * @param oldPassword { string } Existing user password.
         * @param newPassword { string } New password.
         * @param verificationPassword { string } New password verification.
         * @return bool
         */
        this.updatePassword = (user, oldPassword, newPassword, verificationPassword) => {
            const hashRounds = this.hashRounds;
            let usersTable = this.usersTable;
            const p = new Promise((resolve, reject) => {
                if ((newPassword.length >= 6) && (newPassword === verificationPassword)) {
                    this.unsafeUserTable.get({
                        where: { id: user }
                    }).then((dbUser) => {
                        bcrypt.compare(oldPassword, dbUser.password).then(function (match) {
                            if (match) {
                                usersTable.update({
                                    data: { password: bcrypt.hashSync(dbUser.password, hashRounds) },
                                    where: { id: user }
                                }).then((data) => {
                                    resolve(responses_1.default.UserUpdated);
                                }).catch(err => {
                                    reject(responses_1.default.DBUpdateError(err));
                                });
                            }
                            else {
                                reject(responses_1.default.WrongUserAndPassword);
                            }
                        });
                    }).catch(err => {
                        reject(responses_1.default.DBSelectError(err));
                    });
                }
                else {
                    reject(responses_1.default.UnacceptablePassword);
                }
            });
            return p;
        };
        this.config = config;
        this.vault = vault;
        this.usersTable = new users.Users(config.DB);
        this.unsafeUserTable = new users.Users(config.DB, "unsafe");
    }
}
exports.default = Users;
//# sourceMappingURL=users.js.map