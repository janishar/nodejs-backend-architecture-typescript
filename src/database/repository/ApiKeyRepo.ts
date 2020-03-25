import ApiKey, { IApiKey } from '../model/ApiKey';

export default class ApiRepository {

	public static async findByKey(key: string): Promise<IApiKey> {
		return ApiKey.findOne({ key: key, status: true }).lean<IApiKey>().exec();
	}
}