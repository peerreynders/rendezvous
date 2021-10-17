// file: src/pages/index/static.js
//
import * as chart from '../../fragments/chart/fragment.js';
import * as checkbox from '../../fragments/checkbox/fragment.js';
import * as container from '../../fragments/container/fragment.js';
import * as frame from '../../fragments/frame/fragment.js';

const ROOT_ID = 'd9fc6c4b-9075-4a07-ad6e-ffdfa765f0f2';

const page = {
  path: ['sku'],
  attributes: {
    title: 'Page App - not Single',
    bundleFilePath: '/js/bundle.js',
    styleFilePath: '/css/style.css',
    hrefPath: ['parts', 'href'],
  },
};

const nodes = [
  {
    id: ROOT_ID,
    name: frame.name,
    fragment: frame.fragment,
    path: ['parts'],
    attributes: {
      enabledPath: ['top', 'enabled'],
      class: 'o-frame',
    },
    content: {
      nested: [
        'd4f53c68-2512-4b6c-b00c-1f2efe8d3623',
        '2cf4ad3e-f69b-493c-8d57-b04009037b32',
      ],
    },
  },
  {
    id: 'd4f53c68-2512-4b6c-b00c-1f2efe8d3623',
    name: container.name,
    fragment: container.fragment,
    path: ['top'],
    attributes: {
      title: 'Rendezvous Architecture',
    },
    content: {
      nested: '4fe29f3f-5f92-4e49-8638-6a7975a62303',
    },
  },
  {
    id: '4fe29f3f-5f92-4e49-8638-6a7975a62303',
    name: chart.name,
    fragment: chart.fragment,
    path: ['top', 'chart', 'data'],
    attributes: {
      options: {
        title: 'How Much Pizza I Ate Last Night',
        type: 'pie',
        clockWise: true,
        height: 700,
        colors: ['light-blue', 'red', 'orange', 'green', 'violet'],
      },
    },
  },
  {
    id: '2cf4ad3e-f69b-493c-8d57-b04009037b32',
    name: checkbox.name,
    fragment: checkbox.fragment,
    path: ['top', 'enabled'],
    attributes: {
      title: 'Enabled',
      name: 'chart-enabled',
    },
  },
];

const index = (function () {
  const idx = {};
  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i];
    idx[node.id] = node;
  }

  idx['root'] = { id: ROOT_ID };
  return idx;
})();

const indexWithPage = (function () {
  const idx = Object.assign({}, index);
  idx['page'] = page;
  return idx;
})();

export { index, indexWithPage };
