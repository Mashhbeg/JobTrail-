import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../services/auth.service.js';
import { userRepository } from '../repositories/user.mongo.repository.js';
import { AppError } from '../utils/AppError.js';

export async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(
      new AppError(
        401,
        'UNAUTHORIZED',
        'Authentication token is required.'
      )
    );
  }

  const token = authHeader.slice(7).trim();

  try {
    const payload = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    });

    const user = await userRepository.findById(payload.sub);

    if (!user) {
      return next(
        new AppError(
          401,
          'UNAUTHORIZED',
          'User account no longer exists.'
        )
      );
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    return next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }

    return next(
      new AppError(
        401,
        'UNAUTHORIZED',
        'Invalid or expired authentication token.'
      )
    );
  }
}

