
export interface User {
    id: number,
    username: string,
    email: string,
    password: string,
};

export interface LoginBody {
    username: string,
    email: string,
    password: string,
}

export interface userPass {
    password : string;
}