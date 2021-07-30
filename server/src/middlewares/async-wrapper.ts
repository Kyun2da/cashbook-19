import { Request, Response, NextFunction, RequestHandler } from 'express';

export default function asyncWrapper(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>,
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);
}
