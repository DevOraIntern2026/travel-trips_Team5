import Joi from 'joi';

export const envValidationSchema = Joi.object({
  DATABASE_URL: Joi.string().required(),
  PORT: Joi.number().default(3000),
  OBSERVE_APP_KEY: Joi.string().required(),
  OBSERVE_APP_SECRET: Joi.string().required(),
  JWT_SECRET: Joi.string().min(16).required(),
  JWT_ACCESS_TTL_SEC: Joi.number().default(900),
  REFRESH_TTL_DAYS: Joi.number().default(30),
  GOOGLE_CLIENT_ID: Joi.string().optional(),
  APP_PUBLIC_URL: Joi.string().default('http://localhost:3000'),
  GMAIL_USER: Joi.string().email().optional(),
  GMAIL_APP_PASSWORD: Joi.string().optional(),
});
