import { StatusCodes } from "http-status-codes";
import { TagsLoggerType } from "../types/logger.types";

export class CustomError {
  status: StatusCodes;
  tag: TagsLoggerType;
  message: string;
  name: string;
  constructor(
    message: string,
    tag: TagsLoggerType,
    status: StatusCodes,
    name?: string,
  ) {
    this.message = message;
    this.tag = tag;
    this.status = status;
    this.name = name ?? message;
  }
}

export const handleError = (error: CustomError | Error| any, message: string, tag: TagsLoggerType = 'HTTP') => {
    message += error.message ? ` ${error.message}` : ` #{error}`;
    tag = error.tag ? error.tag : tag
    global.log.error({ tag }, message);
}
