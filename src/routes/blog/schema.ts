import Joi from 'joi';
import { JoiObjectId, JoiUrlEndpoint } from '../../helpers/validator';

export default {
  blogUrl: Joi.object().keys({
    endpoint: JoiUrlEndpoint().required().max(200),
  }),
  blogId: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
  blogCreate: Joi.object().keys({
    title: Joi.string().required().min(3).max(500),
    description: Joi.string().required().min(3).max(2000),
    text: Joi.string().required().max(50000),
    blogUrl: JoiUrlEndpoint().required().max(200),
    imgUrl: Joi.string().optional().uri().max(200),
    score: Joi.number().optional().min(0).max(1),
    tags: Joi.array().optional().min(1).items(Joi.string().uppercase()),
  }),
  blogUpdate: Joi.object().keys({
    title: Joi.string().optional().min(3).max(500),
    description: Joi.string().optional().min(3).max(2000),
    text: Joi.string().optional().max(50000),
    blogUrl: JoiUrlEndpoint().optional().max(200),
    imgUrl: Joi.string().optional().uri().max(200),
    score: Joi.number().optional().min(0).max(1),
    tags: Joi.array().optional().min(1).items(Joi.string().uppercase()),
  }),
};
