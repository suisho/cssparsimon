var Parsimmon = require("parsimmon")

var regex = Parsimmon.regex;
var string = Parsimmon.string;
var lazy = Parsimmon.lazy;
var succeed = Parsimmon.succeed
var seq = Parsimmon.seq
var alt = Parsimmon.alt
var any = Parsimmon.any


module.exports = function(css){
  css = ".c "
  var combinator = regex(/[\s>~+]/)
  var selector = regex(/(?!.*[\s>~+]).*/)

  var exp = lazy(function(){
    //return seq(selector)
    return seq(selector, combinator)
  })


  return exp.parse(css)

}
