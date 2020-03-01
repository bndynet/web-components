/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import echarts from 'echarts';
import { get, merge, clone, map, union } from 'lodash-es';
import { html, TemplateResult, property } from 'lit-element';
import { RootElement, htmlElement, objectConverter } from '../../core';

import { colorSet, globalOptions } from './settings';

import './style.scss';

export interface SeriesStyles {
  name?: string;
  // for Pie, Line, Bar
  color?: string;
  type?: 'line' | 'area' | 'bar';
  axisIndex?: number;
  // unused
  unit?: string;
  // for Guage
  min?: number;
  max?: number;
  valueSplitNumber?: number;
  splitValues?: number[];
  splitColors?: string[];
}
export interface ChartStyles {
  grid?: { borderColor?: string; borderWidth?: number };
  series?: {
    [key: string]: SeriesStyles;
  };
  axes?: { name?: string; formatter?: string };
}

export enum ChartType {
  Pie = 'pie',
  Line = 'line',
  Bar = 'bar',
  Gauge = 'gauge',
}

const axisStyle = {
  axisLine: {
    lineStyle: {
      color: '#dddddd',
    },
  },
  splitLine: {
    lineStyle: {
      color: '#efefef',
    },
  },
};

@htmlElement(`chart`)
export class Chart extends RootElement {
  private chart: echarts.ECharts | undefined;

  @property() title = '';
  @property() subTitle = '';
  @property() xKey = '';
  @property() type = '';
  @property({ type: Object }) options = {};
  @property({ converter: objectConverter }) styles: ChartStyles = {};
  @property({ converter: objectConverter }) data = [];
  @property({ converter: objectConverter }) types;
  @property({ converter: objectConverter }) colors = [];

  private _colors: string[] = [];
  private _title = '';

  public constructor() {
    super();
    if (!echarts) {
      throw new Error(`${this.tagName} requires "echarts" library.`);
    }
  }

  public render(): TemplateResult {
    return html`
      <div></div>
    `;
  }

  public firstUpdated(): void {
    this.initColors();
    this.chart = echarts.init(this.children[0] as HTMLDivElement);
    switch (this.type) {
      case ChartType.Pie:
        this.initPieChart();
        break;

      case ChartType.Gauge:
        this.initGaugeChart();
        break;

      default:
        this.initXYChart();
        break;
    }
  }

  private initPieChart(): void {
    const series: any[] = [];
    const seriesData = Array.isArray(this.data) ? this.data : [this.data];
    const seriesWidthWithSpace = 40 / (seriesData.length - 1);
    seriesData.forEach((d: object, index: number) => {
      const isInnerSeries = index < seriesData.length - 1;
      const radius = index === 0 ? [0, seriesData.length === 1 ? '80%' : '40%'] : [`${40 + seriesWidthWithSpace * index - seriesWidthWithSpace / 2}%`, `${40 + seriesWidthWithSpace * index}%`];
      const s = {
        type: 'pie',
        radius,
        label: {
          position: isInnerSeries ? 'inner' : 'outside',
          formatter: isInnerSeries ? '{b}' : '{b}: {d}%',
          color: isInnerSeries ? '#ffffff' : null,
          textShadowColor: isInnerSeries ? '#000' : null,
          textShadowOffsetX: isInnerSeries ? 1 : 0,
          textShadowOffsetY: isInnerSeries ? 1 : 0,
        },
        data: Object.keys(d).map((key: string) => {
          return {
            name: key,
            value: d[key],
            selected: false,
          };
        }),
        tooltip: {
          formatter: (params: any): string => {
            return `<div class="${this.tagName.toLowerCase()}-tooltip">
              <div class="category">
                <span class="flag" style="background-color: ${params.color}"></span>
                <span class="name">${params.name}</span>
              </div>
              <div class="item">
                <span class="name">${params.value}</span>
                <span class="value">${params.percent}%</span>
              </div>
            </div>`;
          },
        },
      };
      series.push(s);
    });

    const options = merge(
      {},
      globalOptions,
      {
        legend: {
          show: false,
        },
        title: this.getTitleOption(),
        series: series,
        color: this._colors,
      },
      this.options,
    );
    console.log(options);
    this.chart && this.chart.setOption(options);
  }

