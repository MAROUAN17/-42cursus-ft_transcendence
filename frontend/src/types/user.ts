export interface UserInfos
{
    id: number;
    avatar: string;
    username: string;
    email: string;
    first_login: boolean;
    intra_id: number;
    online: boolean;
}

export interface PublicUserInfos
{
    avatar: string;
    username: string;
    email: string;
    first_login: boolean;
    online: boolean;
}