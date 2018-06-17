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
  return function (cb) {
    const keys = Object.keys(registry)
    const promise = runMulti(keys.map((key) => registry[key]))
      .then((res) => pairsToObj(zip(keys, res)))

    if (!cb) return promise

    promise
      .then(res => cb(null, res))
      .catch(err => cb(err))
  }
}

function getDependencies(components) {
  const startRegistry = {}
  const stopRegistry = {}

  sequence(components)
    .forEach((name) => {
      const comp = components[name]
      const dependencies = (comp.dependsOn || [])
        .map((name) => startRegistry[name])
      const startFunc = comp.start || function (cb) {cb()}
      const stopFunc = comp.stop || function (cb) {cb()}
      startRegistry[name] = dependency(dependencies, decorateComp(startFunc.bind(comp)))
      stopRegistry[name] = dependency(decorateComp(stopFunc.bind(comp)))
    })

  const start = runAllMethod(startRegistry)
  const stop = runAllMethod(stopRegistry)

  return { startRegistry, stopRegistry, start, stop }
}

module.exports = getDependencies
