var parser = require("../")
var assert = require("assert")

var itParsed = function(css, memo, cb){
  if(cb === undefined){
    cb = memo
    memo = ""
  }
  memo = memo || ""
  it(css +" "+ memo, function(){
    var result = parser(css)
    cb(result, result.status, result.value)
  })
}

var itStatusTrue = function(css, memo){
  itParsed(css,memo, function(r,st,v){
    //console.log(r)
    assert.ok(st)
  })
}

describe("status true", function(){
  itStatusTrue("")
  itStatusTrue("a")
  itStatusTrue("a ")
  itStatusTrue("a  ")
  itStatusTrue("a+b")
  itStatusTrue("a  b")
  itStatusTrue("a b")
  itStatusTrue("a + b")
  itStatusTrue("a +b")
  itStatusTrue("a+ b")
  itStatusTrue("a+b~c", "attr")
  itStatusTrue("a[foo]", "attr")
})

describe("combinator", function(){
  itParsed("a>b", function(r,st,v){
    assert.equal(v[0].combinator, ">")
    assert.equal(v[1].combinator, null)
  })
  itParsed("a b", function(r,st,v){
    assert.equal(v[0].combinator, " ")
    assert.equal(v[1].combinator, null)
  })
  itParsed("a > b", function(r,st,v){
    assert.equal(v[0].combinator, ">")
    assert.equal(v[1].combinator, null)
  })
  itParsed("a> b", function(r,st,v){
    assert.equal(v[0].combinator, ">")
    assert.equal(v[1].combinator, null)
  })
  itParsed("a >b", function(r,st,v){
    assert.equal(v[0].combinator, ">")
    assert.equal(v[1].combinator, null)
  })
})
