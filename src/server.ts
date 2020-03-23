import express, { Request, Response, NextFunction, Errback } from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import http from 'http';
import cors from 'cors';
import { port } from './config';

const app = express();

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }));

const corsOptions = {
	'origin': '*',
	'optionsSuccessStatus': 200
};

app.use(cors(corsOptions));

http.createServer(app).listen(port, () => {
	console.info(`server running on port : ${port}`);
});
