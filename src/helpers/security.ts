import { Request } from 'express';
import { ForbiddenError } from '../core/ApiError';
import { findIpAddress } from './utils';

export function restrictIpAddress(req: Request, ipAddress: string) {
  if (ipAddress === '*') return;
  const ip = findIpAddress(req);
  if (!ip) throw new ForbiddenError('IP Address Not Recognised');
  if (ipAddress !== ip) throw new ForbiddenError('Permission Denied');
}
