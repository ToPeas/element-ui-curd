import vue from 'rollup-plugin-vue';
import commonjs from 'rollup-plugin-commonjs';

export default {
    input: 'index.js',
    output: {
        format: 'esm',
        file: 'dist/index.js'
    },
    plugins: [
        commonjs(),
        vue(),
    ]
}