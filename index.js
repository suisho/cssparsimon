var Parsimmon = require("parsimmon")

var regex = Parsimmon.regex;
var string = Parsimmon.string;
var lazy = Parsimmon.lazy;
var optWhitespace = Parsimmon.optWhitespace;
var succeed = Parsimmon.succeed
var seq = Parsimmon.seq
var alt = Parsimmon.alt
var any = Parsimmon.any

function lexeme(p) { return p.skip(optWhitespace); }

module.exports = function(css){
  css = ".c+"
  //var combinator = lexeme(regex(/[\s>~+]/))
  var combinator = regex(/[\s>~+]/)
  var selector = regex(/[^\s>~+]+/).map(function(x){
    return x
  })
  var exp = lazy(function(){
    return seq(selector, combinator)

    return selector
    //return seq(selector)
    //return alt(selector, combinator)
  })


  return exp.parse(css)

}
