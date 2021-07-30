if (!process.env.SITE_URI) {
  throw new Error('SITE_URI 없습니다.');
}
const siteUri = process.env.SITE_URI;

export default {
  siteUri,
};
