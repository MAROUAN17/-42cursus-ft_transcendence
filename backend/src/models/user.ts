//this is the file where we define our types and interfaces
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