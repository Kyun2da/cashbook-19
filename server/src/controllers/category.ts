import { Service } from 'typedi';
import { Request, Response } from 'express';

import CategoryService from '@/services/category';
import DeleteCategoryRequest from '@/dtos/request/category/delete-category';
import CategoryDto from '@/dtos/model/category';
import NewCategoryRequest from '@/dtos/request/category/new-category';

@Service()
export default class CategoryController {
  constructor(private categoryService: CategoryService) {
    this.deleteCategory = this.deleteCategory.bind(this);
    this.addCategory = this.addCategory.bind(this);
  }

  async addCategory(req: Request, res: Response): Promise<Response<CategoryDto>> {
    const userId = req.jwt?.access?.userId;
    const newCategoryRequest = new NewCategoryRequest(req);
    const newCategory = await this.categoryService.addCategory(userId, newCategoryRequest);
    return res.status(201).json(newCategory);
  }

  async deleteCategory(req: Request, res: Response): Promise<void> {
    const userId = req.jwt?.access?.userId;
    const deleteCategoryRequest = new DeleteCategoryRequest(req);
    await this.categoryService.deleteCategory(userId, deleteCategoryRequest);

    return res.status(201).end();
  }
}
