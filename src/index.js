const { promisify } = require('util')
const { dependency, memoize, runMulti } = require('diesis')
const _ = require('lodash')
const Toposort = require('toposort-class')

function sequence(components) {
  const nameDeps = _(components)
    .toPairs()
    .map((pair) => [_.head(pair), _.last(pair).dependsOn]);
  const withDeps = nameDeps.filter(_.last);
  const noDeps = nameDeps.difference(withDeps).map(_.head).value();

  return _.uniq(
    withDeps
    .reduce(function (acc, pair) {
      return acc.add(_.head(pair), _.last(pair));
    }, new Toposort())
    .sort()
    .reverse()
    .concat(noDeps));
}

function invertedDeps (name, components) {
  return Object.keys(components)
    .map(function (n) {
      var dependsOn = components[n].dependsOn || []
      if (dependsOn.indexOf(name) !== -1) {
        return n
      }
    })
    .filter(function (item) {
      return !!item
    })
}

function decorateComp(f) {
  f = f ? promisify(f) : () => Promise.resolve()
  return memoize(f)
}

function zip(a1, a2) {
  return a1.map((item, i) => [item, a2[i]])
}

function pairsToObj(pairs) {
  return pairs
    .reduce((obj, pair) => {
      obj[pair[0]] = pair[1]
      return obj
    }, {})
}

function runAllMethod(registry) {
  return function (obj) {
    const keys = Object.keys(registry)
    return runMulti(keys.map((key) => registry[key]), obj)
      .then((res) => pairsToObj(zip(keys, res)))
  }
}

function getDependencies(components) {
  const startRegistry = {}
  const stopRegistry = {}

  sequence(components)
    .forEach((name) => {
      const comp = components[name]
      if (typeof comp === 'undefined') return

      const dependencies = (comp.dependsOn || [])
        .map((name) => {
          if (name in startRegistry) {
            return startRegistry[name]
          }
          return name
        })
      const startFunc = comp.start || function (cb) {cb()}
      startRegistry[name] = dependency(dependencies, decorateComp(startFunc.bind(comp)))
    })

  sequence(components).reverse()
    .forEach((name) => {
      const comp = components[name]
      if (typeof comp === 'undefined') return
      const dependencies = invertedDeps (name, components)
        .map((name) => {
          if (name in stopRegistry) {
            return stopRegistry[name]
          }
          return name
        })
      const stopFunc = comp.stop || function (cb) {cb()}
      stopRegistry[name] = dependency(dependencies, () => decorateComp(stopFunc.bind(comp))())
    })

  const startAll = runAllMethod(startRegistry)
  const stopAll = runAllMethod(stopRegistry)

  const getSystem = (obj) => ({
    start: (cb) => startAll(obj)
      .then(() => cb(null))
      .catch((err) => cb(err)),
    stop: stopAll(obj)
      .then(() => cb(null))
      .catch((err) => cb(err))
  })

  return { startRegistry, stopRegistry, startAll, stopAll, getSystem }
}

module.exports = getDependencies
