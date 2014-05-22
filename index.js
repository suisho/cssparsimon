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

var combinatorSep = function(parser){
  var empty = eof.result(null)
  var ancestory = regex(/\s+/).result(' ')
  var others = seq(optWs, regex(/[>~+]+/), optWs).map(function(r){
    return r[1]
  })
  var separator
  var combinator = alt(others, ancestory, empty).chain(function(sep){
    separator = sep
    return parser
  }).many()
  return seq(parser, combinator).map(function(r){
    return {
      selector : r,
      combinator : separator

    }
  }).many()
}

var selectorParser = function(){
  //var selector = not(/[\s>~+]/)
  var selector = any
  var attr = regex(/(\[.+\])?/)
  var element = null;

  return selector.map(function(result){
    //attr.
  })
}

module.exports = function(css){
  //var selector = any.many()
  var selector = not(/[\s>~+]/)
  //var combinator = combinatorParser()

  // main parser
  var atom = combinatorSep(selector)
  var exec = lazy(function(){
    return atom
  })

  return exec.parse(css)
}
