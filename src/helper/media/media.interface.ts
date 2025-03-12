import { EntityType } from '@prisma/client';

export interface CreateMediaData {
  userId: number;
  entityId?: number;
  entityType?: EntityType;
  name: string;
  path: string;
  mime: string;
  size: number;
}

export type MediaWhere = any;

export interface UpdateMediaData {
  userId?: number;
  entityId?: number;
  entityType?: EntityType;
  name?: string;
  path?: string;
  mime?: string;
  size?: number;
}

export interface FilterMediaWhere {
  userId?: number;
  entityId?: number;
  entityType?: EntityType;
}
