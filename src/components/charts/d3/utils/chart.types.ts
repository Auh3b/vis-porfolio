export interface ChartProps {
  width?: number;
  height?: number;
  margin?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  selectedValues?: string[];
  onSelection?: (label: string) => void;
  data: DataItem[];
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
