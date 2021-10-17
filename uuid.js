// file: ./uuid.js
//
import { getRandomValues } from './src/lib/randomServer.js';
import { getGenerator } from './src/lib/uuid.js';

const getGuid = getGenerator(getRandomValues);

console.log(getGuid());
