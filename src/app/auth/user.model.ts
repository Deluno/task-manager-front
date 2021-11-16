export class User {
  constructor(
    public username: string,
    public role: string,
    private _accessToken: string,
    private _refreshToken: string
  ) {}

  get accessToken() {
    return this._accessToken;
  }

  get refreshToken() {
    return this._refreshToken;
  }
}
