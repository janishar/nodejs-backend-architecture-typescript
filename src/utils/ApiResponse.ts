import { Response } from 'express';

// Helper code for the API consumer to understand the error and handle is accordingly
enum StatusCode {
	SUCCESS = '10000',
	FAILURE = '10001',
	RETRY = '10002',
	INVALID_ACCESS_TOKEN = '10003'
}

enum ResponseStatus {
	SUCCESS = 200,
	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,
	FORBIDDEN = 403,
	NOT_FOUND = 404,
	INTERNAL_ERROR = 500
}

abstract class ApiResponse {

	constructor(protected statusCode: StatusCode, protected status: ResponseStatus, protected message: string) { }

	protected prepare<T extends ApiResponse>(res: Response, response: T): Response {
		return res.status(this.status).json(ApiResponse.sanitize(response));
	}

	public send(res: Response): Response {
		return this.prepare<ApiResponse>(res, this);
	}

	private static sanitize<T extends ApiResponse>(response: T): T {
		const clone: T = <T>{};
		Object.assign(clone, response);
		// delete {some_field};
		delete clone.status;
		for (const i in clone) if (typeof clone[i] === 'undefined') delete clone[i];
		return clone;
	}
}

export class AuthFailureResponse extends ApiResponse {

	constructor(message: string = 'Authentication Failure') {
		super(StatusCode.FAILURE, ResponseStatus.UNAUTHORIZED, message);
	}
}

export class NotFoundResponse extends ApiResponse {

	private url: string;

	constructor(message: string = 'Not Found') {
		super(StatusCode.FAILURE, ResponseStatus.NOT_FOUND, message);
	}

	send(res: Response): Response {
		this.url = res.req.originalUrl;
		return super.prepare<NotFoundResponse>(res, this);
	}
}

export class ForbiddenResponse extends ApiResponse {

	constructor(message: string = 'Forbidden') {
		super(StatusCode.FAILURE, ResponseStatus.FORBIDDEN, message);
	}
}

export class BadRequestResponse extends ApiResponse {

	constructor(message: string = 'Bad Parameters') {
		super(StatusCode.FAILURE, ResponseStatus.BAD_REQUEST, message);
	}
}

export class InternalErrorResponse extends ApiResponse {
	constructor(message: string = 'Internal Error') {
		super(StatusCode.FAILURE, ResponseStatus.INTERNAL_ERROR, message);
	}
}

export class SuccessMsgResponse extends ApiResponse {

	constructor(message: string) {
		super(StatusCode.SUCCESS, ResponseStatus.SUCCESS, message);
	}
}

export class FailureMsgResponse extends ApiResponse {

	constructor(message: string) {
		super(StatusCode.FAILURE, ResponseStatus.SUCCESS, message);
	}
}

export class SuccessResponse<T> extends ApiResponse {

	constructor(message: string, private data: T) {
		super(StatusCode.SUCCESS, ResponseStatus.SUCCESS, message);
	}

	send(res: Response): Response {
		return super.prepare<SuccessResponse<T>>(res, this);
	}
}

export class AccessTokenErrorResponse extends ApiResponse {

	private instruction = 'refresh_token';

	constructor(message: string = 'Access token invalid') {
		super(StatusCode.INVALID_ACCESS_TOKEN, ResponseStatus.UNAUTHORIZED, message);
	}

	send(res: Response): Response {
		res.setHeader('instruction', this.instruction);
		return super.prepare<AccessTokenErrorResponse>(res, this);
	}
}

export class TokenRefreshResponse extends ApiResponse {

	constructor(message: string, private accessToken: string, private refreshToken: string) {
		super(StatusCode.SUCCESS, ResponseStatus.SUCCESS, message);
	}

	send(res: Response): Response {
		return super.prepare<TokenRefreshResponse>(res, this);
	}
}