import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class JsonSanitizerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
     if (req.method === 'POST' && req.headers['content-type']?.includes('application/json')) {
      try {
        // Get the raw body buffer
        const rawBody = (req as any).rawBody;
        
        if (rawBody) {
           
          // Convert buffer to string and sanitize
          let bodyStr = rawBody.toString();
          
          // Apply sanitization rules
          bodyStr = bodyStr.replace(/(?<=replying )"STOP"(?=,)/g, 'STOP');
          bodyStr = bodyStr.replace(/(?<=reply )"STOP"(?=,)/g, 'STOP');
          
           
          try {
            // Parse the sanitized string into JSON
            const parsedBody = JSON.parse(bodyStr);
            req.body = parsedBody;
            next();
          } catch (parseError) {
            console.error('JSON parse error:', parseError);
            res.status(400).json({
              statusCode: 400,
              message: 'Invalid JSON format',
              error: parseError.message
            });
          }
        } else {
          next();
        }
      } catch (error) {
        console.error('Middleware error:', error);
        next(error);
      }
    } else {
      next();
    }
  }
}