if (!process.env.OAUTH_GITHUB_CLIENT_ID) {
  throw new Error('OAUTH_GITHUB_CLIENT_ID 없습니다.');
}
const githubClientId = process.env.OAUTH_GITHUB_CLIENT_ID;

if (!process.env.OAUTH_GITHUB_CLIENT_SECRET) {
  throw new Error('OAUTH_GITHUB_CLIENT_SECRET 없습니다.');
}
const githubClientSecret = process.env.OAUTH_GITHUB_CLIENT_SECRET;

if (!process.env.OAUTH_GITHUB_REDIRECT_URI) {
  throw new Error('OAUTH_GITHUB_REDIRECT_URI 없습니다.');
}
const githubRedirectUri = process.env.OAUTH_GITHUB_REDIRECT_URI;

export default {
  github: {
    clientId: githubClientId,
    clientSecret: githubClientSecret,
    redirectUri: githubRedirectUri,
  },
};
