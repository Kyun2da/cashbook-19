if (!process.env.BASE_URL) {
  throw new Error('SITE_URI 없습니다.');
}
const baseUrl = process.env.BASE_URL;

export default {
  baseUrl,
};
