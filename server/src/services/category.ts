import { Service } from 'typedi';

import Category, { PaymentType } from '@/models/category';

import { randomColor } from '@/core/utils';
import dummyCategories from '@/assets/dummy/categories.json';

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
}
