import express, { Request, Response, NextFunction } from 'express';
import Logger from './utils/Logger';
import bodyParser from 'body-parser';
import cors from 'cors';
import { corsUrl, environment } from './config';
import './database'; // initialize database
import { NotFoundError, ApiError, InternalError } from './utils/ApiError';

const app = express();

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }));
app.use(cors({ origin: corsUrl, optionsSuccessStatus: 200 }));

// Routes
app.use('/v1', require('./routes/v1'));

// catch 404 and forward to error handler
app.use((req, res, next) => next(new NotFoundError()));

// Middleware Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	if (err instanceof ApiError) {
		ApiError.handle(err, res);
	} else {
		if (environment === 'development') {
			Logger.error(err);
			return res.status(500).send(err.message);
		}
		ApiError.handle(new InternalError(), res);
	}
});

export default app;