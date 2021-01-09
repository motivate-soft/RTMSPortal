import { NgModule } from '@angular/core';
import { TokenService } from './services/token.service';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { jwtOptionsFactory } from './factory/jwtOptionsFactory';
import { StoreModule } from '@ngrx/store';
import { stateKey, reducerToken, reducerProvider } from '../../authentication/store/reducers';
import { AuthenticationStateService } from '../../authentication/store/services/authentication-state.service';
import { EnvService } from '../services/services-index';

@NgModule({
  imports: [
    HttpClientModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [TokenService, EnvService]
      }
    }),
    StoreModule.forFeature(stateKey, reducerToken),
  ],
  declarations: [],
  exports: [],
  providers: [
      TokenService,
      [
          {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
      ],
      AuthenticationStateService,
      reducerProvider
    ]
})
export class AuthModule {}
