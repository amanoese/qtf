import shebang from 'rollup-plugin-preserve-shebang';
import json from 'rollup-plugin-json';
//import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from "rollup-plugin-terser";

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
    terser()
  ]
}
