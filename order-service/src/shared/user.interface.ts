export interface UserType {
  id: number;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserWithValidType {
  user: UserType;
  valid: boolean;
}
