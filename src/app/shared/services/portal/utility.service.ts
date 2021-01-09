import { Injectable, Component } from '@angular/core';
import { WindowRefService } from './window.service';


@Injectable()
export class UtilityService {
    constructor(
        private _win: WindowRefService
    ) { }

    isOlderIEBrowser = (): boolean => {
        const browser = {
            isIe: function () {
                return navigator.appVersion.indexOf('MSIE') != -1;
            },
            navigator: this._win.nativeWindow,
            getVersion: function () {
                let version = 999; // we assume a sane browser
                if (navigator.appVersion.indexOf('MSIE') != -1) {
                    // bah, IE again, lets downgrade version number
                    version = parseFloat(navigator.appVersion.split('MSIE')[1]);
                }
                return version;
            }
        };
        return (browser.isIe() && browser.getVersion() <= 10);
    }

    getTodayMMDDYYYY = function (): string {
        const today = new Date();
        let dd = today.getDate().toString();
        let mm = (today.getMonth() + 1).toString(); // January is 0!
        const yyyy = today.getFullYear().toString();
        const h = today.getHours().toString();
        const m = today.getMinutes().toString();
        const ss = today.getSeconds().toString();

        if (+dd < 10) {
            dd = '0' + dd;
        }
        if (+mm < 10) {
            mm = '0' + mm;
        }
        return mm + dd + yyyy + h + m + ss;
    };

    browserIsIE = function () {
        let isIE = false;
        const ua = this._win.nativeWindow.window.navigator.userAgent;
        const ieBrowser = ua.indexOf('MSIE ');
        const ie11Browser = ua.indexOf('Trident/');
        const edgeBrowser = ua.indexOf('Edge/');

        if ((ieBrowser > -1) || (ie11Browser > -1) || (edgeBrowser > -1)) {
            isIE = true;
        }
        return isIE;
    };

    uniqueNumber = function () {
        let date = Date.now();

        // If created at same millisecond as previous
        if (date <= this.uniqueNumber.previous) {
            date = ++this.uniqueNumber.previous;
        } else {
            this.uniqueNumber.previous = date;
        }

        return date;
    };

    getUniqueId = function () {
        return this.uniqueNumber().toString();
    };

    getRouteFromReportName = function (reportConst) {
        return reportConst.replace(/ /g, '-').replace('---', '-').toLowerCase();
    };
}
