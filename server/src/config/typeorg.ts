if (!process.env.TYPEORM_HOST) {
  throw new Error('TYPEORM_HOST 없습니다.');
}
const host = process.env.TYPEORM_HOST;

if (!process.env.TYPEORM_PORT) {
  throw new Error('TYPEORM_PORT 없습니다.');
}
let port = 3306;
try {
  port = parseInt(process.env.TYPEORM_PORT, 10);
  if (port < 0 || port > 65535) {
    throw new Error('TYPEORM_PORT 포트 범위가 아닙니다.');
  }
} catch {
  throw new Error('TYPEORM_PORT 숫자가 아닙니다.');
}

if (!process.env.TYPEORM_USERNAME) {
  throw new Error('TYPEORM_USERNAME 없습니다.');
}
const username = process.env.TYPEORM_USERNAME;

const password = process.env.TYPEORM_PASSWORD;

if (!process.env.TYPEORM_DATABASE) {
  throw new Error('TYPEORM_DATABASE 없습니다.');
}
const database = process.env.TYPEORM_DATABASE;

export default {
  host,
  port,
  username,
  password,
  database,
};
