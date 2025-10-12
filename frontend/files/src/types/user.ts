export interface UserInfos {
  id: number;
  avatar: string;
  username: string;
  email: string;
  first_login: boolean;
  intra_id: number;
  online: boolean;
  twoFA_verify: boolean;
}

export interface PublicUserInfos {
  id: number;
  avatar: string;
  username: string;
  email: string;
  first_login: boolean;
  online: boolean;
}

export interface ProfileUserInfos {
  id: number;
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
