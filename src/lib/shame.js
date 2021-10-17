// file: src/lib/shame.js
//
// Naming based on:
// https://csswizardry.com/2013/04/shame-css/
//
function patchProperty(obj, name) {
  let value = obj[name];
  const callbacks = new Set();
  const pending = [];

  const descriptor = {
    configurable: true,
    enumerable: true,
    get() {
      return value;
    },
    set(nextValue) {
      pending.push(nextValue);
      if (pending.length > 1) return;

      for (let i = 0; i < pending.length; i += 1) {
        value = pending[i];
        broadcastValue(callbacks, value);
      }
      pending.length = 0;
    },
  };
  Object.defineProperty(obj, name, descriptor);

  obj[name + 'Subscribe'] = (callback) => {
    callbacks.add(callback);
    return () => void callbacks.delete(callback);
  };
}

function broadcastValue(callbacks, value) {
  const targets = Array.from(callbacks);
  for (let i = 0; i < targets.length; i += 1) {
    const notify = targets[i];
    if (callbacks.has(notify)) notify(value);
  }
}

export { patchProperty };
