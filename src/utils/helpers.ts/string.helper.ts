import { CatchError } from "../decorators/catch-error.decorator";

@CatchError()
export function sanitizeString(str:string):string{
  return str
}
