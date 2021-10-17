// file: src/fragments/common.js
//
function unpack(config, indexId) {
  const id = !Array.isArray(indexId)
    ? indexId
    : indexId.length === 1
    ? indexId[0]
    : undefined;

  return id
    ? applyFragment(config, id)
    : indexId.map((id) => applyFragment(config, id));
}

function applyFragment(config, id) {
  const { fragment } = config.index[id];
  return fragment ? fragment(config, id) : undefined;
}

export { unpack };
