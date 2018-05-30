diesis-electrician
==================
This is an adapter for using [electrician](https://github.com/tes/electrician) components in with Diesis.

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
You get back an object with a function for each electric component. And a function for stopping that component too.
```js
const deps = diesisElectrician({
  config: new Conflab(),
  endpoints: new Endpoints(),
  metrics: new ElectricMetrics(),
  refdata: new Refdata(),
  server: new Server(),
})

deps.config() // start this service and all the deps
deps.refdata() // start this service and all the deps

deps.stopConfig() // stop this service and all the deps
deps.stopRefdata() // stop this service and all the deps
```
So you can use these reference as dependencies
```js
const dependency = require('diesis').dependency
const doSomething = dependency([deps.config, deps.refdata], (config, refdata) => {
  // ...
})
```
