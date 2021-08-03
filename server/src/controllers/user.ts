import { Service } from 'typedi';
import { Request, Response } from 'express';

import InitResponse from '@/dtos/response/user/init';
import UserService from '@/services/user';

@Service()
export default class UserController {
  constructor(private userService: UserService) {
    this.getInit = this.getInit.bind(this);
  }

  async getInit(req: Request, res: Response<InitResponse>): Promise<Response<InitResponse>> {
    const userId = req.jwt?.access?.userId;
    const initResponse = await this.userService.getInitData(userId);
    return res.json(initResponse);
  }
}
