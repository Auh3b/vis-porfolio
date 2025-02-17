export interface ChartProps<T = DataItem, K = string> {
  width?: number;
  height?: number;
  margin?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  selectedValues?: string[];
  onSelection?: (value: K) => void;
  data: T[];
}

export interface DataItem {
  value: number;
  label: string;
}

export interface AttributeIndicatorItems {
  x: number;
  y: number;
  value?: number | string;
  label?: string;
  color?: string;
}
