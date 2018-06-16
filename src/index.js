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

function runAllMethod(registry) {
  return function (cb) {
    const promise = runMulti(Object.keys(registry).map((key) => registry[key]))
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
      startRegistry[name] = dependency(dependencies, decorateComp(comp.start))
      stopRegistry[name] = dependency(decorateComp(comp.stop))
    })

  const start = runAllMethod(startRegistry)
  const stop = runAllMethod(stopRegistry)

  return { startRegistry, stopRegistry, start, stop }
}


module.exports = getDependencies
