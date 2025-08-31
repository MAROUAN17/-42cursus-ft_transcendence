
export interface User {
    id: number,
    username: string,
    email: string,
    password: string,
    secret_otp: string,
    twoFA_flag: boolean
};

export interface LoginBody {
    id: number,
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