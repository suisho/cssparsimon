var VerEx = require("verbal-expressions");
suite("not regex", function(){
  bench("/[^a]+/", function(){
    var reg = /[^abc]+/
    reg.test("a")
    reg.test("b")
  })
  bench("/[^\\a]+/", function(){
    var reg = /[^\a\b\c]+/
    reg.test("a")
    reg.test("b")
  })
  bench("/[a]+/", function(){
    var reg = /[a]+/
    reg.test("a")
    reg.test("b")
  })
  bench("/((?![abc]).)+/", function(){
    var reg = /((?!a).)+/
    reg.test("a")
    reg.test("b")
  })
})
