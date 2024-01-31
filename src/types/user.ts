export interface userDetails {
  id: string;
  name: string;
  email: string;
  doj: string;
  aadhar: string;
  pan: string;
  position: string;
  role: string;
  image: string;
}
export interface editUserDetails {
  id: string;
  name: string;
  email: string;
  doj: string;
  aadhar: string;
  pan: string;
  position: string;
  image: string;
  role: string;
}

export interface loginResponse {
  name: string;
  role: string;
  userId: string;
  email: string;
  token: string;
}

export interface userLogin {
  email: string;
  password: string;
}
