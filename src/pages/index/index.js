// file: src/pages/index/index.js
//
import { deserialize, serialize } from 'v8';
import { render } from 'uhtml-ssr';
import { makeTransfer } from '../../lib/transfer.js';
import { unpack } from '../../fragments/common.js';
import { base } from '../../layouts/index.js';

import { indexWithPage as index } from './static.js';
import { data } from './dynamic.js';

const structuredClone = (value) => deserialize(serialize(value));

function fetchContext(parts) {
  const context = structuredClone(data);
  context.top.enabled = !parts.disabled;
  context.parts = parts;
  return context;
}

function toUrlParts(request, envProtocol) {
  const { protocol: requestProtocol, hostname, routerPath, query } = request;
  const { csr, disabled } = query;

  return {
    href: (envProtocol ?? requestProtocol) + '://' + hostname + routerPath,
    disabled,
    csr,
  };
}

function getOptions({ html, getGuid }, envProtocol) {
  return {
    method: 'GET',
    url: '/',
    schema: {
      query: {
        csr: {
          type: 'boolean',
          default: false,
        },
        disabled: {
          type: 'boolean',
          default: false,
        },
      },
    },
    handler,
  };

  function handler(request, reply) {
    const parts = toUrlParts(request, envProtocol);
    const context = fetchContext(parts);

    reply.type('text/html');
    reply.send(render(String, makePage(context, parts.csr)));
  }

  function makePage(context, csr) {
    const config = {
      html,
      index,
      context,
    };

    if (csr) return base(config);

    const transfer = makeTransfer(getGuid);
    config.transfer = transfer;
    const { id } = index['root'];
    const content = unpack(config, id);
    return base(config, content);
  }
}

export { getOptions };
