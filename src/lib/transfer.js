// file: src/lib/transfer.js
//
function fromEntries(iterable) {
  if (!iterable || typeof iterable[Symbol.iterator] !== 'function')
    return new Map();

  return new Map(iterable);
}

function toEntries(valueMap) {
  const entries = [];
  for (const entry of valueMap.entries()) entries.push(entry);

  return entries;
}

function makeTransfer(getGuid, iterable) {
  const valueMap = fromEntries(iterable);

  return {
    send,
    receive,
    entries,
  };

  function send(value) {
    const key = getGuid();
    valueMap.set(key, value);
    return key;
  }

  function receive(key) {
    const value = valueMap.get(key);
    valueMap.delete(key);
    return value;
  }

  function entries() {
    return toEntries(valueMap);
  }
}

export { makeTransfer };
