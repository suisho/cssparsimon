var Parsimmon = require("parsimmon")

// Parsimmon
var regex = Parsimmon.regex;
var string = Parsimmon.string;
var lazy = Parsimmon.lazy;
var optWhitespace = Parsimmon.optWhitespace;
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

function lexeme(p) { return p.skip(optWhitespace); }
function not(reg){
  return regex(RegExp("((?!"+reg.source+").)+"))
}
var empty = string('').result(null)
var ancestory = regex(/\s+/).result(' ')
var someCombinatorReg = regex(/[>~+]+/)
var someCombinators = seq(optWhitespace, someCombinatorReg, optWhitespace).map(function(r){
  return r[1]
})

var combinatorParser = function(){
  var combinators = someCombinators
  return lazy(function(){
    return alt(combinators, ancestory, empty)
  })
}

module.exports = function(css){
  // selector
  var selector = not(/[\s>~+]/) // TODO: create NOT

  // combinator
  var combinator = combinatorParser()

  // main parser
  var atom = seq(selector , combinator).map(function(r){
    return {
      selector : r[0],
      combinator : r[1]
    }
  }).many()
  var exec = lazy(function(){
    return atom
  })

  return atom.parse(css)
}
