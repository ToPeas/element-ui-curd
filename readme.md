### 基于 element-ui 的业务组件

提供一个思路，table 组件的封装

api 按照`element-ui`设计

* `tableList`是配置表格的展示的数据。

接受数组

```js
 [
    {
      label: '资产编号',
      prop: 'asset_id',
      width: 120,
      render: {
        props: ['row'],
        render() {
          const jsx = (
            <router-link
              target={'_blank'}
              to={{ name: 'AssetDetail', params: { id: this.row.id } }}>
              <span>{this.row.asset_id}</span>
            </router-link>
          )

          return (
            <span>
              {jsx}
              {this.row.asset_city_cn && (
                <p>
                  <el-tag
                    style={{ color: '#fff' }}
                    color={colors[this.row.asset_city % colors.length]}
                    size={'mini'}>
                    {this.row.asset_city_cn}
                  </el-tag>
                </p>
              )}
            </span>
          )
        }
      }
    },
    {
      label: '资产类型',
      prop: 'first_type_cn',
      width: 100
    }
  ]
```

* `datalist` 是传递给table的数据

接受数组

