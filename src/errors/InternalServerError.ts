export class InternalServerError extends Error{
  public status: 500 = 500;
  public statusMessage: string = "Internal server error";
  public payload: Object | undefined;
  constructor(message?: string, payload?: Object){
    super(message);
    this.name = this.constructor.name;
    this.payload = payload;
    Error.captureStackTrace(this, this.constructor);
  }
};
