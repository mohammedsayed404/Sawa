import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NavigationExtras, Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private _router: Router, private _toastrService: ToastrService) {}

  intercept( request: HttpRequest<unknown>, next: HttpHandler ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error) {
          switch (error.status) {
            case 400:
              if (error.error.errors) {
                const modelStateErrors = [];
                for (const key in error.error.errors) {
                  if (error.error.errors[key])
                    modelStateErrors.push(error.error.errors[key]);
                }
                throw modelStateErrors.flat();
              } else
                this._toastrService.error(
                  error.error,
                  error.status.toString()
                );
              break;

            case 401:
              this._toastrService.error(
                'Unauthorized',
                error.status.toString()
              );
              break;
            case 404:
              this._router.navigateByUrl('/notfound');
              break;
            case 500:
              const navigationExtras: NavigationExtras = {
                state: { error: error.error },
              };
              this._router.navigateByUrl('/server-error', navigationExtras);
              break;

            default:
              console.log(error);
              break;
          }
        }
        throw error;
      })
    );
  }
}
