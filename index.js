var Parsimmon = require("parsimmon")
var VerEx = require("verbal-expressions");

// Parsimmon
var regex = Parsimmon.regex;
var string = Parsimmon.string;
var lazy = Parsimmon.lazy;
var optWs = Parsimmon.optWhitespace;
var ws = Parsimmon.whitespace;
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

function not(reg){
  return regex(regNot(reg))
}

var optSymbol = function(chars){
  return regex(RegExp("["+chars.join("")+"]?"))
}

// regex match chars
var symbol = function(chars){
  return regex(RegExp("["+chars.join("")+"]"))
}
// not symbols
var othersOf = function(chars){
  return regex(RegExp("[^"+chars.join("")+"]+"))
}


var cssparsimmon = (function(){
  var combinatorSymbols = [">", "+", "~", '\\s']
  var combinator = lazy(function(){
    var empty = optWs.then(eof).result(null)
    var ancestory = ws.result(' ')
    var othersReg = symbol(combinatorSymbols)
    var others = seq(optWs, othersReg, optWs).map(function(r){
      return r[1]
    })

    return alt(empty, others, ancestory)
  })

  var element = lazy(function(){
    var elm = othersOf(combinatorSymbols)
    return alt(
      seq(elm, attr.many())
    )
  })

  var value = lazy(function(){
    var double = string('"').then(regex(/(\\"|[^"])+/)).skip(string('"'))
    var single = string("'").then(regex(/(\\'|[^'])+/)).skip(string("'"))
    var none = letters // TODO: Not exactly
    return alt(double, single, none)
  })

  var attr = lazy(function(){
    var operatorSymbols = ["\\^", "$", "~"]
    var keys = othersOf(operatorSymbols.concat(["\\]", "="]))
    var operators = seq(optSymbol(operatorSymbols), string("="))
    var keyAndValue = seq(keys, operators, value).map(function(r){
      return {
        attr : r[0],
        operator : r[1].join(""),
        value : r[2]
      }
    })
    var onlyKey = keys.map(function(r){
      return { attr : r }
    })
    var attrLiteral = alt(keyAndValue, onlyKey)
    return string("[").then(attrLiteral).skip(string("]"))
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
