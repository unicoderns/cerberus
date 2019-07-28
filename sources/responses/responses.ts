import { Response } from "../interfaces/general";

enum Messages {
    UserUpdated = "User updated!",
    SessionRevoked = "Session revoked!",
    GetUser = "Enjoy your user!",
    UserCreated = "User created!",
    TokenCreated = "Enjoy your token!",
    WrongUserAndPassword = "Authentication failed. User and password don't match.",
    InvalidEmail = "Invalid email address.",
    SessionCreationProblem = "Session could't be created.",
    StatelessRevokeError = "This kind of sessions can't be revoked.",
    InvalidToken = "Invalid token.",
    SessionNotFound = "Session not found.",
    NoToken = "No token provided.",
    UsernameOrEmailExists = "Username or email already exists.",
    UnacceptablePassword = "Password should be at least 6 characters long, and match with verification.",
    DBSelectError = "Database information retrieval failed.",
    DBInsertError = "Database insert failed.",
    DBUpdateError = "Database update failed.",
    DBDeleteError = "Database delete failed.",
    VaultError = "Vault information retrieval failed."
}


/**
 * Responses
 * 
 * @return Response
 */
class Responses {

    // 200 >

    public UserUpdated: Response = {
        success: true,
        status: 200,
        message: Messages.UserUpdated
    }

    public SessionRevoked: Response = {
        success: true,
        status: 200,
        message: Messages.SessionRevoked
    }

    public GetUser = (data: string): Response => {
        return {
            success: true,
            status: 200,
            message: Messages.GetUser,
            data: data
        }
    }

    // 201 >

    public UserCreated: Response = {
        success: true,
        status: 201,
        message: Messages.UserCreated
    }

    public TokenCreated = (data: string): Response => {
        return {
            success: true,
            status: 201,
            message: Messages.TokenCreated,
            data: data
        }
    }

    // 401 >

    public WrongUserAndPassword: Response = {
        success: false,
        status: 401,
        message: Messages.WrongUserAndPassword
    }

    // 403 >

    public InvalidEmail: Response = {
        success: false,
        status: 403,
        message: Messages.InvalidEmail
    }

    public SessionCreationProblem: Response = {
        success: false,
        status: 403,
        message: Messages.SessionCreationProblem
    }

    public StatelessRevokeError: Response = {
        success: false,
        status: 403,
        message: Messages.StatelessRevokeError
    }

    public InvalidToken = (err: NodeJS.ErrnoException): Response => {
        return {
            success: false,
            status: 401,
            message: Messages.InvalidToken,
            err: err
        }
    }

    // 404 >

    public SessionNotFound: Response = {
        success: false,
        status: 403,
        message: Messages.SessionNotFound
    }

    public NoToken: Response = {
        success: false,
        status: 404,
        message: Messages.NoToken
    }

    // 409 >

    public UsernameOrEmailExists: Response = {
        success: false,
        status: 409,
        message: Messages.UsernameOrEmailExists
    }

    public UnacceptablePassword: Response = {
        success: false,
        status: 409,
        message: Messages.UnacceptablePassword
    }

    // 500 >

    public DBSelectError = (err: NodeJS.ErrnoException): Response => {
        return {
            success: false,
            status: 500,
            message: Messages.DBSelectError,
            err: err
        }
    }

    public DBInsertError = (err: NodeJS.ErrnoException): Response => {
        return {
            success: false,
            status: 500,
            message: Messages.DBInsertError,
            err: err
        }
    }

    public DBUpdateError = (err: NodeJS.ErrnoException): Response => {
        return {
            success: false,
            status: 500,
            message: Messages.DBUpdateError,
            err: err
        }
    }

    public DBDeleteError = (err: NodeJS.ErrnoException): Response => {
        return {
            success: false,
            status: 500,
            message: Messages.DBDeleteError,
            err: err
        }
    }

    public VaultError = (err: NodeJS.ErrnoException): Response => {
        return {
            success: false,
            status: 404,
            message: Messages.VaultError
        }
    }

}

export default new Responses();