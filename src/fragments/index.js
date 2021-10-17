// file: src/fragments/index.js
//
import { selector as chartSelector } from './chart/fragment.js';
import { getDefinition as getChart } from './chart/binder.js';
import { selector as checkboxSelector } from './checkbox/fragment.js';
import { getDefinition as getCheckBox } from './checkbox/binder.js';
import { selector as containerSelector } from './container/fragment.js';
import { getDefinition as getContainer } from './container/binder.js';
import { selector as frameSelector } from './frame/fragment.js';
import { getDefinition as getFrame } from './frame/binder.js';

function getBinders(config) {
  return [
    [chartSelector, getChart(config)],
    [checkboxSelector, getCheckBox(config)],
    [containerSelector, getContainer(config)],
    [frameSelector, getFrame(config)],
  ];
}

export { getBinders };
