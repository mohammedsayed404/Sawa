import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, map } from "rxjs";
import { PaginatedResult } from "../Models/IPagination";

 export function getPaginatedResult<TData>(url:string , params: HttpParams,
  _httpClient:HttpClient
 ): Observable<PaginatedResult<TData>> {
  const paginatedResult:PaginatedResult<TData> = new PaginatedResult<TData>();

    return _httpClient.get<TData>(url, { observe: 'response', params }).pipe(
      map(reponse => {
        if (reponse.body)
          paginatedResult.result = reponse.body;

        const pagination = reponse.headers.get('Pagination');
        if (pagination)
          paginatedResult.pagination = JSON.parse(pagination);

        return paginatedResult;
      })

    );
  }

  export function  getPaginationHeaders(pageNumber:number,PageSize:number ) {
    let params = new HttpParams();
      params = params.append('pageNumber', pageNumber)
                      .append('pageSize', PageSize);
    return params;
  }
