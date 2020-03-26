import Logger from './utils/Logger';
import { port } from './config';
import app from './app';

app.listen(port, () => { Logger.info(`server running on port : ${port}`); });