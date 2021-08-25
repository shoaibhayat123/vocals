/**
 * 409 Conflict
 ** Indicates that the request could not be processed because of conflict in the current state of the resource, such as an edit conflict between multiple simultaneous updates.
 */
export class ConflictError extends Error{
  public status: 409 = 409;
  public statusMessage: string = "Conflict";
  public payload: Object | undefined;
  constructor(message?: string, payload?: Object){
    super(message);
    this.name = this.constructor.name;
    this.payload = payload;
    Error.captureStackTrace(this, this.constructor);
  }
};