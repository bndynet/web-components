/* eslint-disable @typescript-eslint/no-explicit-any */
import echarts from 'echarts';
import { get, merge, clone } from 'lodash-es';
import { html, TemplateResult, property } from 'lit-element';
import { RootElement, htmlElement, objectConverter } from '../../core';

import { colorSet, globalOptions } from './settings';

import './style.scss';

export interface ChartStyles {
  grid?: { borderColor?: string; borderWidth?: number };
  series?: { color?: string; type?: 'line' | 'area' | 'bar'; axisIndex?: number }[];
  axes?: { name?: string; formatter?: string };
}

export enum ChartType {
  Pie = 'pie',
  Line = 'line',
  Bar = 'bar',
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
