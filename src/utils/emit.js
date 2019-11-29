function _broadcast(name, eventName, params) {
  this.$children.forEach(function(child) {
    var name = child.$options.name

    if (name === name) {
      child.$emit.apply(child, [eventName].concat(params))
    } else {
      _broadcast.apply(child, [name, eventName].concat([params]))
    }
  })
}

export default {
  methods: {
    dispatch: function dispatch(parentName, eventName, params) {
      var parent = this.$parent || this.$root
      var name = parent.$options.name

      while (parent && (!name || name !== parentName)) {
        parent = parent.$parent

        if (parent) {
          parentName = parent.$options.name
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params))
      }
    },
    broadcast: function broadcast(name, eventName, params) {
      _broadcast.call(this, name, eventName, params)
    },
    dispatchBro: function dispatchBro(name, eventName, params) {
      const parent = this.$parent || this.$root
      // debugger
      parent.$children.forEach(function(child) {
        // debugger
        var name = child.$options.name
        if (name === name) {
          child.$emit.apply(child, [eventName].concat(params))
        }
      })
    },
  },
}
