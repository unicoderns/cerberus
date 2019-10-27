/// <reference types="node" />
/*** Main general interfaces */
export interface Response {
    success: boolean;
    status: number;
    message: string;
    data?: any;
    err?: NodeJS.ErrnoException;
}
export interface Login {
    email: string;
    password: string;
}
