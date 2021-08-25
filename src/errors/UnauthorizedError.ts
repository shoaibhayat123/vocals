export class UnauthorizedError extends Error{
  public status: 401 = 401;
  public statusMessage: string = "Unauthorized";
  public payload: Object | undefined;
  constructor(message?: string, payload?: Object){
    super(message);
    this.name = this.constructor.name;
    this.payload = payload;
    Error.captureStackTrace(this, this.constructor);
  }
}
