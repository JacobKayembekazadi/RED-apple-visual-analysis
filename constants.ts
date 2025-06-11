
import { DevelopmentArea, ChartData, ChartOptions } from './types';

export const APP_NAME = "Red Apple Coaching: AI Visual Analysis";

export const CHART_COLORS = {
  main: '#003F5C',
  accent1: '#D45087',
  accent2: '#FF7C43',
  accent3: '#FFA600',
  gray50: 'rgba(249, 250, 251, 1)', // Tailwind gray-50
  gray200: 'rgba(229, 231, 235, 1)', // Tailwind gray-200
  accent1Light: 'rgba(212, 80, 135, 0.1)',
  accent2Light: 'rgba(255, 124, 67, 0.2)',
};

export const DEVELOPMENT_AREAS: DevelopmentArea[] = [
  { area: 'Scalability', promptText: "How to manage the founder's direct involvement as the company grows." },
  { area: 'Claim Substantiation', promptText: 'How to provide third-party verification for "#1" marketing claims.' },
  { area: 'Broader Market Visibility', promptText: 'How to clarify offerings for non-real estate clients.' },
  { area: 'Long-Term Data', promptText: 'How to showcase data on sustained client success over many years.' }
];

const processLabels = (labels: string[]): (string | string[])[] => {
  return labels.map(label => {
    if (typeof label === 'string' && label.length > 16) {
      const words = label.split(' ');
      const newLabel: string[] = [];
      let currentLine = '';
      words.forEach(word => {
        if ((currentLine + word).length > 16) {
          newLabel.push(currentLine.trim());
          currentLine = '';
        }
        currentLine += word + ' ';
      });
      newLabel.push(currentLine.trim());
      return newLabel;
    }
    return label;
  });
};

const tooltipTitleCallback = (tooltipItems: any[]): string => {
  const item = tooltipItems[0];
  let label = item.chart.data.labels[item.dataIndex];
  return Array.isArray(label) ? label.join(' ') : label;
};

export const SCRIPTING_IMPACT_CHART_DATA: ChartData = {
  labels: processLabels(['Conversion Increase', 'Revenue Increase']),
  datasets: [{
    label: 'Percentage Increase',
    data: [75, 60],
    backgroundColor: [CHART_COLORS.accent1, CHART_COLORS.accent2]
  }]
};

export const SCRIPTING_IMPACT_CHART_OPTIONS: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y',
  scales: { x: { beginAtZero: true, ticks: { callback: (value: number) => value + '%' } } },
  plugins: { legend: { display: false }, tooltip: { callbacks: { title: tooltipTitleCallback } } }
};

export const CLIENT_GROWTH_CHART_DATA: ChartData = {
  labels: processLabels(['Start', 'Mid-Year', 'End of Year']),
  datasets: [{
    label: 'GCI Growth',
    data: [80000, 350000, 600000],
    fill: true,
    backgroundColor: CHART_COLORS.accent2Light,
    borderColor: CHART_COLORS.accent2,
    tension: 0.1,
    pointBackgroundColor: CHART_COLORS.accent2,
    pointRadius: 6,
    pointHoverRadius: 9
  }]
};

export const CLIENT_GROWTH_CHART_OPTIONS: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: { y: { beginAtZero: true, ticks: { callback: (value: number) => '$' + (value / 1000) + 'k' } } },
  plugins: { legend: { display: false }, tooltip: { callbacks: { title: tooltipTitleCallback } } }
};

// OpenRouter configuration
export const OPENROUTER_MODEL = 'deepseek/deepseek-r1-0528:free';

// API Provider configuration
export const API_PROVIDER = {
  PRIMARY: 'openrouter',  // 'openrouter' or 'google'
  USE_FALLBACK: true,     // Whether to try fallback provider when primary fails
  USE_LOCAL_PROXY: false  // Whether to use the local proxy server for OpenRouter
};
