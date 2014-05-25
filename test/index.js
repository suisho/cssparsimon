var parser = require("../")
var assert = require("assert")

var itParsed = function(css, memo, cb){
  if(cb === undefined){
    cb = memo
    memo = ""
  }
  memo = memo || ""
  it("= "+ css +" "+ memo, function(){

    var result = parser(css)
    cb(result, result.status, result.value)
  })
}

var itStatusTrue = function(css, memo){
  itParsed(css,memo, function(r,st,v){
    //console.log(require("util").inspect([css,r], {depth:null}))
    assert.ok(st)
  })
}

describe("status true", function(){
  itStatusTrue("")
  itStatusTrue("a")
  itStatusTrue("a ")
  itStatusTrue("a  ")
  itStatusTrue("div")
  itStatusTrue("a+b")
  itStatusTrue("a  b")
  itStatusTrue("a b")
  itStatusTrue("a + b")
  itStatusTrue("a +b")
  itStatusTrue("a+ b")
  itStatusTrue("a+b~c")
  itStatusTrue("a[foo] c")
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

describe("selector parser", function(){
  var p = parser.selectorParser()
  it("", function(){
    //console.log(p.parse("a[a]"))
  })
})
describe("attr parser", function(){
  var p = parser.attrParser()
  it("", function(){
    //console.log(p.parse("[a]"))
    //console.log(p.parse("[a='b']"))
  })
})
describe("value parser", function(){
  var itParseParser = function(p, val,expect){
    it(val, function(){
      var parsed = p.parse(val)
      assert.equal(expect, parsed.value)
    })
  }
  var itParseValue = function(val, expect){
    itParseParser(parser.valueParser(), val, expect)
  }

  itParseValue('aaa', 'aaa')
  itParseValue('"aaa"', 'aaa')
  itParseValue('"aa\\"aa"', 'aa\\"aa')
  itParseValue("'aaa'", 'aaa')
  itParseValue("'aa\\'aa'", "aa\\'aa")
})
