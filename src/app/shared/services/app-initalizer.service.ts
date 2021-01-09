import { Injectable } from '@angular/core';
import createAuth0Client from '@auth0/auth0-spa-js';
import { EnvService } from 'src/app/shared/environment/env.service';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';

@Injectable()
export class AppInitializer {

    private _getAuth0SettingsPromise: Promise<Auth0Client>;

    public auth0Settings: Auth0Client;

    constructor(
        private _envService: EnvService
    ) {}

    public get auth0SettingsAsync(): Promise<Auth0Client> {
        return this._getAuth0SettingsPromise;
    }

    public initializeAuth0Client(): Promise<Auth0Client> {
        this._getAuth0SettingsPromise = createAuth0Client({
                client_id: this._envService.auth0.clientID,
                domain: this._envService.auth0.domain,
                audience: this._envService.auth0.audience,
                scope: this._envService.auth0.scope,
                redirect_uri: location.protocol + '//' + location.host + '/authcallback',
            }).then(auth0Client => {
                this.auth0Settings = auth0Client;
                return auth0Client;
            });

        return this._getAuth0SettingsPromise;
    }
}
