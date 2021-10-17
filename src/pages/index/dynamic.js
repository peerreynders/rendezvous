// file: src/pages/index/dynamic.js
//
// chart data from: https://developers.google.com/chart/interactive/docs/quick_start
//
const data = {
  top: {
    enabled: true,
    chart: {
      data: {
        labels: ['Mushrooms', 'Onions', 'Olives', 'Zucchini', 'Pepperoni'],
        datasets: [
          {
            name: 'Slices Last night',
            values: [3, 1, 1, 1, 2],
          },
        ],
      },
    },
  },
  sku: 'PAnS',
};

export { data };
