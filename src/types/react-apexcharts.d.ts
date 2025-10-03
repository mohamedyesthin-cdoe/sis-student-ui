declare module 'react-apexcharts' {
  import { Component } from 'react';
  import { ApexOptions } from 'apexcharts';

  interface ReactApexChartProps {
    options?: ApexOptions;
    series: any[];
    type: "line" | "area" | "bar" | "histogram" | "pie" | "donut" | "radialBar" | "scatter" | "bubble" | "heatmap" | "radar" | "polarArea";
    width?: string | number;
    height?: string | number;
    className?: string;
  }

  export default class ReactApexChart extends Component<ReactApexChartProps> {}
}
