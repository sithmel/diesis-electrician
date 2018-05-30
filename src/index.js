const diogenesElectrician = require('diogenes-electrician')
const Diogenes = require('diogenes')
const dependency = require('diesis').dependency

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getDep(keys, registry, prefix) {
  prefix = prefix || ''
  return keys
    .map(key => {
      return [`${prefix}${prefix ? capitalize(key) : key}`, dependency(() => registry.run(key))]
    })
}

function getDependencies(components) {
  const registry = Diogenes.getRegistry()
  const stopRegistry = Diogenes.getRegistry()
  // components is an object name->electrician component
  diogenesElectrician.addElectricComponents(registry, stopRegistry, components)
  const keys = Object.keys(components)
  return getDep(keys, registry).concat(getDep(keys, stopRegistry, 'stop'))
    .reduce((obj, [k, v]) => {
      obj[k] = v
      return obj
    }, {})
}


module.exports = getDependencies
