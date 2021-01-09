import { Injectable, NgZone } from '@angular/core';
import * as $ from 'jquery';

@Injectable()
export class TableHeaderService {
    constructor(private ngZone: NgZone) { }

    handleFitTableHead(tableId: string): void {
        setTimeout(() => {
            this.ngZone.runOutsideAngular(() => {
                this.fitTableHead(tableId);
            });
        });
    }

    fitTableHead(tableId: string): void {
        setTimeout(() => {
            // Set title table th-s same width as content table th-s
            const tableMasterSelector = tableId + ' .fh-report-table-content table',
                tableSlaveSelector = tableId + ' .fh-report-table-title table',
                headMasterSelector = tableMasterSelector + ' thead tr',
                headSlaveSelector = tableSlaveSelector + ' thead tr',

                addFilterBtn = $('.btn-add-filter'),
                toggleMenuBtn = $('#menu-toggle');

            function fit() {

                $(headMasterSelector)
                    .children()
                    .each(function (i, c) {
                        $(headSlaveSelector)
                            .children()
                            .eq(i)[0]
                            .style
                            .width = $(c)[0].getBoundingClientRect().width + 'px';
                    });


                $(tableSlaveSelector).width($(tableMasterSelector).width() + 'px');
                setTimeout(() => {
                    $(headSlaveSelector)
                        .children()
                        .each(function (i, c) {
                            if ($(c).outerWidth() !== $(headMasterSelector).children().eq(i)[0].offsetWidth) {
                                $(headMasterSelector)
                                    .children()
                                    .eq(i)[0]
                                    .style
                                    .width = $(c)[0].getBoundingClientRect().width + 'px';
                            }
                        });
                }, 50);
            }

            // attach events
            addFilterBtn.click(function () {
                setTimeout(function () {
                    fit();
                }, 50);
            });
            toggleMenuBtn.click(function () {
                setTimeout(function () {
                    fit();
                }, 300);
            });
            $(window).resize(function () {
                setTimeout(function () {
                    fit();
                });
            });
            // run
            setInterval(() => {
                fit();
            }, 1000);
        });
    }
}
