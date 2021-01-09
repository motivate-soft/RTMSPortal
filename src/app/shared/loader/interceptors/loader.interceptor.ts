import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { LoaderService } from '../services/loader.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { loaderWhitelistUrls } from './loader-whitelist-urls';

@Injectable({
    providedIn: 'root'
})
export class LoaderInterceptor implements HttpInterceptor {
    constructor(private loaderService: LoaderService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.isWhitelistedUrl(req.url)) {
            this.loaderService.show();
        }

        return next.handle(req).pipe(tap((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse
                    && this.isWhitelistedUrl(req.url)) {
                this.loaderService.hide();
            }
        },
        (error: any) => {
            this.loaderService.hide();
        }));
    }

    private isWhitelistedUrl(url: string): boolean {
        return loaderWhitelistUrls.findIndex(whitelistedUrl => url.indexOf(whitelistedUrl) >= 0) >= 0;
    }
}
