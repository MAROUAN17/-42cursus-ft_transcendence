export interface User {
  id: number;
  avatar: string;
  username: string;
  email: string;
  password: string;
  secret_otp: string;
  logged_in: boolean;
  twoFA_verify: boolean;
}

export interface LoginBody {
  id: number;
  username: string;
  confirmPassword: string;
  email: string;
  password: string;
  token: string;
  secret: string;
}

export interface userInfos {
  id: number;
  email: string;
  username: string;
  avatar: string;
  online: boolean;
  logged_in: boolean;
  twoFA_verify: boolean;
}

export interface userPass {
  password: string;
}
