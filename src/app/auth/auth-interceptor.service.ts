import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { exhaustMap, take } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.authService.user$.pipe(
      take(1),
      exhaustMap((user) => {
        if (!user) return next.handle(req);

        const midifiedReq = req.clone({
          headers: req.headers.set('Authorization', user.accessToken),
        });
        return next.handle(midifiedReq);
      })
    );
  }
}
