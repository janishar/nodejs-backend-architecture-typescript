import { readFileSpy } from './mock';
import JWT, { JwtPayload } from '../../../src/core/JWT';
import { BadTokenError, TokenExpiredError } from '../../../src/core/ApiError';

describe('JWT class tests', () => {
  const issuer = 'issuer';
  const audience = 'audience';
  const subject = 'subject';
  const param = 'param';
  const validity = 1;

  beforeEach(() => {
    readFileSpy.mockClear();
  });

  it('Should throw error for invalid token in JWT.decode', async () => {
    try {
      await JWT.decode('abc');
    } catch (e) {
      expect(e).toBeInstanceOf(BadTokenError);
    }

    expect(readFileSpy).toBeCalledTimes(1);
  });

  it('Should generate a token for JWT.encode', async () => {
    const payload = new JwtPayload(issuer, audience, subject, param, validity);
    const token = await JWT.encode(payload);

    expect(typeof token).toBe('string');
    expect(readFileSpy).toBeCalledTimes(1);
  });

  it('Should decode a valid token for JWT.decode', async () => {
    const payload = new JwtPayload(issuer, audience, subject, param, validity);
    const token = await JWT.encode(payload);
    const decoded = await JWT.decode(token);

    expect(decoded).toMatchObject(payload);
    expect(readFileSpy).toBeCalledTimes(2);
  });

  it('Should parse an expired token for JWT.decode', async () => {
    const time = Math.floor(Date.now() / 1000);

    const payload = {
      aud: audience,
      sub: subject,
      iss: issuer,
      iat: time,
      exp: time,
      prm: param,
    } as JwtPayload;
    const token = await JWT.encode(payload);
    const decoded = await JWT.decode(token);

    expect(decoded).toMatchObject(payload);
    expect(readFileSpy).toBeCalledTimes(2);
  });

  it('Should throw error for invalid token in JWT.validate', async () => {
    try {
      await JWT.validate('abc');
    } catch (e) {
      expect(e).toBeInstanceOf(BadTokenError);
    }

    expect(readFileSpy).toBeCalledTimes(1);
  });

  it('Should validate a valid token for JWT.validate', async () => {
    const payload = new JwtPayload(issuer, audience, subject, param, validity);
    const token = await JWT.encode(payload);
    const decoded = await JWT.validate(token);

    expect(decoded).toMatchObject(payload);
    expect(readFileSpy).toBeCalledTimes(2);
  });

  it('Should validate a token expiry for JWT.validate', async () => {
    const time = Math.floor(Date.now() / 1000);

    const payload = {
      aud: audience,
      sub: subject,
      iss: issuer,
      iat: time,
      exp: time,
      prm: param,
    } as JwtPayload;
    const token = await JWT.encode(payload);
    try {
      await JWT.validate(token);
    } catch (e) {
      expect(e).toBeInstanceOf(TokenExpiredError);
    }
    expect(readFileSpy).toBeCalledTimes(2);
  });
});
