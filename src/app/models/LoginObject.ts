import {User} from "./User";

export interface LoginResponse {
  status: EMLoginResponseStatus;
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export enum EMLoginResponseStatus {
  LOGIN_SUCCESS = "LOGIN_SUCCESS",
  USER_NOT_FOUND = "USER_NOT_FOUND"
}
