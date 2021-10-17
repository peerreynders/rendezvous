// file: src/lib/randomServer.js
//
import crypto from 'crypto';

function getRandomValues(values) {
  crypto.randomFillSync(values);
}

export { getRandomValues };
