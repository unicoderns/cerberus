"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Messages;
(function (Messages) {
    Messages["UserUpdated"] = "User updated!";
    Messages["SessionRevoked"] = "Session revoked!";
    Messages["GetUser"] = "Enjoy your user!";
    Messages["UserCreated"] = "User created!";
    Messages["TokenCreated"] = "Enjoy your token!";
    Messages["WrongUserAndPassword"] = "Authentication failed. User and password don't match.";
    Messages["InvalidEmail"] = "Invalid email address.";
    Messages["SessionCreationProblem"] = "Session could't be created.";
    Messages["StatelessRevokeError"] = "This kind of sessions can't be revoked.";
    Messages["InvalidToken"] = "Invalid token.";
    Messages["SessionNotFound"] = "Session not found.";
    Messages["NoToken"] = "No token provided.";
    Messages["UsernameOrEmailExists"] = "Username or email already exists.";
    Messages["UnacceptablePassword"] = "Password should be at least 6 characters long, and match with verification.";
    Messages["DBSelectError"] = "Database information retrieval failed.";
    Messages["DBInsertError"] = "Database insert failed.";
    Messages["DBUpdateError"] = "Database update failed.";
    Messages["DBDeleteError"] = "Database delete failed.";
    Messages["VaultError"] = "Vault information retrieval failed.";
})(Messages || (Messages = {}));
/**
 * Responses
 *
 * @return Response
 */
class Responses {
    constructor() {
        // 200 >
        this.UserUpdated = {
            success: true,
            status: 200,
            message: Messages.UserUpdated
        };
        this.SessionRevoked = {
            success: true,
            status: 200,
            message: Messages.SessionRevoked
        };
        this.GetUser = (data) => {
            return {
                success: true,
                status: 200,
                message: Messages.GetUser,
                data: data
            };
        };
        // 201 >
        this.UserCreated = {
            success: true,
            status: 201,
            message: Messages.UserCreated
        };
        this.TokenCreated = (data) => {
            return {
                success: true,
                status: 201,
                message: Messages.TokenCreated,
                data: data
            };
        };
        // 401 >
        this.WrongUserAndPassword = {
            success: false,
            status: 401,
            message: Messages.WrongUserAndPassword
        };
        // 403 >
        this.InvalidEmail = {
            success: false,
            status: 403,
            message: Messages.InvalidEmail
        };
        this.SessionCreationProblem = {
            success: false,
            status: 403,
            message: Messages.SessionCreationProblem
        };
        this.StatelessRevokeError = {
            success: false,
            status: 403,
            message: Messages.StatelessRevokeError
        };
        this.InvalidToken = (err) => {
            return {
                success: false,
                status: 401,
                message: Messages.InvalidToken,
                err: err
            };
        };
        // 404 >
        this.SessionNotFound = {
            success: false,
            status: 403,
            message: Messages.SessionNotFound
        };
        this.NoToken = {
            success: false,
            status: 404,
            message: Messages.NoToken
        };
        // 409 >
        this.UsernameOrEmailExists = {
            success: false,
            status: 409,
            message: Messages.UsernameOrEmailExists
        };
        this.UnacceptablePassword = {
            success: false,
            status: 409,
            message: Messages.UnacceptablePassword
        };
        // 500 >
        this.DBSelectError = (err) => {
            return {
                success: false,
                status: 500,
                message: Messages.DBSelectError,
                err: err
            };
        };
        this.DBInsertError = (err) => {
            return {
                success: false,
                status: 500,
                message: Messages.DBInsertError,
                err: err
            };
        };
        this.DBUpdateError = (err) => {
            return {
                success: false,
                status: 500,
                message: Messages.DBUpdateError,
                err: err
            };
        };
        this.DBDeleteError = (err) => {
            return {
                success: false,
                status: 500,
                message: Messages.DBDeleteError,
                err: err
            };
        };
        this.VaultError = (err) => {
            return {
                success: false,
                status: 404,
                message: Messages.VaultError
            };
        };
    }
}
exports.default = new Responses();
//# sourceMappingURL=responses.js.map