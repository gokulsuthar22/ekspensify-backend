export interface CreateCustomCategoryIconData {
  iconId: number;
  icFillColor?: string;
}

export interface UpsertCustomCategoryIcon {
  iconId: number;
  isActive: boolean;
}

export interface CustomCategoryIconWhere {
  iconId?: number;
  isActive?: boolean;
}

export interface UpdateCustomCategoryIconData {
  isActive?: boolean;
  icFillColor?: string;
}

export interface FilterCustomCategoryIconWhere {
  isActive?: boolean;
}
