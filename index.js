var Parsimmon = require("parsimmon")

// Parsimmon
var regex = Parsimmon.regex;
var string = Parsimmon.string;
var lazy = Parsimmon.lazy;
var optWs = Parsimmon.optWhitespace;
var succeed = Parsimmon.succeed
var seq = Parsimmon.seq
var alt = Parsimmon.alt
var any = Parsimmon.any
var all = Parsimmon.all
var eof = Parsimmon.eof
var letters = Parsimmon.letters

function dbg(x){
  console.log("=>>>===")
  console.log( x)
  console.log("==<<<==")
  return x
}

function lexeme(p) { return p.skip(optWs); }
function not(reg){
  return regex(RegExp("((?!"+reg.source+").)+"))
}

var combinators = {
  'descendant' : '\s',
  'child' : '>',
  'adjacent' : '+',
  'sibiling' : '~'
}

var combinatorInner = function(combinator, parser){
  return parser
}

var combinatorParser = function(){
  var empty = eof.result(null)
  var ancestory = regex(/\s+/).result(' ')
  var others = seq(optWs, regex(/[>~+]+/), optWs).map(function(r){
    return r[1]
  })

  return lazy(function(){
    return alt(others, ancestory, empty)
  })
}

/*var between = function(start, end){
  return string(start).then(not(end)).skip(end)
}*/

var valueParser = function(){
  var double = string('"').then(regex(/(\\"|[^"])+/)).skip(string('"'))
  var single = string("'").then(regex(/(\\'|[^'])+/)).skip(string("'"))
  var none = letters // TODO: Not exactly
  return alt(double, single, none)
}
var attrCallParser = function(){
  var keys = regex(/[^\]]/)
  var operators = regex(/[^$~]?=/)
  return alt(
    seq(keys, operators,valueParser()),
    keys
  )
}

var attrParser = function(){
  return string("[").chain(attrCallParser).skip(string("]"))
}

var elementParser = function(){
  var selector = not(/[\s>~+]/)
  //var selector = any
  var attr = attrParser()
  var element = null;

  return selector.map(function(result){
    return result
  })
}

var selectorParser = function(elm, comb){
  return seq(elm, comb).map(function(r){
    return {
      element : r[0],
      combinator : r[1]
    }
  }).many()
}

var mainParser = function(){
  //var selector = all
  var element = not(/[\s>~+]/)
  var combinator = combinatorParser()

  // main parser

  return lazy(function(){
    return selectorParser(element, combinator)
  })
}
var main = function(css){
  return mainParser().parse(css)
}


module.exports = main
module.exports.valueParser = valueParser
module.exports.elementParser = elementParser
module.exports.attrParser = attrParser
module.exports.attrParser = attrParser
