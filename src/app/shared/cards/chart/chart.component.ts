import { Component, OnInit, Input, SimpleChanges, EventEmitter, Output, OnChanges, NgZone } from '@angular/core';
import * as Highcharts from 'highcharts';
import * as moment from 'moment';
import { SelectedChartStateService } from '../../services/selected-chart-state.service';
import { LabelFormatService } from '../../services/label-format.service';
import { ModalPopupService } from '../../services/modal-popup.service';
import { MarketingComponent } from '../marketing.component';
import { ModalInputs } from 'src/app/shared/models/modal-inputs';
import { UtilizationMetricsService } from '../../analytics/utilization-metrics.service';
import { ChartWidgetConfig } from '../../models/chart-widget-config';
import { BarSeriesData } from '../../models/bar-series-data';
import { UserStateService } from '../../../user/store/services/user-state.service';
import { FiltersService } from '../../../filter/store/services/filters.service';
import { list } from '../../utility/list';

Highcharts.setOptions({
  lang: {
    thousandsSep: ','
  }
});

@Component({
  selector: 'rtms-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, OnChanges {

  constructor(private selectedChartStateService: SelectedChartStateService,
    private labelFormatService: LabelFormatService,
    private utilizationMetricsService: UtilizationMetricsService,
    private modalPopupService: ModalPopupService,
    private userStateService: UserStateService,
    private filterService: FiltersService,
    private zone: NgZone
  ) { }

  @Input() chartConfig: ChartWidgetConfig;
  @Input() seriesData: BarSeriesData[];
  @Input() allowOnClick: boolean;
  @Input() runOutsideAngular = true;
  @Output() onChartColumnClick = new EventEmitter();

  Highcharts = Highcharts;
  options: any;
  objChart: any;
  modalInputs: ModalInputs[];

  onRedrawChart = (function (self) {
    function handleRedraw(_self, th) {
      if (_self.allowOnClick && _self.chartConfig.chartType !== 'pie') {
        if (!_self.chartConfig.blockSelectedPointColor) {
          const selectedChart = _self.selectedChartStateService.getSelectedChartDetails(_self.chartConfig.ReportId);
          if (selectedChart === '' || selectedChart === null || selectedChart === undefined
            || selectedChart.pointX === '' || selectedChart.pointY === '') {
            _self.resizeChart();
            return;
          }
          if (th.series.length > 0) {
            for (let i = 0; i <= th.series.length - 1; i++) {
              const series = th.series[i];

              for (let j = 0; j <= series.data.length - 1; j++) {
                const point = series.data[j];
                if (point.x === selectedChart.pointX && point.y === selectedChart.pointY) {
                  point.select(true, true);
                  _self.resizeChart();
                  return;
                }
              }
            }
          }
        }
        _self.resizeChart();
      } else {
        _self.resizeChart();
      }
    }
    return function () {
      return handleRedraw(self, this);
    };
  })(this);

  getToolTipFormat = (function (self) {
    return function () {
      if (self.chartConfig.chartType === 'pie' && !self.chartConfig.isHalfDonut) {
        return this.key;
      } else {
        return self.labelFormatService.getToolTipFormat(self.options, self.chartConfig.tooltipFormat,
          this, self.chartConfig.axis.xAxis.isDate,
          (self.chartConfig.axis.xAxis.format ? self.chartConfig.axis.xAxis.format : 'MM/DD/YYYY'));
      }
    };
  })(this);

  getDataLabelFormatter = (function (self) {
    return function () {
      if (this.y > 0) {
        return self.labelFormatService.getDataLabelFormatter(self.chartConfig.dataLabels.formatter.toLowerCase(), this.y);
      } else {
        return '';
      }
    };
  })(this);

  onAfteranimationSeries = (function (self) {
    function seriesHandle(_self, th) {
      if (_self.allowOnClick && _self.chartConfig.chartType === 'pie') {
        const selectedChart = _self.selectedChartStateService.getSelectedChartDetails(_self.chartConfig.ReportId);

        if (selectedChart === '' || selectedChart === null || selectedChart === undefined) {
          return;
        }
        if (th.chart.series.length > 0) {
          for (let i = 0; i <= th.chart.series.length - 1; i++) {
            const series = th.chart.series[i];

            for (let j = 0; j <= series.data.length - 1; j++) {
              const point = series.data[j];
              if (
                point.x === selectedChart.pointX &&
                point.y === selectedChart.pointY
              ) {
                if (point.slice) {
                  point.slice();
                }
              }
            }
          }
          _self.resizeChart();
        }
      }
    }
    return function () {
      seriesHandle(self, this);
    };
  })(this);


  onChartClick = (function (_self) {
    function handleOnColumnClick(event, self, th) {
      self.zone.run(() => {
        if (self.isMarketingModeFunction()) {
          // it will open popup
          const marketingUrl = self.userStateService.getMarketingUrl();
          self.modalInputs = [new ModalInputs('marketingUrl', marketingUrl)];
          self.modalPopupService.showModal(MarketingComponent, self.modalInputs);

        } else {
          const isBaseline = self.isBaselineSeries(th.series);

          if (self.allowOnClick && !isBaseline) {
            const filterSettingsStoreData = self.filterService.filterSettings.get();
            const filterSettings: any = {
              StartDate: filterSettingsStoreData.StartDate,
              EndDate: filterSettingsStoreData.EndDate,
              FilterType: event.point.series.userOptions.filterType ?
                event.point.series.userOptions.filterType : self.chartConfig.FilterType
            };
            if (self.chartConfig.chartType === 'pie') {
              const selectedChart = self.selectedChartStateService.getSelectedChartDetails(self.chartConfig.ReportId);
              // Bug fix: unselect preselected point when changing plots
              if (selectedChart && selectedChart !== undefined && selectedChart.point) {
                const selectedPoint = th.series.data.filter(function (data) {
                  return data.name === selectedChart.point.name;
                })[0];
                // keep things safe
                if (selectedPoint && selectedPoint.select) {
                  selectedPoint.select(false);
                }
              }
              self.utilizationMetricsService.recordChartDrilldown(
                self.chartConfig.ReportId,
                self.chartConfig.name,
                event.point.options.name,
                event.point.percentage,
                event.point.y,
                self.chartConfig.DrillsIntoReportId
              );
              filterSettings.FilterValue = event.point.options.name;
              filterSettings.DetailInfo = moment(filterSettingsStoreData.EndDate).format('MM/DD/YYYY');
            } else if (self.chartConfig.chartType === 'line' && !isBaseline) {
              self.utilizationMetricsService.recordChartDrilldown(
                self.chartConfig.ReportId,
                self.chartConfig.name,
                event.point.category,
                event.point.x,
                event.point.y,
                self.chartConfig.DrillsIntoReportId);
              filterSettings.FilterValue = event.point.category;
              filterSettings.DetailInfo = event.point.category;
            } else {
              self.utilizationMetricsService.recordChartDrilldown(
                self.chartConfig.ReportId,
                self.chartConfig.name,
                event.point.series.name,
                event.point.category,
                event.point.y,
                self.chartConfig.DrillsIntoReportId);
              if (self.chartConfig.axis.xAxis.isDate) {
                filterSettings.FilterValue = event.point.series.name;
                filterSettings.StartDate = event.point.category;
                filterSettings.DetailInfo = moment(event.point.category).format('MM/DD/YYYY');
              } else {
                filterSettings.FilterValue = event.point.category;
                filterSettings.DetailInfo = event.point.category;
              }
            }
            event.filter = filterSettings;
            self.onChartColumnClick.emit(event);
          } else {
            event.preventDefault();
          }
        }
      });

    }
    return function (event) {
      handleOnColumnClick(event, _self, this);
    };
  })(this);


  xAxisFormatter = (function (self) {
    return function () {
      if (self.chartConfig.axis.xAxis.isDate) {
        return moment(this.value).format(self.chartConfig.axis.xAxis.format ? self.chartConfig.axis.xAxis.format : 'MM/DD/YYYY');
      } else {
        return this.value;
      }
    };
  })(this);

  yAxisFormatter = (function (self) {
    return function () {
      if (self.chartConfig.axis.yAxis.IsYAxisPercent) {
        return this.axis.defaultLabelFormatter.call(this) + '%';
      } else {
        return this.axis.defaultLabelFormatter.call(this);
      }
    };
  })(this);
  secondaryYAxisFormatter = (function (self) {
    return function () {
      if (self.chartConfig.axis.yAxis.secondaryAxis.isPercentage) {
        return this.axis.defaultLabelFormatter.call(this) + '%';
      } else {
        return this.axis.defaultLabelFormatter.call(this);
      }
    };
  })(this);
  onPointMouseOver = (function (self) {
    return function () {
      if (self.isBaselineSeries(this.series) || !self.allowOnClick) {
        if (self.seriesData.find(s => s.type == 'spline')) {
          this.series.markerGroup.styles.cursor = 'default';
        } else {
          this.graphic.element.style.cursor = 'default';
        }
      } else {
        this.graphic.element.style.cursor = 'pointer';
      }
    };
  })(this);

  // data label formatter of pie
  onFormatter = (function (self) {
    return function () {
      return self.labelFormatService.getPieDataLabelFormat(
        self.chartConfig.dataLabels.formatter.toLowerCase(),
        this.point,
        this.percentage,
        self.chartConfig.showInDatalabels
      );
    };
  })(this);

  // data label formatter of Donut
  onDonutFormatter = (function (self) {
    return function () {
      return this.key;
    };
  })(this);

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) {

    if (changes['chartConfig'] && changes['chartConfig'].currentValue !== undefined) {
      if (this.chartConfig) {
        this.setChartValue();
      }

      if (changes['chartConfig'].previousValue && changes['chartConfig'].currentValue.BlockSelectedPointColor !== changes['chartConfig'].previousValue.BlockSelectedPointColor) {
        if (this.chartConfig.blockSelectedPointColor) {
          this.options.plotOptions.series.states.select.color = '';
          const selectedPoints = this.objChart.getSelectedPoints();
          selectedPoints[0].select();
        } else {
          this.options.plotOptions.series.states.select.color = '#ffff00';
        }
      }

      if (changes['chartConfig'].previousValue && changes['chartConfig'].currentValue.Stacking !== changes['chartConfig'].previousValue.Stacking) {
        this.options.plotOptions.column.stacking = this.chartConfig.stacking;
      }
      if (changes['chartConfig'].previousValue && changes['chartConfig'].currentValue.ShowLegend !== changes['chartConfig'].previousValue.ShowLegend) {
        this.options.legend.enabled = this.chartConfig.showLegend;
      }
    }
    if (changes['seriesData']) {
      if (this.seriesData && this.seriesData.length > 0) {
        this.options.series = this.seriesData;
        this.options.plotOptions.series.dataLabels = this.getDataLabelConfig();
      }
    }
  }

  setChartValue() {
    const defaultColorPalette = [
      '#87CEEB',
      '#32CD32',
      '#BA55D3',
      '#4682B4',
      '#40E0D0',
      '#FF69B4',
      '#F0E68C',
      '#D2B48C',
      '#8FBC8B',
      '#6495ED',
      '#DDA0DD',
      '#5F9EA0',
      '#FFDAB9',
      '#FFA07A'
    ];
    this.options = {
      colors: [...this.chartConfig.colorPalette, ...defaultColorPalette],

      name: this.chartConfig.name,
      reportId: this.chartConfig.ReportId,
      drillsIntoReportId: this.chartConfig.DrillsIntoReportId,
      chart: {
        type: this.chartConfig.chartType,
        events: {
          redraw: this.onRedrawChart
        }
      },
      tooltip: {
        enabled: true,
        style: {
          padding: 10,
          fontWeight: 'bold'
        },
        formatter: this.getToolTipFormat,
        pointFormat: ''
      },
      plotOptions: {
        series: {
          marker: {
            enabled: this.chartConfig.axis.yAxis.secondaryAxis.enabled 
                      ? this.chartConfig.axis.yAxis.secondaryAxis.markerEnable ? true : false
                      : undefined
          },
          cursor: this.allowOnClick && !this.isBaselineSeries ? 'pointer' : 'default',
          allowPointSelect: (this.allowOnClick && !this.isMarketingModeFunction()) ? true : false,
          states: {
            select: {
              color: this.chartConfig.chartType === 'pie' ? '' : this.chartConfig.blockSelectedPointColor ? '' : '#ffff00'
            }
          },
          point: {
            events: {
              mouseOver: this.onPointMouseOver,
              click: this.onChartClick,
              unselect: this.chartConfig.chartType === 'pie' ? function () { return true; } : function () { return false; }
            }
          },
          events: {
            afterAnimate: this.onAfteranimationSeries
          }
        },
        pie: this.chartConfig.isHalfDonut ? {
          startAngle: -90,
          endAngle: 90,
          center: ['50%', '80%'],
          size: '110%'
        } : (this.chartConfig.showInLegend ? {
          size: this.chartConfig.size ? this.chartConfig.size : '83%',
          showInLegend: this.chartConfig.showInLegend
        } : {
          size: this.chartConfig.size ? this.chartConfig.size : '83%',
          }),
        column: {
          dataLabels: this.getDataLabelConfig(),
          stacking: this.chartConfig.stacking,
          events: {
            legendItemClick: function () {
              return false;
            }
          },
          colorByPoint: this.chartConfig.colorByPoint
        }
      },
      title: {
        text: ''
      },
      subtitle: {
        text: ' '
      },
      xAxis: {
        categories: this.chartConfig.axis.xAxis.data,
        type: ' ',
        labels: {
          rotation: -45,
          style: {
            fontSize: '10px'
          },
          formatter: this.xAxisFormatter
        }
      },
      yAxis: [{
        labels: {
          formatter: this.yAxisFormatter
        },
        max: this.chartConfig.axis.yAxis.MaxYAxis > 0 ? this.chartConfig.axis.yAxis.MaxYAxis : undefined,
        min: 0,
        title: {
          text: ' '
        }
      }],
      legend: {
        enabled: this.chartConfig.showLegend
      },
      credits: {
        position: {
          align: this.chartConfig.credit.align,
          x: -30
        },
        text: this.chartConfig.credit.text || '',
        href: '',
        enabled: this.chartConfig.credit.enabled
      },
      navigation: {
        buttonOptions: {
          verticalAlign: 'top',
          y: this.chartConfig.chartType === 'pie' ? -35 : -10
        }
      },
      dataLabels : {
        padding: 0,
        style: {fontSize: '8px'}
      },
      series: this.seriesData
    };
    if (this.chartConfig.chartType === 'pie') {
      this.options.chart.plotBackgroundColor = null;
      this.options.chart.plotBorderWidth = null;
      this.options.chart.plotShadow = false;
      this.options.chart.margin = [0, 0, 10, 0];
      this.options.chart.spacingBottom = 5;
      this.options.chart.spacingLeft = 0;
      this.options.chart.spacingRight = 5;
      this.options.chart.spacingTop = 40;
    }
    if (this.chartConfig.axis.yAxis.secondaryAxis && this.chartConfig.axis.yAxis.secondaryAxis.enabled) {
      this.setSecondaryYAxis();
    }
  }

  isBaselineSeries(series) {
    const seriesConfig = this.getSeriesByName(series.name);
    return (seriesConfig && seriesConfig.length > 0) && (!seriesConfig[0].isClickable);
  }

  getSeriesByName(name) {
    return this.seriesData.filter(function (series) {
      return series.name === name;
    });
  }

  getDataLabelConfig() {
    if (this.chartConfig.chartType === 'pie') {
      return {
        enabled: true,
        formatter: this.chartConfig.isHalfDonut ? this.onDonutFormatter : this.onFormatter,
        distance: this.chartConfig.isHalfDonut ? 10 : (this.chartConfig.showInDatalabels ? -30 : 20)
      };
    } else if (this.chartConfig && this.chartConfig.dataLabels && this.chartConfig.dataLabels.show) {
      return {
        enabled: this.chartConfig.dataLabels.show,
        formatter: this.getDataLabelFormatter
      };
    } else {
      return {
        enabled: false
      };
    }
  }

  setSecondaryYAxis() {
    this.options.yAxis[1] = { // Secondary yAxis
      labels: {
        formatter: this.secondaryYAxisFormatter
      },
      title: {
        text: ''
      },
      max: this.chartConfig.axis.yAxis.secondaryAxis.max,
      opposite: true
    };
  }
  getChartInstance(chart): void {
    // chart instance
    this.objChart = chart;
    chart.redraw();
  }

  resizeChart(e, Chart) {
    const chart = Chart || this.objChart;

    function smoothReflow() {
      setInterval(() => {
        if (chart && chart.options) {
          chart.reflow();
        }
      }, 30, 10); // sidebar animation time - 300, 30 - interval, repeat 10 times
    }

    if (chart) {
      smoothReflow();
    }
  }

  isMarketingModeFunction() {
    return this.chartConfig.isMarketingMode !== undefined && this.chartConfig.isMarketingMode === true;
  }

}
