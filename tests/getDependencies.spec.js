/* eslint-env node, mocha */
var getDependencies = require('../src')
var assert = require('chai').assert
var getComponents = require('./get-components')

describe('getDependencies', function () {
  var deps

  beforeEach(function () {
    var components = getComponents()
    deps = getDependencies(components)
  })

  it('start all', function () {
    return deps.startAll()
      .then(function (res) {
        assert.deepEqual(res, { a: 'a', b: 'b', c: 'c', d: 'd', e: 'e' })
      })
  })

  it('stop all', function () {
    return deps.stopAll()
      .then(function (res) {
        assert(res)
      })
  })

  it('must start a', function () {
    return deps.startRegistry.a()
      .then(function (res) {
        assert.equal(res, 'a')
      })
  })

  it('must start b', function () {
    return deps.startRegistry.b()
      .then(function (res) {
        assert.equal(res, 'b')
      })
  })

  it('must start c', function () {
    return deps.startRegistry.c()
      .then(function (res) {
        assert.equal(res, 'c')
      })
  })

  it('must start d', function () {
    return deps.startRegistry.d()
      .then(function (res) {
        assert.equal(res, 'd')
      })
  })

  it('must start e', function () {
    return deps.startRegistry.e()
      .then(function (res) {
        assert.equal(res, 'e')
      })
  })

  it('must stop a', function () {
    return deps.stopRegistry.a()
  })

  it('must stop b', function () {
    return deps.stopRegistry.b()
      .then(function (res) {
        assert.equal(res, 'b')
      })
  })

  it('must stop c', function () {
    return deps.stopRegistry.c()
      .then(function (res) {
        assert.equal(res, 'c')
      })
  })

  it('must stop d', function () {
    return deps.stopRegistry.d()
      .then(function (res) {
        assert.equal(res, 'd')
      })
  })
})
