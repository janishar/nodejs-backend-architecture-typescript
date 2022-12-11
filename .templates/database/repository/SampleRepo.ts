import Sample, { SampleModel } from '../model/Sample';
import { Types } from 'mongoose';

export default class SampleRepo {
  public static findById(id: Types.ObjectId): Promise<Sample | null> {
    return SampleModel.findOne({ _id: id, status: true }).lean().exec();
  }

  public static async create(sample: Sample): Promise<Sample> {
    const now = new Date();
    sample.createdAt = now;
    sample.updatedAt = now;
    const created = await SampleModel.create(sample);
    return created.toObject();
  }

  public static update(sample: Sample): Promise<Sample | null> {
    sample.updatedAt = new Date();
    return SampleModel.findByIdAndUpdate(sample._id, sample, { new: true }).lean().exec();
  }
}
