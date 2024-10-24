export interface TwitchOAuthRevokeForm {
  client_id: string;
  token: string;
}

export interface TwitchOAuthTokenForm {
  client_id: string;
  client_secret: string;
  code: string;
  grant_type: "authorization_code";
  redirect_uri: string;
}

export interface TwitchOAuthTokenSuccess {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string[];
  token_type: "bearer";
}

export interface TwitchOAuthTokenError {
  error: string;
  message: string;
  status: number;
}

export interface TwitchOAuthValidateSuccess {
  client_id: string;
  expires_in: number;
  login: string;
  scopes: string[];
  user_id?: string;
}

export interface TwitchOAuthValidateError {
  message: string;
  status: number;
}
