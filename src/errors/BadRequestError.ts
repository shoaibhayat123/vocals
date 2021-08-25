export class BadRequestError extends Error {
  public static StatusCode: 400 = 400;
  public status: 400 = BadRequestError.StatusCode;
  public statusMessage: string = "Bad Request";
  public payload: Object | undefined;
  constructor(message?: string, payload?: Object) {
    super(message);
    this.name = this.constructor.name;
    this.payload = payload;
    Error.captureStackTrace(this, this.constructor);
  }
};
