// file: src/lib/randomClient.js
/* eslint-env browser */
//
function getRandomValues(values) {
  self.crypto.getRandomValues(values);
}

export { getRandomValues };
