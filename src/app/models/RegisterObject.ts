import {User} from "./User";

export interface RegisterResponse {
  user: User;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
}
