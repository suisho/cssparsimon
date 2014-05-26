var Parsimmon = require("parsimmon")
var VerEx = require("verbal-expressions");

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

var regNot = function(re){
  return RegExp("((?!"+re.source+").)+")
}

var regOr = function(reArray){
  return RegExp("[" + reArray.map(function(re){
    return re.source || re
  }).join("") + "]")
}

function not(reg){
  return regex(regNot(reg))
}

var Symbols = function(){}
//Symbols.prototype.combinators = [">", "+", "~", "\\s"]
Symbols.prototype.combinators = [">", "+", "~", "\\s"]
Symbols.prototype.attrOperators = ["$"]
var symbols = new Symbols()
var cssparsimmon = (function(){

  var combinator = lazy(function(){
    var empty = optWs.then(eof).result(null)
    var ancestory = regex(/\s+/).result(' ')
    var othersReg = regex(regOr(symbols.combinators))
    var others = seq(optWs, othersReg, optWs).map(function(r){
      return r[1]
    })

    return alt(empty, others, ancestory)
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
      var operators = regex(/[\^$~]?=/)
      return alt(
        seq(keys, operators, value).map(function(r){
          return {
            attr : r[0],
            operator : r[1],
            value : r[2]
          }
        }),
        keys.map(function(r){
          return { attr : r }
        })
      )
    }
    return string("[").chain(attrCallParser).skip(string("]"))
  })

  var element = lazy(function(){
    var elm = not(regOr(symbols.combinators))
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
