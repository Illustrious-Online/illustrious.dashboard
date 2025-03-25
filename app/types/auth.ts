export interface UserDetails {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  role: string;
  // Add any other user fields you need
}

export interface Session {
  user: UserDetails;
  accessToken: string;
}
