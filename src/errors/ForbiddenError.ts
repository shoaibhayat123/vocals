export class ForbiddenError extends Error{
  public static StatusCode: 403 = 403;
  public status: 403 = ForbiddenError.StatusCode;
  public statusMessage: string = "Forbidden";
  public payload: Object | undefined;
  constructor(message?: string, payload?: Object){
    super(message);
    this.name = this.constructor.name;
    this.payload = payload;
    Error.captureStackTrace(this, this.constructor);
  }
};
