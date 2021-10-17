// file: src/fragments/container/binder.js
/* eslint-env browser */
//
import { render } from 'uhtml';
import { select } from '../../lib/context.js';
import { toEnabledPair } from './common.js';

function getDefinition(config) {
  const { index, transfer, context } = config;

  return {
    connected,
    disconnected,
  };

  function connected() {
    // Get fragment instance ID off the element
    const fragmentId = this.element.dataset.fragment;
    // Get transfer data left by the fragment
    const { id: indexId, path } = transfer.receive(fragmentId);

    // Get the specifics on the nested fragment
    const nestedId = index[indexId].content.nested;
    const fragment = index[nestedId].fragment;
    const nestedFragment = () => fragment(config, nestedId);

    // Hook into state system
    const store = select(context, path);
    this.data = {
      nested: store.enabled ? this.element.nextElementSibling : null,
      nestedFragment,
      unsubscribe: store.enabledSubscribe((checked) =>
        setNested(this.element, this.data, checked)
      ),
    };
  }

  function disconnected() {
    this?.data?.unsubscribe();
  }
}

function setNested(element, data, checked) {
  if (!!data.nested === checked) return;

  const classList = element.classList;
  classList.replace.apply(classList, toEnabledPair(checked));

  if (!checked) {
    data.nested.remove();
    data.nested = null;
    return;
  }

  const fragment = new DocumentFragment();
  render(fragment, data.nestedFragment());
  element.after(fragment);
  data.nested = element.nextElementSibling;
  return;
}

export { getDefinition };
