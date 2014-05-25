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
    try{
      assert.ok(st)
    }catch(e){
      console.log(require("util").inspect([css,r], {depth:null}))
      throw e
    }
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
  itStatusTrue("aa+bb~cc")
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
  var p = parser.elementParser
  it("", function(){
    //console.log(p.parse("a[a]"))
  })
})

describe("breakdon parsers", function(){
  var itParseParser = function(p, val,expect){
    it(val, function(){
      var parsed = p.parse(val)
      assert.deepEqual(expect, parsed.value)
    })
  }

  describe("attr parser", function(){
    var itParseAttr = function(val, expect){
      itParseParser(parser.attrParser, val, expect)
    }
    itParseAttr("[a]", {attr : "a"})
    itParseAttr("[a=b]", {
      attr : "a",
      operator : "=",
      value : "b"
    })
  })

  describe("value parser", function(){
    var itParseValue = function(val, expect){
      itParseParser(parser.valueParser, val, expect)
    }

    itParseValue('aaa', 'aaa')
    itParseValue('"aaa"', 'aaa')
    itParseValue('"aa\\"aa"', 'aa\\"aa')
    itParseValue("'aaa'", 'aaa')
    itParseValue("'aa\\'aa'", "aa\\'aa")
  })
})
