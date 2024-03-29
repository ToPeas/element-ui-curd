import Table from './src/components/table/index.js';


const install = function (Vue, opts = {}) {
  Vue.component(Table.name, Table);
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  version: '0.0.1',
  install,
}