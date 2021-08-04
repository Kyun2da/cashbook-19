interface AccessToken {
  type: 'access';
  userId: string;
}

interface RefreshToken {
  type: 'refresh';
  tokenId: string;
}

declare namespace Express {
  export interface Request {
    jwt?: {
      access?: AccessToken;
      refresh?: RefreshToken;
    };
  }
}
