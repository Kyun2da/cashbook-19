import { Router } from 'express';
import { Container } from 'typedi';

import asyncWrapper from '@/middlewares/async-wrapper';

import { auth } from '@/middlewares/jwt';
import invalidRequest from '@/middlewares/invalid-request';

import CategoryController from '@/controllers/category';
import NewCategoryRequest from '@/dtos/request/category/new-category';

const router = Router();
const categoryService = Container.get(CategoryController);

router.post('/', auth, invalidRequest(...NewCategoryRequest.validators), asyncWrapper(categoryService.addCategory));
router.delete('/:id', auth, asyncWrapper(categoryService.deleteCategory));

export default router;
