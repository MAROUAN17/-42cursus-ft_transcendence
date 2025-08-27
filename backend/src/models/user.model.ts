//this is the file where we define our types and interfaces
export interface User {
    id: number,
    username: string,
    email: string,
    password: string,
    secret_otp: string,
};

export interface LoginBody {
    username: string,
    email: string,
    password: string,
    token: string
}

export interface userInfos {
    id: number,
    email: string,
    username: string
}

export interface userPass {
    password : string;
}