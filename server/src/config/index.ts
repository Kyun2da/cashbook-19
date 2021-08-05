if (!process.env.SITE_URI) {
  throw new Error('SITE_URI 없습니다.');
}
const siteUri = process.env.SITE_URI;

if (!process.env.PORT) {
  throw new Error('PORT 없습니다.');
}
let port: number;
try {
  port = parseInt(process.env.PORT, 10);
} catch {
  throw new Error('PORT가 숫자가 아닙니다.');
}
if (port < 1 || port > 65535) {
  throw new Error('port 1~65535 사이여야 합니다.');
}

export default {
  siteUri,
  port,
};
