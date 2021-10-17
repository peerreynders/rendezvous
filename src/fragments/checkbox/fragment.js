// file: src/fragments/checkbox/fragment.js
//
import { select } from '../../lib/context.js';

const name = 'we-checkbox';
const selector = '.' + name;

function fragment(config, indexId, _overrides) {
  const { html, index, transfer, context } = config;
  const { path, attributes } = index[indexId];
  const { title, name: inputName } = attributes;
  const checked = select(context, path);

  const id = transfer.send({
    id: indexId,
  });

  return html` <label class=${name} .dataset=${{ fragment: id }}>
    <input type="checkbox" ?checked=${checked} name="${inputName}" />
    ${title}
  </label>`;
}

export { name, selector, fragment };
