// file: src/lib/uuid.js
//
// https://tools.ietf.org/html/rfc4122
//
// uuid v4
//
// Layout in terms of hexadecimal digit
// originating from an index
// - each digit is equivalent to
//   a single hexadecimal digit
//   which is part of the value
//   stored on the indicated index
//
// 00000000-1111-1111-2222-222233333333
//
// e.g. 00000000 represents the eight
// hexadecimal digits originating
// from the 32bit value stored
// under index 0.
//
// Version and type location (by digit)
// 00000000-1111-V111-T222-222233333333
//
// V - version - for UUID 4:
//   values[1] & 0xffff0fff | 0x00004000
//   i.e. V = 0x4
//
// T - variant (type):
//   values[2] & 0x3fffffff | 0x80000000
//   i.e. 0x8 <= T <= 0xb
//

const TIME_MID_HI_MASK = 0xffff0fff;
const UUID_VERSION = 0x00004000;

const CLOCK_NODE_LOW_MASK = 0x3fffffff;
const UUID_VARIANT = 0x80000000;

const LOW_MASK = 0x0000ffff;

function makeV4uuid(values) {
  // random value with the UUID version
  values[1] = (values[1] & TIME_MID_HI_MASK) | UUID_VERSION;

  // random value with the UUID variant
  values[2] = (values[2] & CLOCK_NODE_LOW_MASK) | UUID_VARIANT;

  const a = values[1] >>> 16;
  const b = values[1] & LOW_MASK;
  const c = values[2] >>> 16;
  const d = values[2] & LOW_MASK;

  return (
    values[0].toString(16).padStart(8, '0') +
    '-' +
    a.toString(16).padStart(4, '0') +
    '-' +
    b.toString(16).padStart(4, '0') +
    '-' +
    c.toString(16).padStart(4, '0') +
    '-' +
    d.toString(16).padStart(4, '0') +
    values[3].toString(16).padStart(8, '0')
  );
}

const values = new Uint32Array(4);

function getGenerator(getRandomValues) {
  return getGuid;

  function getGuid() {
    getRandomValues(values);
    return makeV4uuid(values);
  }
}

export { getGenerator };
