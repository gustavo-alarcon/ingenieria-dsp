export interface User {
  createdAt: Date;
  phoneNumber?: string;
  name: string;
  picture: string;
  email: string;
  role: string;
  uid: string;
}

export interface ShortUser {
  uid: string;
  email: string;
  displayName: string;
}