  private initXYChart(): void {
    const xKeys: string[] = this.data.map((item: any) => item[this.xKey]);
    const series: echarts.EChartOption.Series[] | any[] = [];
    const legend: string[] = [];
    this.data.forEach((dataItem: string, index: number) => {
      Object.keys(dataItem).forEach((key: string) => {
        if (key !== this.xKey) {
          let curSeries = series.find((s: any) => s.name === key);
          const curSeriesStyles = get(this.styles, `series[${key}]`);
          if (!curSeries) {
            legend.push(key);
            curSeries = {
              name: key,
              type: get(curSeriesStyles, 'type') || 'line',
              color: get(curSeriesStyles, 'color'),
              smooth: true,
              tooltip: {
                formatter: (params: any): string => {
                  return `<div class="${this.tagName.toLowerCase()}-tooltip">
                    <div class="category">${params.name}</div>
                    <div class="item">
                      <span class="flag" style="background-color: ${params.color}"></span>
                      <span class="name">${params.seriesName}</span>
                      <span class="value">${params.value}</span>
                    </div>
                  </div>`;
                },
              },
              data: [],
            };
            if (get(curSeriesStyles, 'type') === 'area') {
              curSeries.type = 'line';
              curSeries.areaStyle = {};
            }
            series.push(curSeries);
          }
          curSeries.data[index] = dataItem[key];
        }
      });
    });
    let option: echarts.EChartOption = {
      title: this.getTitleOption(),
      xAxis: {
        name: get(this.styles, 'axes[0].name'),
        type: 'category',
        boundaryGap: true,
        data: xKeys,
        axisLabel: {
          formatter: get(this.styles, 'axes[0].formatter'),
        },
        ...axisStyle,
      },
      yAxis: {
        name: get(this.styles, 'axes[1].name'),
        type: 'value',
        axisLabel: {
          formatter: get(this.styles, 'axes[1].formatter'),
        },
        ...axisStyle,
      },
      legend: {
        data: legend,
      },
      series: series,
      color: this._colors,
    };
    option = merge({}, globalOptions, option, this.options);
    console.log(option);
    this.chart && this.chart.setOption(option);
  }

