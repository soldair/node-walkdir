var test = require('tap').test,
walkdir = require('../walkdir.js');

var expectedPaths = {
'dir/ignore/a':'dir',
'dir/ignore/a/a1':'file',
'dir/ignore/a/c':'dir',
'dir/ignore/a/b':'ignore',
'dir/ignore/a/c/c1':'file',
'dir/ignore/b':'dir',
'dir/ignore/b/b1':'file',
'dir/ignore/c':'dir',
'dir/ignore/c/c1':'file'
};

test('async events',function(t){
  var paths = [],
  files = [],
  dirs = [],
  ignore = ["a/b"];

  var emitter = walkdir(__dirname+'/dir/ignore',{ignore_paths:ignore, ignore_mounts:true}, function(path){
    //console.log('path: ',path);
    //console.log(path.replace(__dirname+'/',''));
    paths.push(path.replace(__dirname+'/',''));
  });

  emitter.on('directory',function(path,stat){
    //console.log("directory" + path);
    dirs.push(path.replace(__dirname+'/',''));
  });

  emitter.on('file',function(path,stat){
    //console.log('file: ',path);
    files.push(path.replace(__dirname+'/',''));
  });
  emitter.on('ignorepath',function(path){
    //console.log('ignore: ',path);
    ignore.push(path.replace(__dirname+'/',''));
  });
  emitter.on('end',function(){

     files.forEach(function(v,k){
       t.equals(expectedPaths[v],'file','path from file event should be file');
     });

     Object.keys(expectedPaths).forEach(function(v,k){
       if(expectedPaths[v] == 'file') {
          t.ok(files.indexOf(v) > -1,'should have file in files array');
       }
     });

     dirs.forEach(function(v,k){
       t.equals(expectedPaths[v],'dir','path from dir event should be dir '+v);
     });

     Object.keys(expectedPaths).forEach(function(v,k){
       if(expectedPaths[v] == 'dir') {
          t.ok(dirs.indexOf(v) > -1,'should have dir in dirs array');
       }
     });

     Object.keys(expectedPaths).forEach(function(v,k){
       if(expectedPaths[v] != "ignore") {
         t.ok(paths.indexOf(v) !== -1,'should have found all expected paths '+v);
       }
     });

     t.end();
  });
});
