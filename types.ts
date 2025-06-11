
export interface DevelopmentArea {
  area: string;
  promptText: string; // Renamed from 'prompt' to avoid conflict with potential React prop names
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string;
  fill?: boolean;
  tension?: number;
  pointBackgroundColor?: string;
  pointRadius?: number;
  pointHoverRadius?: number;
}

export interface ChartData {
  labels: (string | string[])[];
  datasets: ChartDataset[];
}

export interface ChartOptions {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  indexAxis?: 'x' | 'y';
  scales?: any; // Simplified for brevity, can be more specific
  plugins?: any; // Simplified
}

// For Chart.js global object from CDN
declare global {
  interface Window {
    Chart: any;
  }
}
