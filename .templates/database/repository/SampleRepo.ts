import Sample, { SampleModel } from '../model/Sample';
import { Types } from 'mongoose';

async function findById(id: Types.ObjectId): Promise<Sample | null> {
  return SampleModel.findOne({ _id: id, status: true }).lean().exec();
}

async function create(sample: Sample): Promise<Sample> {
  const now = new Date();
  sample.createdAt = now;
  sample.updatedAt = now;
  const created = await SampleModel.create(sample);
  return created.toObject();
}

async function update(sample: Sample): Promise<Sample | null> {
  sample.updatedAt = new Date();
  return SampleModel.findByIdAndUpdate(sample._id, sample, { new: true })
    .lean()
    .exec();
}

export default {
  findById,
  create,
  update,
};
