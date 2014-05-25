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


var cssparsimmon = (function(){
  var combinators = {
    'descendant' : '\s',
    'child' : '>',
    'adjacent' : '+',
    'sibiling' : '~'
  }

  var combinator = lazy(function(){
    var empty = eof.result(null)
    var ancestory = regex(/\s+/).result(' ')
    var others = seq(optWs, regex(/[>~+]+/), optWs).map(function(r){
      return r[1]
    })

    return alt(others, ancestory, empty)
  })

  var value = lazy(function(){
    var double = string('"').then(regex(/(\\"|[^"])+/)).skip(string('"'))
    var single = string("'").then(regex(/(\\'|[^'])+/)).skip(string("'"))
    var none = letters // TODO: Not exactly
    return alt(double, single, none)
  })

  var attr = lazy(function(){
    var attrCallParser = function(){
      var keys = regex(/[^\]]+/)
      var operators = regex(/[^$~]?=/)
      return alt(
        seq(keys, operators, value),
        keys
      )
    }
    return string("[").chain(attrCallParser).skip(string("]"))
  })

  var element = lazy(function(){
    var elm = not(/[\s>~+\[]/)
    return alt(
      seq(elm, attr.many())
    )
  })

  // endpoint
  var selector = lazy(function(){
    return seq(element, combinator).map(function(r){
      return {
        element : r[0],
        combinator : r[1]
      }
    }).many()
  })

  return {
    selector : selector,
    value : value,
    element : element,
    attr : attr
  }
})()


module.exports = function(css){
  return cssparsimmon.selector.parse(css)
}
module.exports.valueParser = cssparsimmon.value
module.exports.elementParser = cssparsimmon.element
module.exports.attrParser = cssparsimmon.attr
