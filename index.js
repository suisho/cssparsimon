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

var lsqBlanket = lexeme(string("["))
var rsqBlanket = lexeme(string("]"))

function dbg(x){
  console.log("debug:" , x)
  return x
}

function lexeme(p) { return p.skip(optWhitespace); }

module.exports = function(css){
  function combinatorSep(parser) {
    var combiParser = regex(/([\s>~+])/m).then(parser).many()
    return seq(parser, combiParser).map(function(results) {
      // Flatten array
      return [results[0]].concat(results[1]);
    }).or(succeed([]));
  }
  css = ".cc>a+b"
  //var combinator = lexeme(regex(/[\s>~+]/))
  //var combinator = regex(/[\s>~+]/).map(dbg)
  var selector = regex(/[^\s>~+]+/).map(dbg)
  var atom = combinatorSep(selector)

  var exp = lazy(function(){
    return atom
    //return seq(selector, combinator)

    //return selector
    //return seq(selector)
    //return alt(selector, combinator)
  })


  return exp.parse(css)

}
