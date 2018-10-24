/// <reference types="node" />
/*** Main general interfaces */
export interface Reply {
    success: boolean;
    message: string;
    token?: string;
    error?: NodeJS.ErrnoException;
}
export interface Login {
    email: string;
    password: string;
}
