import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, take, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private _authService:AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

   const token = this._authService.currentUser$.pipe(take(1)).subscribe({
    next: user =>{
        if(user){
          request = request.clone({
            headers: request.headers.set('Authorization', `Bearer ${user.token}`)
          });
        }
     },
  });



    return next.handle(request);
  }
}
