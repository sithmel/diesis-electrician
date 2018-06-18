diesis-electrician
==================
This is an adapter for using [electrician](https://github.com/tes/electrician) components with Diesis.

How it works
------------
You import the adapter like this:
```js
const diesisElectrician = require('diesis-electrician')
```
Then you pass a map of electric components:
```js
const deps = diesisElectrician(components)
```
You get back an object with startAll/stopAll methods:
```js
const deps = diesisElectrician({
  config: new Conflab(),
  endpoints: new Endpoints(),
  metrics: new ElectricMetrics(),
  refdata: new Refdata(),
  server: new Server(),
})

deps.startAll() // ... starts all components
  .then(obj => {
    // obj is a map with all components
  })

deps.stopAll() // ... stops all components
  .then(() => {
  })
```
Every dependency not declared in the components is intended as additional argument that can be sent in the startAll/stopAll method:
```js
deps.startAll({ value: 5 })
```
startAll/stopAll are convenience methods build on top of runMulti:
```js
runMulti([config, endpoints, metrics, refdata, server], { value: 5 })
```
**deps** contains also 2 registries (startRegistry and stopRegistry) with all dependencies that you can export and use:
```js
const getConfig = deps.startRegistry.config
const getRefdata = deps.startRegistry.refdata

const { dependency } = require('diesis')
const doSomething = dependency([getConfig, getRefdata], (config, refdata) => {
  // ...
})
```
