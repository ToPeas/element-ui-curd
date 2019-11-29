// 删除对象里面为空的value，包括数组里面的undefined，还有[[],[]]的形式
export function omitKeys(obj, excludeKeys = []) {
  const _obj = _cloneDeep(obj)
  if (obj !== undefined) {
    Object.keys(_obj).forEach((key) => {
      if (
        (_obj[key] === null || _obj[key] === '' || _obj[key] === undefined) &&
        excludeKeys.indexOf(key) === -1
      ) {
        delete _obj[key]
      }
      if (Object.prototype.toString.call(_obj[key]) === '[object Array]') {
        if (_obj[key].length === 0) {
          delete _obj[key]
        }
      }

      if (Object.prototype.toString.call(_obj[key]) === '[object Object]') {
        _obj[key] = omitKeys(_obj[key])
      }
    })
  }
  return _obj
}

// 把提交对象里面的一级数组形式变成字符串
export function formatArrryJoin(obj, filterList) {
  const _obj = _cloneDeep(obj)

  if (obj !== undefined) {
    Object.keys(_obj).forEach((key) => {
      if (Array.isArray(_obj[key])) {
        // console.log(Object.prototype.toString.call(_obj[key][0]))
        if (key === 'patchQuestion.vue') {
          // 岗位筛选 => cascader => 只取最后一级
          _obj[key] = _obj[key][_obj[key].length - 1]
        } else if (Object.prototype.toString.call(_obj[key][0]) === '[object Date]') {
          const filteritem = filterList ? filterList.find((item) => item.model === key) : {}
          if (filteritem.type === 'time-ranger') {
            _obj[key] = dateRangeFormat(_obj[key], 'HH:mm:ss').join(',')
          } else if (filteritem.type === 'date-ranger') {
            _obj[key] = dateRangeFormat(_obj[key], 'YYYY-MM-DD').join(',')
          } else {
            _obj[key] = dateRangeFormat(_obj[key]).join(',')
          }
        } else {
          _obj[key] = _obj[key].join(',')
        }
      }
    })
  }
  return _obj
}
