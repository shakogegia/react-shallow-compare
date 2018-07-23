import _ from 'lodash'

const debug = false
const log = (...args) => {
  if (debug) {
    console.log('shallowEqual:: ', new Date(), ' - ', ...args)
  }
}

const globalExcludes = [
  'size',
  '_root',
  '__ownerID',
  '__hash',
  '__altered',
  'descriptors',
  'navigation',
  'emitters',
  'handlers',
]

const shallowEqualJS = (props, nextProps, keys) => {
  const shouldUpdate = false

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]

    let oldValue = props[key]
    const newValue = nextProps[key]

    if (typeof newValue === 'function') {
      continue
    }

    const isImmutable = !!(newValue && newValue.get && newValue.getIn)

    if (isImmutable) {
      oldValue = oldValue || new Map()
      if (!_.isEqual(newValue, oldValue)) {
        log('UPDATED:: ', key, 'TYPEOF:: immutable')
        return true
      }
    }

    if (typeof newValue !== 'undefined' && oldValue === 'undefined') {
      log('UPDATED:: ', key, 'TYPEOF:: prev was undefined')
      return true
    }

    if (typeof newValue === 'object') {
      if (!_.isEqual(newValue, oldValue)) {
        log('UPDATED:: ', key, 'TYPEOF:: object')
        return true
      }
    }

    if (typeof newValue === 'string'
        || typeof newValue === 'number'
        || typeof newValue === 'boolean'
    ) {
      if (newValue !== oldValue) {
        log('UPDATED:: ', key, 'TYPEOF:: string|number|boolean', ' prev::', oldValue, ' new::', newValue)
        return true
      }
    }

    if (newValue !== oldValue) {
      log('UPDATED:: ', key, 'TYPEOF:: just not equals')
      return true
    }
  }

  return shouldUpdate
}

const shallowCompare = (props, nextProps) => {
  const oldProps = _.omit(props, globalExcludes)
  const newProps = _.omit(nextProps, globalExcludes)
  const keys = Object.keys(props)
  return shallowEqualJS(oldProps, newProps, keys)
}

const shallowCompareWithState = (data, nextProps, nextState) => {
  const { props = {}, state = {} } = data
  const stateKeys = Object.keys(state)

  for (let i = 0; i < stateKeys.length; i++) {
    const key = stateKeys[i]
    if (state[key] !== nextState[key]) {
      return true
    }
  }

  return shallowCompare(props, nextProps)
}

const shallowCompareOnly = keys => (props, nextProps) => {
  const oldProps = {}
  const newProps = {}
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]

    oldProps[key] = props[key]
    newProps[key] = nextProps[key]
  }

  return shallowCompare(oldProps, newProps)
}

const shallowCompareExclude = keys => (props, nextProps) => {
  const oldProps = _.omit(props, keys)
  const newProps = _.omit(nextProps, keys)

  return shallowCompare(oldProps, newProps)
}

export {
  shallowCompare,
  shallowCompareWithState,
  shallowCompareOnly,
  shallowCompareExclude,
}
