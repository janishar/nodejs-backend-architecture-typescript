import { Request, Response, NextFunction } from 'express';

type AsyncFunction<T extends Request> = (req: T, res: Response, next: NextFunction) => Promise<any>;

export default (execution: AsyncFunction<Request>) => (req: Request, res: Response, next: NextFunction) => {
  execution(req, res, next).catch(next);
};
