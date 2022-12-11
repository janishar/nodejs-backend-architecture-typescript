import Joi from 'joi';

export default {
  sample: Joi.object().keys({
    key: Joi.string().required().min(1),
  }),
};
