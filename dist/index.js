import { normalizeComponent } from 'vue-runtime-helpers';

function _broadcast(name, eventName, params) {
  this.$children.forEach(function(child) {
    var name = child.$options.name;

    if (name === name) {
      child.$emit.apply(child, [eventName].concat(params));
    } else {
      _broadcast.apply(child, [name, eventName].concat([params]));
    }
  });
}

var mixins = {
  methods: {
    dispatch: function dispatch(parentName, eventName, params) {
      var parent = this.$parent || this.$root;
      var name = parent.$options.name;

      while (parent && (!name || name !== parentName)) {
        parent = parent.$parent;

        if (parent) {
          parentName = parent.$options.name;
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    },
    broadcast: function broadcast(name, eventName, params) {
      _broadcast.call(this, name, eventName, params);
    },
    dispatchBro: function dispatchBro(name, eventName, params) {
      const parent = this.$parent || this.$root;
      // debugger
      parent.$children.forEach(function(child) {
        // debugger
        var name = child.$options.name;
        if (name === name) {
          child.$emit.apply(child, [eventName].concat(params));
        }
      });
    },
  },
};

const noop = () => [];

var script = {
  name: 'CommonTable',
  mixins:[mixins],
  props: {
    // 表格配置数据
    tableList: {
      type: Array,
      default: noop,
    },
    // 右上面
    sum:[String,Number],
    sumTitle:String ,
    // 每一行的点击事件
    cellClick: {
      type: Function,
      default: () => {},
    },
    // 表格数据
    dataList: {
      type: Array,
      default: noop,
    },
    selectItems: {
      type: Array,
      default: () => [],
    },
    total: {
      type: [Number, String],
      default: 0,
    },
    SearchInputPlaceholder: {
      type: String,
      default: '请输入关键字',
    },
    fixedHeader:{
      type:Boolean,
      default:false,
    },
    paginationOption: {
      type: Object,
      default: () => {},
    },
    pagination: {
      type: Boolean,
      default: true,
    },
    selection: Boolean,
    stripe: {
      type: Boolean,
      default: true,
    },
    border: {
      type: Boolean,
      default: true,
    },
    height: {
      type: [Number, String],
      default: '',
    },
    page_size_prop: {
      type: Number,
      default: 10,
    },
  },
  data () {
    return {
      currentPage: 1,
      totalPage: 1,
      page_size: this.page_size_prop,
      orderStr: '',
    }
  },

  watch: {
    currentPage (val) {
      // console.log('翻页数据',val)
      this.$emit('update:paginationOption',
        { page: val, page_size: this.page_size },
      );
      this.$emit('filtering', { page: val, page_size: this.page_size, ordering: this.orderStr });
    },

    orderStr (val) {
      this.$emit('handSortChange', val);
      this.$emit('update:paginationOption',
        { page: this.page, page_size: this.page_size, ordering: val },
      );
      this.$emit('filtering', { page: this.currentPage, page_size: this.page_size, ordering: val });
    },

  },

  methods: {
    handleSelectionChange (arr) {
      this.$emit('selection-change', arr);
      this.$emit('update:selectItems', arr); // 更新上面组件的绑定的props
    },
    handleCellClick () {
      this.$emit('cell-click', arguments);
    },

    handleSizeChange (page_size) {
      this.page_size = page_size;
      this.$emit('update:paginationOption',
        { page: this.page, page_size: this.page_size },
      );
      this.$emit('filtering', { page_size, ordering: this.orderStr });
    },
    sortChange (params) {
      if (params.order === null) {
        this.orderStr = '';
      } else if (params.order === 'ascending') {
        this.orderStr = params.prop;
      } else if (params.order === 'descending') {
        this.orderStr = '-' + params.prop;
      }
    },

    // 控制表格的固定
    fixColed(item){
      return item.fixed === true
    },
  },
  mounted(){
    // 筛选事件触发
    this.$on('filter_action',({currentPage,page_size}) => {
      this.currentPage = currentPage || 1;
      this.page_size = page_size || 10;
    });
  },
};

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { staticClass: "common-form gb_card f_m15" },
    [
      _vm.sum
        ? _c("div", { staticClass: "f_fr f_mt10 f_mr10 f_mb10" }, [
            _c("span", [_vm._v(_vm._s(_vm.sumTitle) + " : ")]),
            _vm._v(" "),
            _c("span", { staticClass: "f_fs18 f_fw500" }, [
              _vm._v(_vm._s(_vm.sum))
            ])
          ])
        : _vm._e(),
      _vm._v(" "),
      _c(
        "el-table",
        {
          ref: "table",
          attrs: {
            stripe: _vm.stripe,
            border: _vm.border,
            data: _vm.dataList,
            size: "small",
            "cell-click": _vm.handleCellClick
          },
          on: {
            "selection-change": _vm.handleSelectionChange,
            "sort-change": _vm.sortChange
          }
        },
        [
          _vm.selection
            ? _c("el-table-column", {
                attrs: {
                  type: "selection",
                  width: "40",
                  fixed: true,
                  resizable: false,
                  "header-align": "center",
                  align: "center"
                }
              })
            : _vm._e(),
          _vm._v(" "),
          _vm._l(_vm.tableList, function(item) {
            return _c(
              "el-table-column",
              {
                key: item.prop,
                attrs: {
                  label: item.label,
                  width: item.width,
                  prop: item.prop,
                  fixed: _vm.fixColed(item),
                  type: item.type,
                  align: item.align || "center",
                  sortable: item.sortable
                },
                scopedSlots: _vm._u(
                  [
                    {
                      key: "default",
                      fn: function(scope) {
                        return [
                          item.render
                            ? _c(item.render, {
                                tag: "component",
                                attrs: { row: scope.row }
                              })
                            : _c("span", [_vm._v(_vm._s(scope.row[item.prop]))])
                        ]
                      }
                    }
                  ],
                  null,
                  true
                )
              },
              [
                item.renderHeader
                  ? _c(
                      "template",
                      { slot: "header" },
                      [_c(item.renderHeader, { tag: "component" })],
                      1
                    )
                  : _vm._e()
              ],
              2
            )
          })
        ],
        2
      ),
      _vm._v(" "),
      _vm.pagination
        ? _c("el-pagination", {
            staticClass: "f_mt20 f_tar",
            attrs: {
              background: "",
              layout: "total, prev, pager, next, sizes, jumper",
              "current-page": _vm.currentPage,
              total: _vm.total,
              "page-sizes": [10, 20, 25, 50, 100],
              "page-size": _vm.page_size
            },
            on: {
              "update:currentPage": function($event) {
                _vm.currentPage = $event;
              },
              "update:current-page": function($event) {
                _vm.currentPage = $event;
              },
              "size-change": _vm.handleSizeChange
            }
          })
        : _vm._e()
    ],
    1
  )
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = undefined;
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__ = normalizeComponent(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    undefined,
    undefined,
    undefined
  );

__vue_component__.install = function (Vue) {
  Vue.components(__vue_component__.name, __vue_component__);
};

const install = function (Vue, opts = {}) {
  Vue.component(__vue_component__.name, __vue_component__);
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

var index = {
  version: '0.0.1',
  install,
};

export default index;
