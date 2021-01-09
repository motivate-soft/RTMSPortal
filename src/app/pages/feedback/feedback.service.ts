import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../../shared/services/services-index';

@Injectable()
export class FeedbackService {
    constructor(private http: HttpClient ,
                private envService:EnvService) { }

    sendEmail = (message) => {
        return this.http.post(this.envService.api + 'feedback/submitfeedback', {
            'Message': message
        });
    }
}