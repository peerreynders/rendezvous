// file: src/fragments/checkbox/binder.js
//
import { select } from '../../lib/context.js';

function getDefinition(config) {
  const { index, transfer, context } = config;

  return {
    connected,
    disconnected,
    handleEvent,
  };

  function connected() {
    const fragmentId = this.element.dataset.fragment;
    const { id: indexId } = transfer.receive(fragmentId);
    const { path } = index[indexId];
    const key = path.pop();
    const store = select(context, path);
    const input = this.element.querySelector('input');
    this.data = {
      input,
      update(value) {
        store[key] = value;
      },
    };

    input.addEventListener('change', this);
  }

  function disconnected() {
    this?.data?.input.removeEventListener('change', this);
  }
}

function handleEvent({ type, target }) {
  if (type !== 'change') return;

  this.data.update(target.checked);
}

export { getDefinition };
