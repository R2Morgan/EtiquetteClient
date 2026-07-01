export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  profilePicture: string;
  membershipType: number;
  membershipRenewed: Date;
  isActiveMember: boolean;
  isAdmin: boolean;
}
