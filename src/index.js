// file: src/index.js
//
import path from 'path';
import { fastify } from 'fastify';
import fastifyStatic from 'fastify-static';
import { routes as routesStatic } from './static.js';
import { routes } from './pages/index.js';

const PORT = 3000;
const STATIC_ASSETS = 'public';

const app = fastify({ logger: true });
app.register(fastifyStatic, {
  root: path.join(process.cwd(), STATIC_ASSETS),
  prefix: '/',
});
app.register(routesStatic);
app.register(routes);
app.listen(PORT, listening);

function listening(err, address) {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log('App is now listening on', address);
}
