// file: src/layouts/index.js
//
import { select } from '../lib/context.js';

function base(config, content) {
  const { html, index, context } = config;
  const {
    path,
    attributes: { title, bundleFilePath, styleFilePath, hrefPath },
  } = index['page'];
  const itemId = select(context, path);
  const href = select(context, hrefPath);

  const pageTitle = toTitle(title, itemId);
  const primer = primePage(config);

  return html` <!DOCTYPE html>
    <html>
      <head>
        <title>${pageTitle}</title>
        <meta charset="UTF-8" />
        <link rel="stylesheet" href=${styleFilePath} />
        <script defer src=${bundleFilePath}></script>
      </head>
      <body>
        ${content} ${glitchButton(html, href)} ${primer}
      </body>
    </html>`;
}

function toTitle(title, itemId) {
  return itemId ? `${title} (${itemId})` : title;
}

function primePage({ html, transfer, context }) {
  if (!(transfer || context)) return undefined;

  const pageData = {};
  if (transfer) pageData['transfer'] = transfer.entries();
  if (context) pageData['data'] = context;

  const json = html([JSON.stringify(pageData)]);
  return html`<script id="prime-page" type="application/json">
    ${json}
  </script>`;
}

function glitchButton(html, href) {
  if (!href.includes('glitch')) return undefined;

  return html`<div
      class="glitchButton"
      style="position:fixed;top:20px;right:20px;"
    ></div>
    <script defer src="https://button.glitch.me/button.js"></script>`;
}

export { base };
