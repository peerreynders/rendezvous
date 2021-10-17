import { nodeResolve } from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';

const config = {
  input: './src/pages/index/client.js',
  output: {
    file: './public/bundle.js',
    format: 'esm',
  },
  plugins: [
    nodeResolve(),
    babel({
      babelHelpers: 'bundled'
    }),
  ],
};

export default config;
