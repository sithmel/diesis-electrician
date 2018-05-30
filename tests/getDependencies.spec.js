/* eslint-env node, mocha */
var getDependencies = require('../src')
var assert = require('chai').assert
var getComponents = require('./get-components')

describe('addElectricComponents', function () {
  var deps

  beforeEach(function () {
    var components = getComponents()
    deps = getDependencies(components)
  })

  it('must start a', function () {
    return deps.start.a()
      .then(function (res) {
        assert.equal(res, 'a')
      })
  })

  it('must start b', function () {
    return deps.start.b()
      .then(function (res) {
        assert.equal(res, 'b')
      })
  })

  it('must start c', function () {
    return deps.start.c()
      .then(function (res) {
        assert.equal(res, 'c')
      })
  })

  it('must start d', function () {
    return deps.start.d()
      .then(function (res) {
        assert.equal(res, 'd')
      })
  })

  it('must stop a', function () {
    return deps.stop.a()
  })

  it('must stop b', function () {
    return deps.stop.b()
      .then(function (res) {
        assert.equal(res, 'b')
      })
  })

  it('must stop c', function () {
    return deps.stop.c()
      .then(function (res) {
        assert.equal(res, 'c')
      })
  })

  it('must stop d', function () {
    return deps.stop.d()
      .then(function (res) {
        assert.equal(res, 'd')
      })
  })
})
