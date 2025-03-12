import { utc } from 'moment';

const softDeleteModels = [
  'User',
  'Category',
  'Account',
  'Transaction',
  'CustomCategoryIcon',
];

export const applySoftDeleteMiddleware = async (params: any, next: any) => {
  if (params.action === 'delete' || params.action === 'deleteMany') {
    if (softDeleteModels.includes(params.model)) {
      params.action = params.action.replace(params.action, 'update');
      params.args.data = { deletedAt: utc().toDate() };
    }
  }
  return next(params);
};

export const excludeSoftDeletedRecordsMiddleware = async (
  params: any,
  next: any,
) => {
  if (!params.action.startsWith('create')) {
    if (softDeleteModels.includes(params.model)) {
      if (!params.args.where.deletedAt) {
        params.args.where.deletedAt = null;
      }
    }
  }
  return next(params);
};

export const handleUpdateDeleteGracefullyMiddleware = async (
  params: any,
  next: any,
) => {
  if (params.action === 'update' || params.action === 'delete') {
    try {
      return await next(params);
    } catch (error: any) {
      if (error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }
  return next(params);
};
