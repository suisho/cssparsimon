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

var combinatorSep = function(parser){
  var empty = eof.result(null)
  var ancestory = regex(/\s+/).result(' ')
  var others = seq(optWs, regex(/[>~+]+/), optWs).map(function(r){
    return r[1]
  })
  var comb
  var combinator = alt(others, ancestory, empty).chain(function(p){
    comb = p
    return parser
  }).many()
  return seq(parser, combinator).map(function(r){

    return {
      selector : r,
      combinator : null
    }
  }).many()
}

/*var between = function(start, end){
  return string(start).then(not(end)).skip(end)
}*/

var valueParser = function(){
  var double = string('"').then(regex(/(\\"|[^"])+/)).skip(string('"'))
  var single = string("'").then(regex(/(\\'|[^'])+/)).skip(string("'"))
  var none = letters
  return alt(double, single, none)
}
var attrCallParser = function(){

}

var attrParser = function(){
  return string("[").then(regex(/([^\]])+/)).skip(string("]"))
}

var selectorParser = function(){
  var selector = not(/[\s>~+]/)
  //var selector = any
  var attr = attrParser()
  var element = null;

  return selector.map(function(result){
    return result
  })
}

var main = function(css){
  //var selector = all
  var selector = not(/[\s>~+]/)
  //var combinator = combinatorParser()

  // main parser
  var atom = combinatorSep(selector)
  var exec = lazy(function(){
    return atom
  })

  return exec.parse(css)
}


module.exports = main
module.exports.valueParser = valueParser
module.exports.selectorParser = selectorParser
module.exports.attrParser = attrParser
