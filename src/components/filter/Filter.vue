<template>
  <div class="gb_card f_m15 f_tal">
    <el-row type="flex">
      <el-input
        v-model="searchValue"
        style="width: 300px"
        :placeholder="SearchInputPlaceholder"
        @keyup.enter.native="handleSearch"
        size="small"
      >
        <el-button type="primary" slot="append" @click="handleSearch" icon="el-icon-search">搜索</el-button>
      </el-input>
    </el-row>
    <div class="f_mt10">
      <el-form :model="filters" label-position="top" inline ref="filterForm" label-width="100px">
        <!--      下拉框-->
        <el-form-item
          v-for="item in filterList"
          :prop="item.model"
          :label="item.label"
          :key="item.key"
          size="small"
        >
          <el-select
            size="small"
            multiple
            filterable
            clearable
            v-if="item.type === 'select'"
            mode="multiple"
            v-model="filters[item.model]"
          >
            <el-option
              size="small"
              :label="opt.label"
              v-for="opt in item.options"
              :key="opt.value"
              :value="opt.value"
            />
          </el-select>
          <!--    按钮组-->
          <el-radio-group
            size="small"
            v-else-if="item.type === 'radio-group'"
            v-model="filters[item.model]"
          >
            <a-radio-button :key="opt.value" :value="opt.value" v-for="opt in item.options">
              {{
              opt.label
              }}
            </a-radio-button>
          </el-radio-group>

          <!--    日期/时间范围选择-->
          <el-date-picker
            size="small"
            v-else-if="item.type === 'datetime-ranger'"
            v-model="filters[item.model]"
            type="datetimerange"
            range-separator="-"
            start-placeholder="开始"
            end-placeholder="结束"
          />

          <!--    月份-->
          <el-date-picker
            size="small"
            v-else-if="item.type === 'month'"
            v-model="filters[item.model]"
            value-format="yyyy-MM-dd"
            type="month"
          />
          <!-- 月份范围选择-->
          <el-date-picker
            size="small"
            v-else-if="item.type === 'monthrange'"
            v-model="filters[item.model]"
            value-format="yyyy-MM-01"
            type="monthrange"
            range-separator="-"
          />

          <!--    日期/时间范围选择-->
          <el-date-picker
            size="small"
            v-else-if="item.type === 'date-ranger'"
            v-model="filters[item.model]"
            type="daterange"
            range-separator="-"
            value-format="yyyy-MM-dd"
            start-placeholder="开始"
            end-placeholder="结束"
          />

          <el-time-picker
            is-range
            size="small"
            v-else-if="item.type === 'time-ranger'"
            v-model="filters[item.model]"
            value-format="H:m"
            format="H:m"
            range-separator="-"
          />

          <!--   级联选择框-->
          <template v-else-if="item.type === 'cascader'">
            <el-cascader
              size="small"
              v-model="filters[item.model]"
              :options="item.options"
              filterable
              :show-all-levels="!!item.show_all_levels"
              class="f_mr10"
              :props="{ checkStrictly: item.change_on_select, multiple: true }"
              clearable
            />
          </template>
          <el-input size="small" v-else-if="item.type === 'input'" v-model="filters[item.model]" />
        </el-form-item>
      </el-form>
    </div>
    <el-row type="flex" justify="start" class="f_mt20">
      <el-button type="primary" size="small" class="f_mr10" @click="handleFilter">筛选</el-button>
      <el-button size="small" type="danger" @click="fakeReset">清除</el-button>
    </el-row>
  </div>
</template>

