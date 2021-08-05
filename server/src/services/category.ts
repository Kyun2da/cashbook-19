import { Service } from 'typedi';

import { QueryFailedError } from 'typeorm';
import { ApiError } from '@/core/error';

import Category, { PaymentType } from '@/models/category';

import { randomColor } from '@/core/utils';
import dummyCategories from '@/assets/dummy/categories.json';
import DeleteCategoryRequest from '@/dtos/request/category/delete-category';
import NewCategoryRequest from '@/dtos/request/category/new-category';
import CategoryDto from '@/dtos/model/category';

interface DummyCategory {
  type: string;
  name: string;
}

@Service()
export default class CategoryService {
  static DUMMY_CATEGORIES: DummyCategory[] = dummyCategories;

  async makeDefaultCategories(userId: string): Promise<Category[]> {
    const defaultCategories = CategoryService.DUMMY_CATEGORIES.map((dummy) => {
      const category = new Category();
      category.userId = userId;
      category.name = dummy.name;
      category.type = dummy.type as PaymentType;
      category.color = randomColor();
      return category;
    });
    return Category.save(defaultCategories);
  }

  async addCategory(userId: string, request: NewCategoryRequest): Promise<CategoryDto> {
    const category = new Category();
    category.userId = userId;
    category.type = request.type;
    category.name = request.name;
    category.color = request.color;
    await category.save();
    return new CategoryDto(category);
  }

  async deleteCategory(userId: string, request: DeleteCategoryRequest): Promise<void> {
    const foundCategory = await Category.findOne(request.categoryId);

    if (!foundCategory) {
      throw new ApiError('해당 category는 없습니다.', 404);
    }
    if (foundCategory.userId !== userId) {
      throw new ApiError('해당 category에 권한이 없습니다.', 403);
    }

    try {
      await Category.remove(foundCategory);
    } catch (e) {
      if (e instanceof QueryFailedError) {
        // 일단 날 수 있는게 이것밖에 없으니 이렇게 처리... ㅎㅎ;;
        throw new ApiError('사용중인 카테고리는 삭제가 불가능합니다.', 400);
      }
      throw e;
    }
  }
}
