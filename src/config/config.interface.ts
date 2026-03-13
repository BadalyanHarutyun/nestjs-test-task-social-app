export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  name: string;
}

export interface AuthConfig {
  jwtSecret: string;
  jwtExpiresIn: string;
  bcryptSaltRounds: number;
}

export interface AppConfig {
  port: number;
  database: DatabaseConfig;
  auth: AuthConfig;
}
