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

import * as users from "./models/db/usersModel";

import { DB } from "@unicoderns/orm";

/**
 * Cerberus vault
 */
export default class Vault {

    private DB: DB;

    /*** Users Cache */
    protected userCache: any;

    /**
     * Creating core object
     */
    constructor(DB: DB) {
        this.DB = DB;
        this.userCache = {};
    }


    /**
     * User cache factory
     * 
     * @param id {number} The user id.
     * @return Promise.
     */
    public getUser = (id: number, cached: boolean = true): Promise<any> => {
        let userTable = new users.Users(this.DB);
        let userCache = this.userCache;
        function fromSQL() {
            // Create promise
            const p: Promise<any> = new Promise(
                (resolve: (data: any) => void, reject: (err: NodeJS.ErrnoException) => void) => {
                    userTable.get({
                        where: { id: id }
                    }).then((user: any) => {
                        let userTemp = JSON.parse(JSON.stringify(user));
                        userCache[id] = userTemp;
                        resolve(userTemp);
                    }).catch(err => {
                        reject(err);
                        throw err;
                    });
                }
            );
            return p;
        }

        if (cached) {
            let userTemp = userCache[id];

            if (typeof userTemp === "undefined") {
                return fromSQL();
            } else {
                const p: Promise<any> = new Promise(
                    (resolve: (data: any) => void, reject: (err: NodeJS.ErrnoException) => void) => {
                        resolve(userTemp);
                    }
                );
                return p;
            }
        } else {
            return fromSQL();
        }
    }

    /**
     * Remove user cache from factory
     * 
     * @param id {number} The user id.
     * @return Promise.
     */
    public removeUser = (id: number, cached: boolean = true): void => {
        delete this.userCache[id];
    }

}