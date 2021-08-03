import { Algorithm } from 'jsonwebtoken';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET 없습니다.');
}
const secret = Buffer.from(process.env.JWT_SECRET, 'base64');

if (!process.env.JWT_ALGORITHM) {
  throw new Error('JWT_ALGORITHM 없습니다.');
}

const algorithm = process.env.JWT_ALGORITHM as Algorithm;

let accessExpiresIn: number;
if (!process.env.JWT_ACCESS_EXPIRES_IN) {
  throw new Error('JWT_ACCESS_EXPIRES_IN 없습니다.');
}
try {
  accessExpiresIn = parseInt(process.env.JWT_ACCESS_EXPIRES_IN, 10);
} catch {
  throw new Error('JWT_ACCESS_EXPIRES_IN가 정수가 아닙니다.');
}

let refreshExpiresIn: number;
if (!process.env.JWT_REFRESH_EXPIRES_IN) {
  throw new Error('JWT_REFRESH_EXPIRES_IN 없습니다.');
}
try {
  refreshExpiresIn = parseInt(process.env.JWT_REFRESH_EXPIRES_IN, 10);
} catch {
  throw new Error('JWT_REFRESH_EXPIRES_IN 정수가 아닙니다.');
}

export default {
  secret,
  algorithm,
  accessExpiresIn,
  refreshExpiresIn,
};
