import { ISpec } from '@visactor/vchart'
import MarkIcon from './MarkIcon.svg'

export interface AxesValue {
  x: number
  y: number
}

const gradientFill = {
  gradient: 'linear',
  x0: 0.5,
  y0: 0,
  x1: 0.5,
  y1: 1,
  stops: [
    {
      offset: 0,
      color: '#2D308A',
    },
    {
      offset: 1,
      color: '#3B5BEC',
    },
  ],
}

interface ChartOptions {
  current: number
  ranking: number
  showLabel?: number[]
}

export const getChartOptions = ({
  current,
  ranking,
  showLabel,
}: ChartOptions) =>
  ({
    type: 'area' as const,
    data: {
      values: [] as AxesValue[],
    },
    xField: 'x',
    yField: 'y',
    background: '#fbfbfb',
    line: {
      style: {
        stroke: '#2D308A',
        lineWidth: 2,
      },
    },
    point: {
      visible: false,
    },
    area: {
      style: {
        fill: {
          gradient: 'linear',
          x0: 0.5,
          y0: 0,
          x1: 0.5,
          y1: 1,
          stops: [
            {
              offset: 0,
              opacity: 1,
              color: '#2D308A',
            },
            {
              offset: 1,
              opacity: 0.3,
              color: '#2D308A',
            },
          ],
        },
      },
    },
    title: {
      text: '',
      textStyle: {
        character: [
          {
            image: MarkIcon,
            width: 28,
            height: 28,
            margin: [0, 4, 0, 0],
          },
          {
            text: 'SAT Score Distribution',
            fontSize: 24,
            fontWeight: '600',
            fill: '#000',
          },
          {
            text: '\n',
          },
          {
            image: '',
            width: 32,
            height: 0,
          },
          {
            text: 'Higher than ',
            fontSize: 16,
            fill: '#000',
            fontWeight: '600',
          },
          {
            text: `${ranking}%`,
            fontSize: 16,
            fill: '#2D308A',
            fontWeight: '700',
          },
          {
            text: ' of students',
            fontSize: 16,
            fill: '#000',
            fontWeight: '600',
          },
        ],
      },
    },
    axes: [
      {
        orient: 'left',
        label: {
          visible: true,
          style: {
            fill: '#818181',
          },
        },
        grid: {
          style: { lineDash: [6, 2] },
        },
        title: {
          visible: true,
          space: 12,
          text: 'Test Takers',
        },
      },
      {
        orient: 'bottom',
        label: {
          visible: true,
          formatMethod: val => {
            const value = Number(Array.isArray(val) ? val[0] : val)
            if (!showLabel) return value
            return showLabel.includes(value) ? val : ''
          },
          style: {
            fill: '#818181',
          },
        },
      },
    ],
    tooltip: {
      visible: false,
    },
    crosshair: {
      xField: {
        visible: false,
      },
    },
    markLine: [
      {
        x: current,
        label: {
          visible: true,
          position: 'end',
          text: 'You',
          style: {
            fontSize: 12,
            fontWeight: 400,
            fill: gradientFill,
            dx: 5,
            dy: -5,
          },
          labelBackground: {
            style: {
              fillOpacity: 0,
            },
          },
        },
        line: {
          style: {
            stroke: gradientFill,
            lineWidth: 2,
          },
        },
        endSymbol: {
          style: {
            visible: false,
          },
        },
      },
      {
        x: current,
        label: {
          visible: true,
          position: 'start',
          text: current,
          style: {
            fontSize: 12,
            fontWeight: 400,
            fill: gradientFill,
            dx: 5,
            dy: 10,
          },
          labelBackground: {
            style: {
              fillOpacity: 0,
            },
          },
        },
        line: {
          style: {
            lineWidth: 0,
          },
        },
        endSymbol: {
          style: {
            visible: false,
          },
        },
      },
    ],
  }) satisfies ISpec
