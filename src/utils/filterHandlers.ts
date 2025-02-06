import { DataSet, FilterItem } from '../pages/demos/SpatialDashboardDemo/store';

export const FILTER_TYPE = {
  IN: 'in',
};

export const filterHandlers = {
  [FILTER_TYPE.IN]: filterIn,
};

function filterIn(dataset: DataSet, filter: FilterItem) {
  let output;
  const { column, values } = filter;

  if (!values.length) return dataset.data;

  if (dataset.type === 'geojson') {
    output = {
      ...dataset.data,
      features: dataset.data.features.filter(({ properties }) =>
        properties[column] ? values.includes(properties[column]) : true,
      ),
    };
  } else {
    output = dataset.data.filter((d) =>
      d[column] ? values.includes(d[column]) : true,
    );
  }

  return output;
}

export function processFilters(dataset: DataSet, filters: FilterItem[]) {
  if (!dataset) return null;
  if (!filters.length) return dataset.data;

  let output;

  for (let i = 0; i < filters.length; i++) {
    const filter = filters[i];
    const filterHandler = filterHandlers[filter.type];
    output = filterHandler(dataset, filter);
  }
  return output;
}
