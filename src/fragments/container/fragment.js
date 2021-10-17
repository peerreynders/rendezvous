// file: src/fragments/container/fragment.js
//
import { select } from '../../lib/context.js';
import { unpack } from '../common.js';
import { toEnabledPair } from './common.js';

const name = 'we-container';
const selector = '.' + name;

function fragment(config, indexId, _overrides) {
  const { html, index, transfer, context } = config;
  const {
    path,
    attributes: { title },
    content: { nested },
  } = index[indexId];
  const { enabled } = select(context, path);

  const enabledClass = toEnabledPair(enabled)[1];
  const className = name + ' ' + enabledClass;

  // Leave instance specific data for binder
  const id = transfer.send({
    id: indexId,
    path,
  });

  return html` <h1 class=${className} .dataset=${{ fragment: id }}>${title}</h1>
    ${enabled ? unpack(config, nested) : undefined}`;
}

export { name, selector, fragment };
