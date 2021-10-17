// file: src/lib/context.js
//

function select(context, path) {
  let v = context;
  for (let i = 0; i < path.length; i += 1) {
    const index = path[i];
    if (index in v) v = v[index];
    else return undefined;
  }

  return v;
}

export { select };
