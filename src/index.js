const diogenesElectrician = require('diogenes-electrician')
const Diogenes = require('diogenes')
const dependency = require('diesis').dependency

function getDep(keys, registry) {
  return keys
    .map(key => {
      return [key, dependency(() => registry.run(key))]
    })
    .reduce((obj, [k, v]) => {
      obj[k] = v
      return obj
    }, {})
}

function getDependencies(components) {
  const registry = Diogenes.getRegistry()
  const stopRegistry = Diogenes.getRegistry()
  // components is an object name->electrician component
  diogenesElectrician.addElectricComponents(registry, stopRegistry, components)
  const keys = Object.keys(components)
  const start = getDep(keys, registry)
  const stop = getDep(keys, stopRegistry)
  return { start, stop }
}


module.exports = getDependencies
