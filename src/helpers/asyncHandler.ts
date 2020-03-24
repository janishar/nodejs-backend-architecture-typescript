import { Request, Response, NextFunction } from 'express';

export default (execution: Function) => (req: Request, res: Response, next: NextFunction) => {
	execution(req, res, next).catch(next);
};