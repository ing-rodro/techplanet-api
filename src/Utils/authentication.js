import jwt from 'jsonwebtoken';

import getConfig from 'config';
import { error } from 'console';

const { Token } = getConfig();

export const TokenValidation = (req, res, next) => {
  try {
    const token = req.cookies?.token || req.header('token');

    if (!token) {
      return res.status(401).json({
        message: 'Access Denied',
        error: true,
        success: false
      });
    }
    const payload = jwt.verify(token, Token.secret);
    req.userId = payload.userId;
    return next();
  } catch (e) {
    return res.status(400).send({
      message: 'Invalid Token',
      error: true,
      success: false
    });
  }
};

export function genToken(userId) {
  return jwt.sign({ userId }, Token.secret, {
    expiresIn: 60 * 60 * 8,
  });
}
