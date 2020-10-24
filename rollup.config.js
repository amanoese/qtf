import shebang from 'rollup-plugin-preserve-shebang';
import json from 'rollup-plugin-json';
import injectProcessEnv from 'rollup-plugin-inject-process-env';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
//import { terser } from "rollup-plugin-terser";

// do not use rollup.js ....
export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs'
  },
  plugins: [
    shebang(),
    json(),
    //resolve(),
    commonjs(),
    injectProcessEnv({
      TF_CPP_MIN_LOG_LEVEL:2
    },{
      verbose: true
    }),
    //terser()
  ]
}
