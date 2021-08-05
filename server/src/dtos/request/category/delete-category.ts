import { Request } from 'express';

export default class DeleteCategoryRequest {
  categoryId: string;

  constructor(req: Request) {
    this.categoryId = req.params.id as string;
  }
}
