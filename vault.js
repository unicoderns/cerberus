"use strict";
////////////////////////////////////////////////////////////////////////////////////////////
// The MIT License (MIT)                                                                  //
//                                                                                        //
// Copyright (C) 2018  Unicoderns S.A. - info@unicoderns.com - unicoderns.com             //
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
const users = __importStar(require("./models/db/usersModel"));
/**
 * Cerberus vault
 */
class Vault {
    /**
     * Creating core object
     */
    constructor(DB) {
        /**
         * User cache factory
         *
         * @param id {number} The user id.
         * @return Promise.
         */
        this.getUser = (id, cached = true) => {
            let userTable = new users.Users(this.DB);
            let userCache = this.userCache;
            function fromSQL() {
                // Create promise
                const p = new Promise((resolve, reject) => {
                    userTable.get({
                        where: { id: id }
                    }).then((user) => {
                        let userTemp = JSON.parse(JSON.stringify(user));
                        userCache[id] = userTemp;
                        resolve(userTemp);
                    }).catch(err => {
                        reject(err);
                        throw err;
                    });
                });
                return p;
            }
            if (cached) {
                let userTemp = userCache[id];
                if (typeof userTemp === "undefined") {
                    return fromSQL();
                }
                else {
                    const p = new Promise((resolve, reject) => {
                        resolve(userTemp);
                    });
                    return p;
                }
            }
            else {
                return fromSQL();
            }
        };
        /**
         * Remove user cache from factory
         *
         * @param id {number} The user id.
         * @return Promise.
         */
        this.removeUser = (id, cached = true) => {
            delete this.userCache[id];
        };
        this.DB = DB;
    }
}
exports.default = Vault;
//# sourceMappingURL=vault.js.map