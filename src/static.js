// file: src/static.js
//
const bundle = {
  method: 'GET',
  url: '/js/bundle.js',
  handler(_request, reply) {
    reply.type('text/javascript');
    reply.sendFile('bundle.js');
  },
};

const styles = {
  method: 'GET',
  url: '/css/style.css',
  handler(_request, reply) {
    reply.type('text/css');
    reply.sendFile('style.css');
  },
};

async function routes(app, _options) {
  app.route(bundle);
  app.route(styles);
}

export { routes };
