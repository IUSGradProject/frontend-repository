import { LoV } from "./lov.model";

export interface FilterRequest {
    categories: number[];
    styles: number[];
    brands: number[];
    minPrice?: number;
    maxPrice?: number;
    query?: string;
    queryCategoryId?: number;
    sortBy?: string;
    sortDesc?: boolean;
  }  