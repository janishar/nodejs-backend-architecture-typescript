import Logger from './core/Logger';
import { port } from './config';
import app from './app';

app
  .listen(port, () => {
    Logger.info(`server running on port : ${port}`);
  })
  .on('error', (e) => Logger.error(e));
