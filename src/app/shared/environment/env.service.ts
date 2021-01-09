import { Injectable } from '@angular/core';

@Injectable()
export class EnvService {
    api: string;
    auth0: {
        clientID: string,
        domain: string,
        audience: string,
        responseType: string,
        scope: string
    };
    appInsightsKey: string;
    reCaptchaSiteKeyV2: string;

    constructor() {
    }
}
