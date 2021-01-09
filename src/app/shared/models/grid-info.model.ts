import { PaginationInfo } from './pagination-info.model';

export class GridInfo implements PaginationInfo{
    PageNumber?: number;
    PageSize?: number;
    Filter?: string;
    SortProperty?: string;
    SortDirection?: string;
}
