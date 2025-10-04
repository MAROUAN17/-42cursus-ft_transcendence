export interface LoginBody {
  id: number;
  username: string;
  confirmPassword: string;
  avatar: string;
  email: string;
  password: string;
  token: string;
  secret: string;
  rememberMe: boolean;
}

export interface UserInfos {
  id: number;
  avatar: string;
  username: string;
  email: string;
  first_login: boolean;
  intra_id: number;
  online: boolean;
}

export interface PublicUserInfos {
  avatar: string;
  username: string;
  email: string;
  first_login: boolean;
  online: boolean;
}

export interface userSearch {
  id: number;
  username: string;
  avatar: string;
  mutualsCount: number;
  status: "friend" | "sentReq" | "notFriend";
}
