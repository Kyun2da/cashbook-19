import Category, { PaymentType } from '@/models/category';

export default class CategoryDto {
  id: number;

  type: PaymentType;

  name: string;

  color: string;

  constructor(category: Category) {
    this.id = category.id;
    this.type = category.type;
    this.name = category.name;
    this.color = `#${category.color}`;
  }
}
