// file: src/pages/index.js
/* eslint-env node */
//
import { html } from 'uhtml-ssr';
import { getRandomValues } from '../lib/randomServer.js';
import { getGenerator } from '../lib/uuid.js';
import { getOptions as getIndex } from './index/index.js';

const protocols = new Set(['http', 'https']);

function envProtocol() {
  const protocol = process?.env?.PROTOCOL?.trim()?.toLowerCase();
  return !!protocol && protocols.has(protocol) ? protocol : undefined;
}

const config = {
  html,
  getGuid: getGenerator(getRandomValues),
};

async function routes(app, _options) {
  app.route(getIndex(config, envProtocol()));
}

export { routes };
