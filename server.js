var express    = require('express')
  , app        = module.exports = express.createServer()
  , uglify     = require("uglify-js")
  , jsp        = uglify.parser
  , pro        = uglify.uglify
  ;

app.configure(function(){
  app.use(express.bodyParser());
  app.use(app.router);
  app.use(express['static'](__dirname + '/static'));
});

app.post('/', function (request,response) {
  // credit: https://github.com/mishoo/UglifyJS
  try {
    var orig_code = request.body.js
      , ast = jsp.parse(orig_code)
      ;
    ast = pro.ast_mangle(ast);
    ast = pro.ast_squeeze(ast);
    response.send(pro.gen_code(ast));
  } catch (e) {
    response.send({err: e.message});
  }
});

app.listen(process.argv[2]||80);

process.on('uncaughtException', function(err) { console.log(JSON.stringify(err)); });

console.log('surfs up!');