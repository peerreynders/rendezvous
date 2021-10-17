// file: src/pages/index/client.js
/* eslint-env browser */
//
import { html, render } from 'uhtml';
import { define } from 'wicked-elements';
import { getRandomValues } from '../../lib/randomClient.js';
import { patchProperty } from '../../lib/shame.js';
import { makeTransfer } from '../../lib/transfer.js';
import { getGenerator } from '../../lib/uuid.js';
import { unpack } from '../../fragments/common.js';
import { getBinders } from '../../fragments/index.js';

import { index } from './static.js';

const getGuid = getGenerator(getRandomValues);

const primeElement = document.getElementById('prime-page');
const primePage = JSON.parse(primeElement.text);
const context = prepareContext(primePage);

const primeTransfer = primePage['transfer'];
const hasTransfer = Array.isArray(primeTransfer);
const transfer = makeTransfer(getGuid, hasTransfer ? primeTransfer : undefined);

const config = {
  html,
  index,
  context,
  transfer,
};

for (const binder of getBinders(config)) define.apply(null, binder);

if (!hasTransfer) clientSideRender(config);

function clientSideRender(config) {
  const { id } = config.index['root'];
  const content = unpack(config, id);
  const fragment = new DocumentFragment();
  render(fragment, content);
  const bodyElement = document.querySelector('body');
  const before = bodyElement.firstChild;
  if (before) bodyElement.insertBefore(fragment, before);
  else bodyElement.appendChild(fragment);
}

//
// POC: Ideally primePage.data would prime the state system
//      while `context` acts as the gateway to the state system.
//      Here we're just using the initial data as `context`
//
function prepareContext(primer) {
  const context = primer['data'] ?? {};
  patchProperty(context.top, 'enabled');
  return context;
}