<script>
  import cloneDeep from "lodash/cloneDeep";
  import debounce from "lodash/debounce";
  import { omitKeys, formatArrryJoin } from "./utils/helper";
  import mixins from "./utils/emit";

  const noop = () => [];

  export default {
    name: "CommonFilter",
    mixins: [mixins],
    props: {
      filterList: {
        type: Array,
        default: noop
      },
      SearchInputPlaceholder: {
        type: String,
        default: "请输入关键字"
      },
      rfAppName: {
        type: String,
        default: ""
      },
      rfstats: {
        type: Function
      },
      value: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {
        filters: {
          name: "",
          age: ""
        },
        filtersCopy: {},
        searchValue: ""
      };
    },
    watch: {
      filterList() {
        this.defaultProps();
      }
    },

    methods: {
      handleFilter() {
        this.filters.search = "";
        this.searchValue = "";
        const obj = cloneDeep(this.filters);
        delete obj.searchValue;
        this.handleFilterEvent(obj);
      },

      handleSearch: debounce(
        function() {
          if (!this.searchValue) {
            return this.$message.warning("搜索不能为空");
          }
          // this.filtersCopy = cloneDeep(this.filters)
          this.handleReset();

          this.filters.search = this.searchValue;

          this.handleFilterEvent({
            search: this.searchValue,
            page: 1
          });
          this.restoreFilter();
        },
        1500,
        {
          leading: true,
          trailing: true
        }
      ),

      // 处理数据结构,填充数据

      defaultProps(props = this.filterList) {
        const obj = {};
        props.forEach(item => {
          if (item.defaultValue) {
            return (obj[item.model] = item.defaultValue);
          }
          // 这是用来填充filters的数据
          if (this.value && item.model in this.value) {
            obj[item.model] = this.value[item.model];
            return;
          }
          if (item.type === "select" || item.type === "number-ranger") {
            return (obj[item.model] = []);
          }
          if (item.type === "cascader") {
            return (obj[item.model] = [[]]);
          }
          if (item.type === "radio-group") {
            return (obj[item.model] = []);
          }
          return (obj[item.model] = "");
        });
        this.$emit("input", formatArrryJoin(omitKeys(obj)));
        return this.$set(this, "filters", omitKeys(obj));
      },

      fakeReset() {
        this.handleReset();

        // NOTE 推荐只使用此回调, filters 做了双向绑定，不需要回传数据;

        this.$emit("reset");
      },

      handleReset() {
        // debugger
        this.defaultProps(this.filterList);
        this.$refs.filterForm.resetFields();
        this.restoreFilter();
        this.handleFilterEvent();
      },

      restoreFilter() {
        this.$set(
          this,
          "filters",
          omitKeys({ ...this.filtersCopy, page: 1, page_size: 10 })
        );
      },

      handleFilterEvent: debounce(function lambo(val) {
        const obj = cloneDeep(val);

        // 筛选项的根据数据结构的特殊逻辑
        // 处理级联的数据和数字输入框的数据
        if (obj !== undefined) {
          Object.keys(obj).forEach(key => {
            if (Array.isArray(obj[key])) {
              // 处理数字输入框
              if (obj[key][0] === undefined && obj[key][1] === undefined) {
                delete obj[key];
              }
              // 处理部门级联
              if (obj[key] && Array.isArray(obj[key][0])) {
                if (!obj[key][0].length) {
                  delete obj[key];
                } else {
                  let arr_str = [];
                  obj[key].forEach(item => {
                    if (item[item.length - 1] !== undefined) {
                      arr_str.push(item[item.length - 1]);
                    }
                  });
                  obj[key] = arr_str.join(",");
                }
              }
            }
          });
        }

        // HACK 使用此组件，不要在父组件有 pagination 命名的变量;
        // this.$parent.pagination.page_size = 10
        // this.$parent.pagination.page = 1

        // console.log(this.$parent)

        this.$emit("input", formatArrryJoin(omitKeys(obj), this.filterList));
        this.$emit("filtering", { page: 1, page_size: 10 });
        this.dispatchBro("CommonTable", "filter_action", {});
        // NOTE 推荐只使用此回调, filters 做了双向绑定，不需要回传数据;
        this.$emit("confirm");
      }, 100),

      // 获取到筛选项然后进行筛选

      handleRegulareFilter(filters) {
        this.filters = {
          ...filters
        };
        this.handleFilterEvent(filters);
      }
    }
  };
</script>

<style lang="scss" scoped>
  /deep/ .el-form-item {
    margin-bottom: 0;
  }
</style>
