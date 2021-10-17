// file: src/fragments/frame/fragment.js
//
import { select } from '../../lib/context.js';
import { unpack } from '../common.js';

const name = 'we-frame';
const selector = '.' + name;

function fragment(config, indexId, _overrides) {
  const { html, index, transfer, context } = config;
  const {
    path,
    attributes: { class: classStatic },
    content: { nested },
  } = index[indexId];
  const className = name + ' ' + classStatic;
  const { href, disabled, csr } = select(context, path);

  const id = transfer.send({
    id: indexId,
  });

  return html` <section class=${className} .dataset="${{ fragment: id }}">
    ${unpack(config, nested)}
    <form action=${href} method="GET">
      <fieldset>
        <button type="submit">Reload</button>
        <label>
          <input
            type="checkbox"
            name="disabled"
            value="true"
            ?checked=${disabled}
          />Disabled</label
        >
        <label
          ><input
            type="checkbox"
            name="csr"
            value="true"
            ?checked=${csr}
          />CSR</label
        >
      </fieldset>
    </form>
  </section>`;
}

export { name, selector, fragment };
