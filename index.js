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
var eof = Parsimmon.eof

var lsqBlanket = lexeme(string("["))
var rsqBlanket = lexeme(string("]"))

function dbg(x){
  console.log("debug:" , x)
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

var combinatorParser = function(){
  var empty = string('').result(null)
  var ancestory = regex(/\s+/).result(' ')
  var others = seq(optWs, regex(/[>~+]+/), optWs).map(function(r){
    return r[1]
  })
  return lazy(function(){
    return alt(others, ancestory, empty)
  })
}

var selectorParser = function(){
  var selector = not(/[\s>~+]/)
  return selector
}

module.exports = function(css){
  var selector = selectorParser()
  var combinator = combinatorParser()

  // main parser
  var atom = seq(selector,combinator).map(function(r){
    return {
      selector : r[0],
      combinator : r[1]
    }
  }).many()
  var exec = lazy(function(){
    return atom
  })

  return exec.parse(css)
}
