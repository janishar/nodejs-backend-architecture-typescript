import { Request } from 'express';
import Logger from '../core/Logger';

export function findIpAddress(req: Request) {
  try {
    if (req.headers['x-forwarded-for']) {
      return req.headers['x-forwarded-for'].toString().split(',')[0];
    } else if (req.connection && req.connection.remoteAddress) {
      return req.connection.remoteAddress;
    }
    return req.ip;
  } catch (e) {
    Logger.error(e);
    return undefined;
  }
}
