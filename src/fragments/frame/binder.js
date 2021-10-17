// file: src/fragments/frame/binder.js
//
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
    const { enabledPath: fullPath } = index[indexId].attributes;
    const path = fullPath.slice(0, -1);
    const store = select(context, path);
    const disabledInput = this.element.querySelector('[name=disabled]');
    this.data = {
      unsubscribe: store.enabledSubscribe(
        (enabled) => void (disabledInput.checked = !enabled)
      ),
    };
  }

  function disconnected() {
    this?.data?.unsubscribe();
  }
}

export { getDefinition };
