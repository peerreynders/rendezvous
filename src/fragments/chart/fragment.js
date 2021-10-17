// file: src/fragments/chart/fragment.js
//
const name = 'we-chart';
const selector = '.' + name;

function fragment(config, indexId, _overrides) {
  const { html, transfer } = config;

  const id = transfer.send({
    id: indexId,
  });

  const className = name + ' c-chart';

  return html`<div class=${className} data-fragment="${id}"></div>`;
}

export { name, selector, fragment };
