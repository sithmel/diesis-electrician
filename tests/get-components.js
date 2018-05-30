/* eslint-env node, mocha */
var assert = require('chai').assert

function getComponents () {
  return {
    d: {
      start: function (a, b, c, next) {
        assert.equal(a, 'a')
        assert.equal(b, 'b')
        assert.equal(c, 'c')
        next(null, 'd')
      },
      stop: function (next) {
        next(null, 'd')
      },
      dependsOn: ['a', 'b', 'c']
    },
    c: {
      start: function (a, b, next) {
        assert.equal(a, 'a')
        assert.equal(b, 'b')
        next(null, 'c')
      },
      stop: function (next) {
        next(null, 'c')
      },
      dependsOn: ['a', 'b']
    },
    a: { // missing stop
      start: function (next) {
        next(null, 'a')
      },
      dependsOn: []
    },
    b: { // missing dependsOn
      start: function (next) {
        next(null, 'b')
      },
      stop: function (next) {
        next(null, 'b')
      }
    }
  }
}

module.exports = getComponents
