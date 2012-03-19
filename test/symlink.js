var test = require('tap').test,
recursedir = require('../recursedir.js');


test('follow symlinks',function(t){

  var links = [],paths = [];

  var emitter = recursedir.find(__dirname+'/dir/symlinks/dir2');

  emitter.on('path',function(path,stat){
    paths.push(path);
  });

  emitter.on('link',function(path,stat){
    links.push(path.replace(__dirname+'/',''));
  });


  emitter.on('end',function(){
    console.log(links);
    console.log(paths);
    t.end();
  });
});
