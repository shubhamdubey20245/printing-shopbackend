import { Request } from 'express';
import { Op } from 'sequelize';

export interface PaginationOptions {
  limit: number;
  offset: number;
  page: number;
}

export const getPaginationOptions = (req: Request): PaginationOptions => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const offset = (page - 1) * limit;

  return { limit, offset, page };
};

export const getSearchQuery = (req: Request, fields: string[]) => {
  const search = req.query.search as string;
  if (!search) return {};

  return {
    [Op.or]: fields.map((field) => ({
      [field]: {
        [Op.iLike]: `%${search}%`,
      },
    })),
  };
};

export const getSortingOptions = (req: Request, defaultSortField = 'createdAt', defaultSortOrder = 'DESC') => {
  const sortBy = (req.query.sortBy as string) || defaultSortField;
  const sortOrder = ((req.query.sortOrder as string) || defaultSortOrder).toUpperCase();

  return [[sortBy, sortOrder]];
};
