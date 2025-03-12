export interface SignIn {
  email: string;
  otp: number;
}

export interface SignUp {
  email: string;
  name: string;
}

export interface GoogleSignUp {
  idToken: string;
}

export interface GoogleSignIn {
  idToken: string;
}
