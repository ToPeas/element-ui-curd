<template>
  <div class="common-form gb_card f_m15">
    <div v-if="sum" class="f_fr f_mt10 f_mr10 f_mb10">
      <span>{{ sumTitle }} : </span>
      <span class="f_fs18 f_fw500">{{ sum }}</span>
    </div>
    <el-table
      :stripe="stripe"
      :border="border"
      :data="dataList"
      size="small"
      ref="table"
      :cell-click="handleCellClick"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
    >
      <!-- 添加expand 类型 -->
      <el-table-column
        type="selection"
        width="40"
        v-if="selection"
        :fixed="true"
        :resizable="false"
        header-align="center"
        align="center"
      />

      <el-table-column
        v-for="item in tableList"
        :label="item.label"
        :key="item.prop"
        :width="item.width"
        :prop="item.prop"
        :fixed="fixColed(item)"
        :type="item.type"
        :align="item.align || 'center'"
        :sortable="item.sortable"
      >
        <template slot="header" v-if="item.renderHeader">
          <component :is="item.renderHeader" />
        </template>
        <template slot-scope="scope">
          <component v-if="item.render" :is="item.render" :row="scope.row" />
          <span v-else>{{ scope.row[item.prop] }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, prev, pager, next, sizes, jumper"
      :current-page.sync="currentPage"
      :total="total"
      @size-change="handleSizeChange"
      :page-sizes="[10, 20, 25, 50, 100]"
      :page-size="page_size"
      class="f_mt20 f_tar"
      v-if="pagination"
    />
  </div>
</template>

<script lang="jsx">
import mixins  from '../../utils/emit.js'
const noop = () => []

export default {
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
      )
      this.$emit('filtering', { page: val, page_size: this.page_size, ordering: this.orderStr })
    },

    orderStr (val) {
      this.$emit('handSortChange', val)
      this.$emit('update:paginationOption',
        { page: this.page, page_size: this.page_size, ordering: val },
      )
      this.$emit('filtering', { page: this.currentPage, page_size: this.page_size, ordering: val })
    },

  },

  methods: {
    handleSelectionChange (arr) {
      this.$emit('selection-change', arr)
      this.$emit('update:selectItems', arr) // 更新上面组件的绑定的props
    },
    handleCellClick () {
      this.$emit('cell-click', arguments)
    },

    handleSizeChange (page_size) {
      this.page_size = page_size
      this.$emit('update:paginationOption',
        { page: this.page, page_size: this.page_size },
      )
      this.$emit('filtering', { page_size, ordering: this.orderStr })
    },
    sortChange (params) {
      if (params.order === null) {
        this.orderStr = ''
      } else if (params.order === 'ascending') {
        this.orderStr = params.prop
      } else if (params.order === 'descending') {
        this.orderStr = '-' + params.prop
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
      this.currentPage = currentPage || 1
      this.page_size = page_size || 10
    })
  },
}
</script>
