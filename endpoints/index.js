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
/*

import * as users from "@unicoderns/cerberus/db/usersModel";
import * as sessions from "@unicoderns/cerberus/db/sessionsModel";
import * as verifications from "@unicoderns/cerberus/db/verificationsModel";

let ip = require("ip");
let bcrypt = require("bcrypt-nodejs");
// import * as bcrypt from "bcrypt-nodejs"; <- Doesn't work
*/
/**
 * Index Endpoint
 *
 * @basepath /
 * @return express.Router
 */
/*
export default class IndexEndPoint {
    private usersTable: users.Users;
    private sessionsTable: sessions.Sessions;
    private verificationsTable: verifications.Verifications;
    private sessionsMiddleware: Sessions;
    private emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    constructor(jsloth: JSloth, config: any, url: string, namespaces: string[]) {

        this.usersTable = new users.Users(jsloth.db);
        this.sessionsTable = new sessions.Sessions(jsloth.db);
        this.verificationsTable = new verifications.Verifications(jsloth.db);

        this.sessionsMiddleware = new Sessions(jsloth)
    }
*/
/**
 * Create a user.
 *
 * @param req { Request } The request object.
 * @param res { Response } The response object.
 * @return bool
 */
/*
private signup = (req: Request, res: Response): void => {
    let username: string = req.body.username;
    let email: string = req.body.email;

    this.usersTable.get({
        where: [{ username: username }, { email: email }]
    }).then((user) => {
        if (typeof user === "undefined") {
            if (!this.emailRegex.test(email)) {
                res.json({ success: false, message: "Invalid email address." });
            } else {
                let temp: users.Row = {
                    username: req.body.username,
                    email: email,
                    password: bcrypt.hashSync(req.body.password, null, null),
                    salt: "",
                    firstName: req.body.firstName,
                    lastName: req.body.lastName
                };
                this.usersTable.insert(temp).then((data: any) => {
                    res.json({
                        success: true,
                        message: "User created!"
                    });
                }).catch(err => {
                    console.error(err);
                    return res.status(500).send({
                        success: false,
                        message: "Something went wrong."
                    });
                });
            }
        } else {
            res.json({ success: false, message: "Username or email already exists." });
        }
    }).catch(err => {
        console.error(err);
        return res.status(500).send({
            success: false,
            message: "Something went wrong."
        });
    });

};
}
*/
//# sourceMappingURL=index.js.map