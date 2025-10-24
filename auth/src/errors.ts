import { ZodError } from "zod";

export type zodIssue = {
  expected: string;
  code: string;
  path: (string | number)[];
  message: string;
};

export type SerializedErrorResponse = {
  message: string;
  field?: string;
};

export abstract class KnownError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, KnownError.prototype);
  }
  abstract serializeErrors(): SerializedErrorResponse[];
}

export class ValidationError extends KnownError {
  statusCode = 400;
  public errors: zodIssue[] = [];

  constructor(private zodError: ZodError) {
    super("Validation Error");
    this.errors = JSON.parse(this.zodError.message);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((err) => ({
      message: err.message,
      field: err.path.join("."),
    }));
  }
}

export class DatabaseError extends KnownError {
  statusCode = 500;
  message: string = "Database Error";
  constructor() {
    super("Database Error");
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

export class NotFoundError extends KnownError {
  statusCode = 404;

  constructor() {
    super("Not Found");
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: "Not found" }];
  }
}

export class UnauthorizedError extends KnownError {
  statusCode = 401;

  constructor() {
    super("Unauthorized");
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: "Not authorized" }];
  }
}

export class BadRequestError extends KnownError {
  statusCode = 400;

  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
} 
