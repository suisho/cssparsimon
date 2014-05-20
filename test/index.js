var parser = require("../")
var assert = require("assert")

var itParsed = function(css, cb){
  it(css, function(){
    var result = parser(css)
    cb(result, result.status, result.value)
  })
}

var itStatusTrue = function(css){
  itParsed(css, function(r,st,v){
    assert.ok(st)
  })
}

describe("status true", function(){
  itStatusTrue("a")
  itStatusTrue("a ")
  itStatusTrue("a  ")
  itStatusTrue("a+b")
  itStatusTrue("a  b")
  itStatusTrue("a b")
  itStatusTrue("a + b")
  itStatusTrue("a +b")
  itStatusTrue("a+ b")
  itStatusTrue("a+b~c")
})

describe("combinator", function(){
  itParsed("a>b", function(r,st,v){
    assert.equal(v[0].combinator, ">")
    assert.equal(v[1].combinator, null)
  })
  itParsed("a b", function(r,st,v){
    console.log(v)
    assert.equal(v[0].combinator, " ")
    assert.equal(v[1].combinator, null)
  })
})
