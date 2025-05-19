export interface IPagination{
currentPage: number;
itemsPerPage: number;
totalItems: number;
totalPages: number;
}

export class PaginatedResult<TData>{
result ?: TData;
pagination ?: IPagination;

}
