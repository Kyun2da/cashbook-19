import { Request } from 'express';
import { query } from 'express-validator';

export default class GithubRequest {
  static validators = [query('code').notEmpty()];

  code: string;

  constructor(req: Request) {
    this.code = req.query.code as string;
  }
}
