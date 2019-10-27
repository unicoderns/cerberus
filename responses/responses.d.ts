/// <reference types="node" />
import { Response } from "../interfaces/general";
/**
 * Responses
 *
 * @return Response
 */
declare class Responses {
    UserUpdated: Response;
    SessionRevoked: Response;
    GetUser: (data: string) => Response;
    UserCreated: Response;
    TokenCreated: (data: string) => Response;
    WrongUserAndPassword: Response;
    InvalidEmail: Response;
    SessionCreationProblem: Response;
    StatelessRevokeError: Response;
    InvalidToken: (err: NodeJS.ErrnoException) => Response;
    SessionNotFound: Response;
    NoToken: Response;
    UsernameOrEmailExists: Response;
    UnacceptablePassword: Response;
    DBSelectError: (err: NodeJS.ErrnoException) => Response;
    DBInsertError: (err: NodeJS.ErrnoException) => Response;
    DBUpdateError: (err: NodeJS.ErrnoException) => Response;
    DBDeleteError: (err: NodeJS.ErrnoException) => Response;
    VaultError: (err: NodeJS.ErrnoException) => Response;
}
declare const _default: Responses;
export default _default;
