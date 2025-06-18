import Joi from 'joi';

export const subscriptionRequestSchema = Joi.object({
  amount: Joi.number().positive().required(),
  currency: Joi.string().length(3).required(),
  source: Joi.string().required(),
  email: Joi.string().email().required(),
  campaignDescription: Joi.string().min(5).required(),
  interval: Joi.string().valid('daily', 'weekly', 'monthly').required()
}); 