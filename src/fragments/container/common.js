// file: src/fragments/container/common.js
//
const enabledClass = 'o-container--enabled';
const disabledClass = 'o-container--disabled';

// order is dictated by DOMTokenList.replace()
const enabledPair = [disabledClass, enabledClass];
const disabledPair = [enabledClass, disabledClass];

function toEnabledPair(enabled) {
  return enabled ? enabledPair : disabledPair;
}

export { toEnabledPair };
