interface AccessToken {
  type: 'access';
  userId: number;
}

interface RefreshToken {
  type: 'refresh';
  tokenId: number;
}

declare namespace Express {
  export interface Request {
    jwt?: {
      access?: AccessToken;
      refresh?: RefreshToken;
    };
  }
}
