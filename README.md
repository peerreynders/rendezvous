# Rendezvous Architecture

This is a result of discussions like [this](https://dev.to/peerreynders/comment/1a3e5) and [this](https://dev.to/peerreynders/comment/1i7fc).
The code example was inspired by [this tweet](https://twitter.com/ryancarniato/status/1331041557323993088) and is live on [glitch](https://glitch.com/edit?utm_source=button&utm_medium=button&utm_campaign=glitchButton&utm_content=rendezvous/#!/rendezvous) ([repository](https://github.com/peerreynders/rendezvous)).

> If a component is a box maybe it's time to dismantle it so one can think outside of it.

## Why "Rendezvous"?
* Because *UI structure* and *UI behaviour* travel their separate ways until they finally *meet* client side.
* Stepping back and visuallizing client and server as part of a larger whole, how the server prepares the dynamic parts and packages them together with (but separate from) the static parts, sending them to the client where everything is joined together is reminiscent of a [space rendezvous](https://en.wikipedia.org/wiki/Space_rendezvous).
* Perhaps [Rendez-vous](https://www.discogs.com/release/1112322-Jean-Michel-Jarre-Rendez-Vous) was playing way too often in the background when I was writing the example code.
  
## So what's the deal?
Calling this an architecture is a bit grandious if it wasn't for the fact that it requires a perspective that arches over both server and client (browser). It also starts with the server and *then* moves to the client rather than primarily focusing on the client to only *later* consider server needs as it [is typical](https://adactio.com/journal/16404) with most [SSR approaches](https://developers.google.com/web/updates/2019/02/rendering-on-the-web#rehydration).

It extends the notion present in [progressive enhancement](https://alistapart.com/article/progressiveenhancementwithjavascript/) and blends it with the vision behind Michael Feather's [Humble Dialog Box](https://drive.google.com/file/d/16u0B2JOmpa3K_6r95MwdFlaIqA23Q1Iv/view?usp=sharing) largely with the aim to arrive at UI code that is so minimal that testing it can be delayed until integration testing.

> You should test things that might break. If code is so simple that it can't possibly break and you measure that the code in question doesn't actually break in practice then you shouldn't write a test for it.

Beck, Kent. "Extreme Programming Explained"; *Testing Strategy*, p.117, 2000.

The foundational tenet is the separation of UI *structure* (as represented by the page's or partial's markup) from UI *behaviour* (e.g. event handling attached to the DOM).

That separation is in the service of uncoupling the *commonalities* occuring on both the server and the client from the *variations* that are only needed on the client.

The commonalities are found in the markup (*structure*) both the server and the client have to produce when rendering content. On the server that structure is expressed as HTML (essentially a giant string) on the client side it's a tree of DOM objects. On the surface the result may seem different but the process of its generation can be brought into alignment.

The variation is the UI behaviour that is only needed on the client.

Finally the aim is to limit the UI behaviour (as opposed to application behaviour) to the thinnest of adapters — a *binder* — against the non-visual core of the client side application (the application behaviour).

> [State is the root of all revenue](https://michel.codes/blogs/ui-as-an-afterthought)

## Demonstration code

Nothing in this example is intended to be prescriptive — it serves as a demonstration of how the separation of UI structure and UI behaviour may be leveraged in terms of an implementation.

In this particular case [µhtml-ssr](https://github.com/WebReflection/uhtml-ssr) and [µhtml](https://github.com/WebReflection/uhtml) are used to render the structure for the server and client side respectively.

The key capability resides in [wickedElements](https://github.com/WebReflection/wicked-elements) — the `connected` and `disconnected` lifecycle callbacks that are functionally similar to the custom element `connectedCallback` and `disconnectedCallback` [lifecycle callbacks](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#using_the_lifecycle_callbacks). `connected()` fires as soon as an element matching the `define`d CSS selector has been mounted on the DOM (`init()` fires beforehand). 

This allows client side rendering to be split into two distinct and decoupled phases:

1. render template (UI structure)
2. bind behaviour (UI behaviour)

As the code for markup structure and client behaviour is now strictly decoupled it is possible to formulate "UI structure" code that is reusable on both server and client while the "UI behaviour" code focuses entirely on binding with the client side core application.  This leads to the concept of …

### Fragments

…, not to be confused with [DocumentFragment](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment)s. A fragment can have three aspects:
1. The module in `fragment.js` contains the markup template and any code needed to support it. This is the only mandatory part. It's responsible for the "UI structure" and is used on both server and client.
2. The optional module in `binder.js`. It's only needed when the template needs interactivity and is only used on the client side. During the  `connected()` callback the binder creates the necessary event listeners to direct interactions to the appropriate parts of the non-visual client application while subscribing to client data sources that need to be reflected in the DOM. The `disconnected()` callback removes the event listeners and cancels any subscriptions.   
3. The optional module in `common.js`. As the name suggests this module contains any functionality that is shared between the template and the binder. Hypothetically shared functionalty could be distributed among multiple modules however that could be an indicator that the fragment is too large.

### Fragment: container

```javascript
// file: src/fragments/container/fragment.js
//
import { select } from '../../lib/context.js';
import { unpack } from '../common.js';
import { toEnabledPair } from './common.js';

const name = 'we-container';
const selector = '.' + name;

function fragment(config, indexId, _overrides) {
  const { html, index, transfer, context } = config;
  const {
    path,
    attributes: { title },
    content: { nested },
  } = index[indexId];
  const { enabled } = select(context, path);

  const enabledClass = toEnabledPair(enabled)[1];
  const className = name + ' ' + enabledClass;

  // Leave instance specific data for binder
  const id = transfer.send({
    id: indexId,
    path,
  });

  return html` <h1 class=${className} .dataset=${{ fragment: id }}>${title}</h1>
    ${enabled ? unpack(config, nested) : undefined}`;
}

export { name, selector, fragment };
```

The `fragment` function instantiates a template (partial) from the passed information.
- `config` gives access to various page scoped information sources.
- `indexId` refers to the fragment's page-static data inside `index`.
- `overrides` could contain attribute values provided by (*another*) binder to override the static attribute values. 

The `config` is composed of:
- `html` the [tagged template](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates) function used for instantiating the fragment's template, supplied by [µhtml-ssr](https://github.com/WebReflection/uhtml-ssr) server side and [µhtml](https://github.com/WebReflection/uhtml) client side.
- `index` is the *index* to all static data for all fragment instances on the page. Typically a fragment will only access its own static configuration with `index[indexId]`. The shape of the data is fragment specific but will usually contain the following elements:
  - `path` is the *path* to the dynamic data needed by this instance of the template
  - `attributes` contains the fragment instance specific static configuration data.
  - `content` contains the `indexId`s for the fragment instances that are (potentially) nested within this fragment.
- `transfer` is the facility that a template uses to forward instance specific data to its binder. Minimally the "message" contains the `indexId` to the static configuration in `index`. The binder obtains the `id` from the markup's `fragment` [data attribute](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes) which it then uses to retrieve the *message* from `transfer`. That way the binder has access to the relevant `indexId` and *any additional (derived) data the template needs to share*.
- `context` is the gateway to any "dynamic" data (and stores) both on the server and client side. `path` is used to access the dynamic data that is relevant to the template (additional paths could be present in `attributes`). 

The template is finally instantiated while `unpack`ing any nested content.

```javascript
// file: src/fragments/container/binder.js
/* eslint-env browser */
//
import { render } from 'uhtml';
import { select } from '../../lib/context.js';
import { toEnabledPair } from './common.js';

function getDefinition(config) {
  const { index, transfer, context } = config;

  return {
    connected,
    disconnected,
  };

  function connected() {
    // Get fragment instance ID off the element
    const fragmentId = this.element.dataset.fragment;
    // Get transfer data left by the fragment
    const { id: indexId, path } = transfer.receive(fragmentId);

    // Get the specifics on the nested fragment
    const nestedId = index[indexId].content.nested;
    const fragment = index[nestedId].fragment;
    const nestedFragment = () => fragment(config, nestedId);

    // Hook into state system
    const store = select(context, path);
    this.data = {
      nested: store.enabled ? this.element.nextElementSibling : null,
      nestedFragment,
      unsubscribe: store.enabledSubscribe((checked) =>
        setNested(this.element, this.data, checked)
      ),
    };
  }

  function disconnected() {
    this?.data?.unsubscribe();
  }
}

function setNested(element, data, checked) {
  if (!!data.nested === checked) return;

  const classList = element.classList;
  classList.replace.apply(classList, toEnabledPair(checked));

  if (!checked) {
    data.nested.remove();
    data.nested = null;
    return;
  }

  const fragment = new DocumentFragment();
  render(fragment, data.nestedFragment());
  element.after(fragment);
  data.nested = element.nextElementSibling;
  return;
}

export { getDefinition };
```

The binder module provides the definition for the binder that will be registered with `wickedElements`.
- When `connected` the fragment instance id `fragmentId` is obtained from `this.element`'s `fragment` data attribute.
- `fragmentId` is used to receive the *message* from the template instance. This provides the `indexId` and `path.`
- `index[indexId].content.nested` yields the ID for the static data needed for the nested fragment.
- `index[nestedId].fragement` yields the `fragment` function that will be used to render the nested template.
- `nestedFragment` captures the `fragment`, `config` and `nestedId` necessary to instantiate the nested template in a closure.
- `select(context, path)` retrieves the `store` for the *enabled* application state.
- Any ancilliary properties are stored in `this.data` — in this case:
  - `nested` — a reference to the nested element, provided it is `enabled`.
  - `nestedFragment` for instantiating the nested template
  - `unsubscribe` for cancelling the `enabled` subscription.

- When `disconnected` the subscription is cancelled.

`setNested` is used by the `enabled` subscription. When the latest value is `unchecked`, the `nested` element is [removed](https://developer.mozilla.org/en-US/docs/Web/API/Element/remove). When it's `checked` the `nested` template is instantiated and rendered.

```javascript
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
```

Here the `common.js` module exports the function (for both the template and binder) that manages the classname that the page's CSS can target.

### Page Facets

The page differentiates between dynamic and static data. The static data becomes part of the client bundle pre-deployment. The dynamic data is used to instantiate the page template server side but also (together with the `transfer` messages) rendered into the page's markup at the time of the request.

```javascript
// file: src/pages/index/dynamic.js
//
// chart data from: https://developers.google.com/chart/interactive/docs/quick_start
//
const data = {
  top: {
    enabled: true,
    chart: {
      data: {
        labels: ['Mushrooms', 'Onions', 'Olives', 'Zucchini', 'Pepperoni'],
        datasets: [
          {
            name: 'Slices Last night',
            values: [3, 1, 1, 1, 2],
          },
        ],
      },
    },
  },
  sku: 'PAnS',
};

export { data };
```

In this demonstration code `dynamic.js` is static but it simply is a stand-in for data that is aggregated on the server side at the time of the request. It should be noted that `data` serves two distinct purposes:
1. to hold the request time data required to render the page and the fragments contained therein on the server
2. to serve as the data that primes client side application state

While the shape of `data` may suggest a single source of truth — client side state may be shaped entirely differently. If that is the case then steps have to be taken client side to compensate for any misalignment:
- when client side state is initialized
- when templates and binders use the configured `path` specification to bind to their relevant state

Here `data.top.enabled` (`path`: `['top','enabled']`) represents the `enabled` value at the time of the request while `data.top.chart.data` (`path`: `['top','chart', 'data']`) holds the data for the `chart` fragment. The `path` *segments* are strings representing property names or integer indices.

`static.js` contains static configuration data for all fragment instances that are potentially part of the page. While fragments have other fragments as their `content` the instance nodes are organized as a list and `content` nodes are referenced via their `id` (or array of `id`s). This makes it easy to generate an `index` of fragment instances by their `id`.  `indexWithPage` is used server side as it also contains the page layout configuration under the `'page'` index.
```javascript
// file: src/pages/index/static.js
//
import * as chart from '../../fragments/chart/fragment.js';
import * as checkbox from '../../fragments/checkbox/fragment.js';
import * as container from '../../fragments/container/fragment.js';
import * as frame from '../../fragments/frame/fragment.js';

const ROOT_ID = 'd9fc6c4b-9075-4a07-ad6e-ffdfa765f0f2';

const page = {
  path: ['sku'],
  attributes: {
    title: 'Page App - not Single',
    bundleFilePath: '/js/bundle.js',
    styleFilePath: '/css/style.css',
    hrefPath: ['parts', 'href'],
  },
};

const nodes = [
  {
    id: ROOT_ID,
    name: frame.name,
    fragment: frame.fragment,
    path: ['parts'],
    attributes: {
      enabledPath: ['top', 'enabled'],
      class: 'o-frame',
    },
    content: {
      nested: [
        'd4f53c68-2512-4b6c-b00c-1f2efe8d3623',
        '2cf4ad3e-f69b-493c-8d57-b04009037b32',
      ],
    },
  },
  {
    id: 'd4f53c68-2512-4b6c-b00c-1f2efe8d3623',
    name: container.name,
    fragment: container.fragment,
    path: ['top'],
    attributes: {
      title: 'Rendezvous Architecture',
    },
    content: {
      nested: '4fe29f3f-5f92-4e49-8638-6a7975a62303',
    },
  },
  {
    id: '4fe29f3f-5f92-4e49-8638-6a7975a62303',
    name: chart.name,
    fragment: chart.fragment,
    path: ['top', 'chart', 'data'],
    attributes: {
      options: {
        title: 'How Much Pizza I Ate Last Night',
        type: 'pie',
        clockWise: true,
        height: 700,
        colors: ['light-blue', 'red', 'orange', 'green', 'violet'],
      },
    },
  },
  {
    id: '2cf4ad3e-f69b-493c-8d57-b04009037b32',
    name: checkbox.name,
    fragment: checkbox.fragment,
    path: ['top', 'enabled'],
    attributes: {
      title: 'Enabled',
      name: 'chart-enabled',
    },
  },
];

const index = (function () {
  const idx = {};
  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i];
    idx[node.id] = node;
  }

  idx['root'] = { id: ROOT_ID };
  return idx;
})();

const indexWithPage = (function () {
  const idx = Object.assign({}, index);
  idx['page'] = page;
  return idx;
})();

export { index, indexWithPage };
```

Fragment instance properties:
- `id` by which the fragment instance is referenced
- `name` of the fragment that is used by the instance
- `fragment` is the template function for the fragment
- `path` to the primary dynamic data used by the template and binder.
- `content` contains IDs to any nested fragment instances that *may* be used.
- `attributes` stores any additional static configuration data the template or binder may need.

```javascript
// file: src/pages/index/index.js
//
import { deserialize, serialize } from 'v8';
import { render } from 'uhtml-ssr';
import { makeTransfer } from '../../lib/transfer.js';
import { unpack } from '../../fragments/common.js';
import { base } from '../../layouts/index.js';

import { indexWithPage as index } from './static.js';
import { data } from './dynamic.js';

const structuredClone = (value) => deserialize(serialize(value));

function fetchContext(parts) {
  const context = structuredClone(data);
  context.top.enabled = !parts.disabled;
  context.parts = parts;
  return context;
}

function toUrlParts(request, envProtocol) {
  const { protocol: requestProtocol, hostname, routerPath, query } = request;
  const { csr, disabled } = query;

  return {
    href: (envProtocol ?? requestProtocol) + '://' + hostname + routerPath,
    disabled,
    csr,
  };
}

function getOptions({ html, getGuid }, envProtocol) {
  return {
    method: 'GET',
    url: '/',
    schema: {
      query: {
        csr: {
          type: 'boolean',
          default: false,
        },
        disabled: {
          type: 'boolean',
          default: false,
        },
      },
    },
    handler,
  };

  function handler(request, reply) {
    const parts = toUrlParts(request, envProtocol);
    const context = fetchContext(parts);

    reply.type('text/html');
    reply.send(render(String, makePage(context, parts.csr)));
  }

  function makePage(context, csr) {
    const config = {
      html,
      index,
      context,
    };

    if (csr) return base(config);

    const transfer = makeTransfer(getGuid);
    config.transfer = transfer;
    const { id } = index['root'];
    const content = unpack(config, id);
    return base(config, content);
  }
}

export { getOptions };
```

Server side in the request `handler` the dynamic data is aggregated via `fetchContext`, used to instantiate the page template (with `unpack`) — including the necessary context data and transfer messages —  which is finally rendered and sent.

```javascript
// file: src/pages/index/client.js
/* eslint-env browser */
//
import { html, render } from 'uhtml';
import { define } from 'wicked-elements';
import { getRandomValues } from '../../lib/randomClient.js';
import { patchProperty } from '../../lib/shame.js';
import { makeTransfer } from '../../lib/transfer.js';
import { getGenerator } from '../../lib/uuid.js';
import { unpack } from '../../fragments/common.js';
import { getBinders } from '../../fragments/index.js';

import { index } from './static.js';

const getGuid = getGenerator(getRandomValues);

const primeElement = document.getElementById('prime-page');
const primePage = JSON.parse(primeElement.text);
const context = prepareContext(primePage);

const primeTransfer = primePage['transfer'];
const hasTransfer = Array.isArray(primeTransfer);
const transfer = makeTransfer(getGuid, hasTransfer ? primeTransfer : undefined);

const config = {
  html,
  index,
  context,
  transfer,
};

for (const binder of getBinders(config)) define.apply(null, binder);

if (!hasTransfer) clientSideRender(config);

function clientSideRender(config) {
  const { id } = config.index['root'];
  const content = unpack(config, id);
  const fragment = new DocumentFragment();
  render(fragment, content);
  const bodyElement = document.querySelector('body');
  const before = bodyElement.firstChild;
  if (before) bodyElement.insertBefore(fragment, before);
  else bodyElement.appendChild(fragment);
}

//
// POC: Ideally primePage.data would prime the state system
//      while `context` acts as the gateway to the state system.
//      Here we're just using the initial data as `context`
//
function prepareContext(primer) {
  const context = primer['data'] ?? {};
  patchProperty(context.top, 'enabled');
  return context;
}
```

On the client side the state initialization data (to support `context`) and the `transfer` messages are extracted from the markup and prepared for use as part of the page configuration. Then the `binder` definitions are loaded to bind application behaviour to the existing (and future) DOM tree.

This was a simple illustration the fundamental concepts of the rendezvous architecture.
