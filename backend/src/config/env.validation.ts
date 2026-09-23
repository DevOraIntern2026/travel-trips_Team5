import Joi from 'joi';

export const envValidationSchema = Joi.object({
  DATABASE_URL: Joi.string().required(),
  PORT: Joi.number().default(3000),
  OBSERVE_APP_KEY: Joi.string().required(),
  OBSERVE_APP_SECRET: Joi.string().required(),
});
