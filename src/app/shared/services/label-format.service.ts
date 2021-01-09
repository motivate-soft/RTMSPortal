import { Injectable } from '@angular/core';
import * as moment from 'moment';


@Injectable()
export class LabelFormatService {
    constructor() { }

    getDataLabelFormatter(formatter, value) {
        switch (formatter.toLowerCase()) {
            case 'percent0':
                return Number(value).toFixed(0) + '%';
                break;
            case 'percent1':
                return Number(value).toFixed(1) + '%';
                break;
            case 'percent2':
                return Number(value).toFixed(2) + '%';
                break;
            case 'decimal0':
                return Number(value).toFixed(0);
                break;
            case 'decimal1':
                return Number(value).toFixed(1);
                break;
            case 'decimal2':
                return Number(value).toFixed(2);
                break;
            default:
                throw new Error('Unknown formatter ' + formatter);
        }
    }

    getToolTipFormat(chart, tooltipFormat, item, isAxisDate, xAxisDateFormat) {
        let thisValue = '0';
        let customDataItem: any = null;
        switch (tooltipFormat) {
            case 1:
                if (item.series.name === 'Utilization') {
                    return '<span style="color:' + item.series.color + '">' + item.series.name + '</span>'
                        + '<br/><b>Monthly Page Views</b>: ' + item.y;
                } else {
                    customDataItem = chart.series[item.series.index].customData[item.point.index];
                    return '<span style="color:' + item.series.color + '">' + item.series.name + '</span>'
                        + '<br/><b>Re-hospitalizations</b>: ' + customDataItem.NumberOfHospitalizations
                        + '<br/><b>Applicable Stays</b>: ' + customDataItem.NumberOfStays
                        + '<br/><b>Percentage</b>: ' + item.y + '%';
                }
                break;
            case 2:
                return '<span style="color: ' + item.series.color + '">' + item.point.category + '</span>'
                    + '<br/><b>Time Period</b>: ' + item.series.name
                    + '<br/><b>Applicable Stays</b>: ' + item.y;
                break;
            case 3:
                customDataItem = chart.series[item.series.index].customData[item.point.index];
                return '<span style="color:' + item.series.color + '">' + item.series.name + '</span>'
                    + '<br/><b>Facility</b>: ' + item.key
                    + '<br/><b>Re-hospitalizations</b>: ' + customDataItem.NumberOfHospitalizations
                    + '<br/><b>Applicable Stays</b>: ' + customDataItem.NumberOfStays
                    + '<br/><b>Percentage</b>: ' + item.y + '%';
                break;
            case 4:
                customDataItem = chart.series[item.series.index].customData[item.point.index];
                return '<span style="color:' + item.series.color + '">' + item.series.name + '</span>'
                    + '<br/><b>Facility</b>: ' + (item.key)
                    + '<br/><b>Avg Census</b>: ' + customDataItem.Census
                    + '<br/><b>Hospital Days</b>: ' + customDataItem.DayCount
                    + '<br/><b>Hosp Days Per/1000</b>: ' + item.y;
                break;
            case 5:
                customDataItem = chart.series[item.series.index].customData[item.point.index];
                return '<span style="color:' + item.series.color + '">' + item.series.name + '</span>'
                    + '<br/><b>Avg Census</b>: ' + customDataItem.Census
                    + '<br/><b>Hospital Days</b>: ' + customDataItem.DayCount
                    + '<br/><b>Hosp Days Per/1000</b>: ' + item.y;
                break;
            case 6:
                return '<span style="color:' + item.series.color + '">' + item.series.name + '</span>'
                    + '<br/><b>Facility</b>: ' + item.key
                    + '<br/><b>CARD Average</b>: ' + Number(item.y).toFixed(1);
                break;
            case 7:
                return '<span style="color:' + item.series.color + '">' + item.series.name + '</span>'
                    + '<br/><b>CARD Average</b>: ' + Number(item.y).toFixed(1);
                break;
            case 8:
                return '<span style="color:' + item.series.color + '">' + item.series.name + '</span>'
                    + '<br/><b>Facility</b>: ' + item.key
                    + '<br/><b>Time Period</b>: 30 Days '
                    + '<br/><b>Usage</b>: ' + item.y + ' minutes';
                break;
            case 9:
                customDataItem = chart.series[item.series.index].customData[item.point.index];
                return '<span style="color:' + item.series.color + '">' + item.series.name + '</span>'
                    + '<br/><b>Facility</b>: ' + (item.key)
                    + '<br/><b>Avg Admissions</b>: ' + customDataItem.DayCount
                    + '<br/><b>Admissions/1000</b>: ' + item.y;
                break;
            case 11:
                thisValue = Number(item.y) % 1 !== 0 ? Number(item.y).toFixed(1) : Number(item.y).toFixed(0);
                return item.series.name + ': ' + thisValue + ' Resident(s)';
            case 12:
                customDataItem = chart.series[item.series.index].customData[item.point.index];
                return '<span style="color:' + item.series.color + '">' + item.series.name + '</span>'
                    + '<br/><b>Date</b>: ' + item.key
                    + '<br/><b>Illogical Count</b>: ' + customDataItem.IllogicalCount;
                break;
            case 13:
                customDataItem = chart.series[item.series.index].customData[item.point.index];
                return '<span style="color:' + item.series.color + '">' + customDataItem.FacilityName + ' ' + item.series.name + '</span>'
                    + '<br/><b>Length of Stay Total</b>: ' + item.y
                    + '<br/><b>Length of Stay Day Count Total</b>: ' + customDataItem.LengthOfStayTotal
                    + '<br/><b>Length of Stay Resident Count</b>: ' + customDataItem.ResidentCount;
                break;
            case 14:
                customDataItem = chart.series[item.series.index].customData[item.point.index];
                return '<br/>' + customDataItem.DisplayText
                    + '<br/><b>Readmission Count</b>: ' + customDataItem.DisplayValue;
                break;
            case 'NumberAndPecent':
                return '<span style="color:' + item.series.color + '">' + item.series.name + '</span>: <b>'
                    + item.y + '</b> (' + Math.round(item.percentage).toFixed(1) + '%)';
            case 15:
            case 'Number':
            case 15:
                thisValue = Number(item.y) % 1 !== 0 ? Number(item.y).toFixed(1) : Number(item.y).toFixed(0);
                return item.series.name + ': ' + thisValue;
            case 16:
                customDataItem = chart.series[item.series.index].customData[item.point.index];
                return '<span style="color:' + item.series.color + '">' + item.series.name + '</span>'
                    + (customDataItem.TherapyMonth !== '' ? '<br/><b>Date</b>: ' + customDataItem.TherapyMonth : '')
                    + '<br/><b>MDS Count</b>: ' + customDataItem.MdSCount
                    + '<br/><b>Day Count</b>: ' + customDataItem.DayCount
                    + '<br/><b>Total Minutes</b>: ' + customDataItem.TotalMonthlyMinutes
                    + '<br/><b>Average Minutes/Day</b>: ' + customDataItem.AverageMinutes;
                break;
            case 17:
                if (chart.series[item.series.index].isBaseline) {
                    thisValue = Number(item.y) % 1 !== 0 ? Number(item.y).toFixed(1) : Number(item.y).toFixed(0);
                    return item.series.name + ': ' + thisValue + '%';
                } else {
                    customDataItem = chart.series[item.series.index].customData[item.point.index];
                    return '<span style="color:' + item.series.color + '">' + item.series.name + '</span>'
                        + '<br/><b>Percentage</b>: ' + customDataItem.pctFormatted
                        + '<br/><b>Numerator</b>: ' + customDataItem.Numerator
                        + '<br/><b>Denominator</b>: ' + customDataItem.Denominator;
                }
                break;
            case 18:
                return '<span style="color:' + item.series.color + '">' + item.series.name + '</span>'
                    + '<br/><b>Facility</b>: ' + item.key
                    + '<br/><b>Time Period</b>: 30 Days '
                    + '<br/><b>Page Views</b>: ' + item.y;
                break;
            case 20:
                customDataItem = chart.series[item.series.index].customData[item.point.index];
                return '<span style="color:' + item.series.color + '">' + item.series.name + '</span>'
                    + '<br/><b>' + item.key + '</b>: ' + item.y + '%'
                    + '<br/><b>Total MDS With QRP Issues</b>: ' + customDataItem.QRPIssues
                    + '<br/><b>Total MDS Submitted</b>: ' + customDataItem.TotalMDS;
                break;
            case 21:
                thisValue = Number(item.y) % 1 !== 0 ? Number(item.y).toFixed(1) : Number(item.y).toFixed(0);
                customDataItem = chart.series[item.series.index].customData[item.point.index];
                return '<span style="color:' + item.series.color + '">' + item.x + '</span>'
                    + '<br/><b>Month</b>: ' + customDataItem.AdlWeek
                    + '<br/><b>Illogical Count</b>: ' + customDataItem.IllogicalCount;
                break;
            case 22:
                return '<span style="color:' + item.color + '">' + item.key + '</span>'
                    + '<br/>Facility Count : ' + item.y;
                break;
            case 23:
                customDataItem = chart.series[item.series.index].customData[item.point.index];
                return '<span style="color:' + item.color + '">' + item.key + '</span>'
                    + '<br/><b>MDS Count</b>: ' + customDataItem.MdSCount
                    + '<br/><b>Day Count</b>: ' + customDataItem.DayCount
                    + '<br/><b>Average Therapy Minutes</b>: ' + customDataItem.AverageMinutes;
                break;
            case 24:
                customDataItem = chart.series[item.series.index].customData[item.point.index];
                let tooltip = '<span style="color:' + item.color + '">' + item.key + '</span>'
                    + '<br/><b>Percentage</b>: ' + customDataItem.YourScoreAvgFormatted;
                if (customDataItem.SelectedSeries === 'Corporation') {
                    tooltip += '<br/><b>Numerator</b>: ' + customDataItem.Numerator
                        + '<br/><b>Denominator</b>: ' + customDataItem.Denominator;
                }
                return tooltip;
                break;
            case 27:
                thisValue = Number(item.y) % 1 !== 0 ? Number(item.y).toFixed(1) : Number(item.y).toFixed(0);
                return '<span style="color:' + item.color + '">' + item.key + '</span>' + 
                        '<br/>' + item.series.name + ': ' + thisValue;
            case 26:
                customDataItem = chart.series[item.series.index].customData[item.point.index];
                return '<span style="color:' + item.color + '">' + item.key + '</span>'
                    + '<br/><b>Avg Census</b>: ' + customDataItem.Census
                    + '<br/><b>Hospital Days</b>: ' + customDataItem.DayCount
                    + '<br/><b>Hosp Days Per/1000</b>: ' + item.y;
                break;
            case 28:
                customDataItem = chart.series[item.series.index].customData[item.point.index];
                return '<span style="color:' + item.color + '">' + item.key + '</span>'
                    + '<br/><b>Re-hospitalizations</b>: ' + customDataItem.NumberOfHospitalizations
                    + '<br/><b>Applicable Stays</b>: ' + customDataItem.NumberOfStays
                    + '<br/><b>Percentage</b>: ' + item.y + '%';
                break;
            case 29:
                customDataItem = chart.series[item.series.index].customData[item.point.index];
                return '<span style="color:' + item.color + '">' + item.key + '</span>'
                    + '<br/><b>Avg Admissions</b>: ' + customDataItem.DayCount
                    + '<br/><b>Admissions/1000</b>: ' + item.y;
                break;
            case 30:
                customDataItem = chart.series[item.series.index].customData[item.point.index];
                return '<span style="color:' + item.color + '">' + item.key + '</span>'
                    + '<br/><b>No. Of Resident</b>: ' + customDataItem.ResidentCount;
                break;

            case 25:
              customDataItem = chart.series[item.series.index].customData[item.point.index];
              return '<span style="color:' + item.series.color + '">' + item.series.name + '</span>'
                  + '<br/><b>Date</b>: ' + customDataItem.DateValue
                  + '<br/><b>' + customDataItem.ValueType + '</b>: ' + customDataItem.DisplayValue;
              break;
            case 31:
                if (item.series.name === 'Average Score') {
                    customDataItem = chart.series[item.series.index].customData[item.point.index];
                    if (customDataItem)
                    {
                        return '<span style="color:' + item.color + '">' + item.key + '</span><br/>'
                        + '<br/><b>Average CARD Score</b>: ' + customDataItem.AverageScore.toFixed(2) + ' as of: ' + customDataItem.ScoreDateFormatted;
                    }
                } else {
                    thisValue = Number(item.y) % 1 !== 0 ? Number(item.y).toFixed(1) : Number(item.y).toFixed(0);
                    return '<span style="color:' + item.color + '">' + item.key + '</span><br/>'
                            + item.series.name + ': ' + thisValue + '%';
                }
                break;
            case 32:
                customDataItem = chart.series[item.series.index].customData[item.point.index];
                thisValue = Number(item.y) % 1 !== 0 ? Number(item.y).toFixed(1) : Number(item.y).toFixed(0);
                return '<span style="color:' + item.series.color + '">' + item.x + '</span>'
                    + '<br/><b>Percentage:</b> ' +  thisValue + '%'
                    + '<br/><b>No. of Orders:</b> ' + customDataItem.Numerator
                    + '<br/><b>Total Orders:</b> ' + customDataItem.Denominator;
                break;
            case 33:
                return '<span style="color:' + item.color + '">' + item.series.name + '</span>'
                    + '<br/>Month : ' + item.key
                    + '<br/>Orders Count : ' + item.y;
                break;
            case 34:
                    customDataItem = chart.series[item.series.index].customData[item.point.index];
                    return '<span style="color:' + item.series.color + '">' + item.key + '</span>'
                        + '<br/><b>No. of IPA Alerts</b>: ' + item.y
                        + '<br/><b>Amount</b>: ' + customDataItem.AmountFormatted;

                break;
            default:
                thisValue = Number(item.y) % 1 !== 0 ? Number(item.y).toFixed(1) : Number(item.y).toFixed(0);

                if (isAxisDate) {
                    return moment(item.x).format(xAxisDateFormat) + '<br />' + item.series.name + ': ' + thisValue;
                } else {
                    return item.series.name + ': ' + thisValue + '%';
                }
                break;
        }
    }

    getPieDataLabelFormat(formatter, point, percentage, showInDatalabels) {
        const seriesName = showInDatalabels ? '' : (point.name + ':<b>');
        switch (formatter.toLowerCase()) {
            case 'percent0':
                return seriesName + Number(percentage).toFixed(0) + '</b >%';
                break;
            case 'percent1':
                return seriesName + Number(percentage).toFixed(1) + '</b >%';
                break;
            case 'percent2':
                return seriesName + Number(percentage).toFixed(2) + '</b >%';
                break;
            default:
                throw new Error('Unknown formatter ' + formatter);
        }
    }
}
