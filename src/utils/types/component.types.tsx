export interface LoadingUIProps {
  type: LoadingType;
}

export enum LoadingType {
  CHART = 'chart',
  PAGE = 'page',
  COMPONENT = 'component',
}