  private initGaugeChart(): void {
    const defaultColors = ['#228b22', '#48b', '#ff4500'];
    const splits = [[0.2, defaultColors[0]], [0.8, defaultColors[1]], [1, defaultColors[2]]];
    const seriesCount = Object.keys(this.data).length;
    const majorRadius = (this.clientWidth / seriesCount > this.clientHeight ? this.clientHeight : this.clientWidth / seriesCount) / 2;
    const minorRadius = majorRadius * 0.7;
    const xUnitWidth = this.clientWidth / seriesCount;
    const seriesOptions: any[] = [];
    const getSeriesOption = (seriesStyles: SeriesStyles, radius: number, isMajor: boolean, reserveSeries: boolean): any => {
      const baseWidth = radius * 0.08;
      const colors = union(seriesStyles.splitColors, defaultColors, this._colors);
      let seriesSplits = splits;
      if (seriesStyles.splitValues) {
        seriesSplits = map(seriesStyles.splitValues, (v: number, index: number) => {
          return [v / seriesStyles.max!, colors[index]];
        });
      }
      if (seriesSplits[seriesSplits.length - 1][0] < 1) {
        seriesSplits.push([1, colors[seriesSplits.length]]);
      }
      const result = {
        axisLine: {
          lineStyle: {
            width: isMajor ? baseWidth * 2 : baseWidth,
            color: seriesSplits,
          },
        },
        axisTick: {
          length: isMajor ? baseWidth / 2 : baseWidth * 1.5,
          lineStyle: {
            // color: isMajor || reserveSeries ? '#ffffff' : 'auto',
            color: isMajor ? '#ffffff' : 'auto',
          },
        },
        splitLine: {
          length: isMajor ? baseWidth * 2 : baseWidth * 2.25,
          lineStyle: {
            // color: isMajor || reserveSeries ? '#ffffff' : 'auto',
            color: isMajor ? '#ffffff' : 'auto',
          },
        },
      };

      // if (reserveSeries) {
      //   const reservedSeriesSplits: any[] = [];
      //   seriesSplits.forEach((splits: any[], index: number) => {
      //     reservedSeriesSplits.push([splits[0], seriesSplits[seriesSplits.length - 1 - index][1]]);
      //   });
      //   merge(result, {
      //     axisTick: {
      //       length: baseWidth / 2,
      //     },
      //     splitLine: {
      //       length: baseWidth,
      //     },
      //     axisLabel: {
      //       color: '#000',
      //     },
      //   });
      // }

      return result;
    };
    const getSplitNumber = (max: number | undefined, min?: number): number | null => {
      if (typeof max !== 'undefined' && max < 10) {
        return max - (min || 0);
      }
      return null;
    };
    switch (seriesCount) {
      case 1:
        seriesOptions.push({});
        break;
      case 2:
        seriesOptions.push({
          center: [this.clientWidth / 2 - minorRadius, '60%'],
          radius: minorRadius,
          endAngle: 45,
        });
        seriesOptions.push({
          z: 3,
          center: [this.clientWidth / 2 + majorRadius - minorRadius * 0.3, '50%'],
          radius: majorRadius,
        });
        break;
      case 3:
        seriesOptions.push({
          center: [this.clientWidth / 2 - majorRadius - minorRadius + minorRadius * 0.3, '60%'],
          radius: minorRadius,
          endAngle: 45,
        });
        seriesOptions.push({
          z: 3,
          radius: majorRadius,
        });
        seriesOptions.push({
          ...seriesOptions[0],
          ...{
            center: [this.clientWidth / 2 + majorRadius + minorRadius - minorRadius * 0.3, '60%'],
            startAngle: 135,
            endAngle: -45,
          },
        });
        break;

      default:
        for (let i = 0; i < seriesCount; i++) {
          seriesOptions.push({
            center: [xUnitWidth * (i + 0.5), '50%'],
            radius: majorRadius - 20,
          });
        }
        break;
    }
    const series = map(Object.keys(this.data), (key: string, index: number) => {
      const isMajorSeries = seriesCount === 1 || ((seriesCount === 2 || seriesCount === 3) && index === 1);
      const reserveSeries = seriesCount === 3 && index === 2;
      const seriesStyles: SeriesStyles = (get(this.styles.series, key) || {
        min: 0,
        max: 100,
      }) as SeriesStyles;
      const result = merge(
        {},
        {
          name: seriesStyles.name || key,
          type: 'gauge',
          min: seriesStyles.min,
          max: seriesStyles.max,
          // min: reserveSeries ? seriesStyles.max : seriesStyles.min,
          // max: reserveSeries ? seriesStyles.min : seriesStyles.max,
          clockwise: true, // !(index === 2 && seriesCount === 3),
          detail: { formatter: `{value}` },
          data: [{ name: key, value: this.data[key], symbol: 'image://data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7' }],
          splitNumber: seriesStyles.valueSplitNumber || getSplitNumber(seriesStyles.max) || 10,
          tooltip: {
            formatter: seriesStyles.name ? '{a} <br/>{c} {b}' : '{c} {b}',
            ...globalOptions.tooltip,
          },
        },
        seriesOptions[index],
        getSeriesOption(seriesStyles, isMajorSeries ? majorRadius : minorRadius, isMajorSeries, reserveSeries),
      );
      return result;
    });
    const option = merge({ tooltip: {} }, { series });
    console.log(series);
    this.chart && this.chart.setOption(option);
  }

  private initColors(): void {
    this._colors = clone(colorSet[this.theme] || colorSet.default);
    if (this.colors) {
      this.colors.forEach((color: string, index: number) => {
        this._colors[index] = color;
      });
    }
  }

  private getTitleOption(): any {
    this._title = this.title;
    const result = {
      text: this._title,
      subtext: this.subTitle,
    };
    this.removeAttribute('title');
    return result;
  }
}
