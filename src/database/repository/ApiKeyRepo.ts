import ApiKey, { ApiKeyModel } from '../model/ApiKey';

export default class ApiRepo {
  public static findByKey(key: string): Promise<ApiKey | null> {
    return ApiKeyModel.findOne({ key: key, status: true }).lean().exec();
  }
}
