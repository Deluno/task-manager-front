export class User {
  constructor(
    public username: string,
    private _role: string,
    public email?: string,
    private _password?: string
  ) {}

  get role() {
    return this._role;
  }

  get password() {
    return this._password;
  }
}
