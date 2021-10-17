// file: src/fragments/chart/binder.js
/* eslint-env browser */
//
import { Chart } from 'frappe-charts/dist/frappe-charts.min.esm';
import { select } from '../../lib/context.js';

function getDefinition(config) {
  const { index, transfer, context } = config;

  return {
    connected,
    disconnected,
  };

  function connected() {
    const fragmentId = this.element.dataset.fragment;
    const { id: indexId } = transfer.receive(fragmentId);
    const {
      path,
      attributes: { options: rest },
    } = index[indexId];
    const chartData = select(context, path);
    const options = Object.assign({ data: chartData }, rest);
    this.data = {
      dispose,
    };

    const element = this.element;
    let chart;
    let requestId = self.requestAnimationFrame((_timestamp) => {
      requestId = self.requestAnimationFrame(load);
    });

    function load(_timestamp) {
      chart = new Chart(element, options);
      requestId = undefined;
    }

    function dispose() {
      if (!requestId) {
        chart?.destroy();
        return;
      }

      self.cancelAnimationFrame(requestId);
      requestId = undefined;
    }
  }

  function disconnected() {
    this?.data?.dispose();
  }
}

export { getDefinition };
