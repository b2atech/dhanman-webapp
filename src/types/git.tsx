export interface IPullRequest {
  repository: string;
  id: number;
  url: string;
  html_url: string;
  state: string;
  title: string;
  created_at: Date | string | number;
  updated_at: Date | string | number;
  user: IGitUser;
}

export interface IGitUser {
  id: number;
  login: string;
}
