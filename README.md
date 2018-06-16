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
You get back an object with start/stop method compatible with electrician:
```js
const deps = diesisElectrician({
  config: new Conflab(),
  endpoints: new Endpoints(),
  metrics: new ElectricMetrics(),
  refdata: new Refdata(),
  server: new Server(),
})

deps.start((err) => {
  // ... starts all components
})

deps.stop((err) => {
  // ... stops all components
})
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
