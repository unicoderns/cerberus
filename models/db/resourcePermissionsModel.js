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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const orm_1 = require("@unicoderns/orm");
/**
 * User Model
 */
class Resource_Permissions extends orm_1.Model {
    constructor() {
        super(...arguments);
        this.id = new orm_1.Datatypes().ID();
        this.created = new orm_1.Datatypes().TIMESTAMP({
            notNull: true,
            default: orm_1.Defaults.Timestamp.CURRENT_TIMESTAMP
        });
        this.resource = new orm_1.Datatypes().INT({
            size: 45,
            unique: true
        });
        this.user = new orm_1.Datatypes().INT({
            notNull: true
        });
    }
}
__decorate([
    orm_1.field(),
    __metadata("design:type", Object)
], Resource_Permissions.prototype, "id", void 0);
__decorate([
    orm_1.field(),
    __metadata("design:type", Object)
], Resource_Permissions.prototype, "created", void 0);
__decorate([
    orm_1.field(),
    __metadata("design:type", Object)
], Resource_Permissions.prototype, "resource", void 0);
__decorate([
    orm_1.field(),
    __metadata("design:type", Object)
], Resource_Permissions.prototype, "user", void 0);
exports.Resource_Permissions = Resource_Permissions;
//# sourceMappingURL=resourcePermissionsModel.js.map