import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';

export const validateBody = (schema: ObjectSchema) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(400).json({
      success: false,
      error: error.details.map(d => d.message).join(', ')
    });
    return;
  }
  next();
}; 