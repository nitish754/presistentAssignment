import Joi from 'joi';

export const chargeRequestSchema = Joi.object({
  amount: Joi.number().positive().required(),
  currency: Joi.string().length(3).required(),
  source: Joi.string().required(),
  email: Joi.string().email().required()
}); 