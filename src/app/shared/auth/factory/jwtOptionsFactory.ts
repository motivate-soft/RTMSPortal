import { TokenService } from '../services/token.service';
import { parse } from 'url';
import { EnvService } from '../../services/services-index';

const nonSecuredRoutes = [
    'authentication/authenticate',
    'authentication/validatepassword',
    'authentication/validatepassword',
    'authentication/requestpasswordreset',
    'authentication/resetpasswordwithtoken',
    'authentication/resetpassword-without-email',
    'authentication/isusertokenvalid',
    'authentication/get-federated-connection',

    'application-info/app-settings',
    'application-info/version',
    'application-info/check-auto-redirect'
];

export function jwtOptionsFactory(tokenService: TokenService, envService: EnvService) {
    const apiHost = envService.api;

    return {
      tokenGetter: () => {
        return tokenService.getAsyncToken();
      },
      whitelistedDomains: [getHost(apiHost)],
      skipWhenExpired: false,
      blacklistedRoutes: nonSecuredRoutes.map(x => `${apiHost}${x}`)
    };
  }

function getHost(baseUrl: string): string {
    return parse(baseUrl).host;
}
