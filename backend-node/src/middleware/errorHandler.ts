import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error('Unhandled Server Error:', err);
  
  const status = err.statusCode || err.status || 500;
  const message = err.message || 'Something went wrong';

  res.status(status).json({
    message: message,
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
