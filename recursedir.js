var EventEmitter = require('events').EventEmitter,
fs = require('fs'),
resolve = require('path').resolve;

exports.recurseDir = recurseDir;


function recurseDir(path,options,cb){
  if(typeof options == 'function') {
    cb = options;
  }

  options = options || {};
  var emitter = new EventEmitter();

  var allPaths = (options.returnObject?{}:[]),
  resolved = false,
  inos = {}, 
  ended = 0, 
  jobs=0, 
  job = function(value){
    jobs += value;
    if(value < 1 && !tick) {
      tick = 1;
      process.nextTick(function(){
        tick = 0;
        if(jobs <= 0 && !ended) {
          ended = 1;
          emitter.emit('end');
        }
      });
    }
  }, tick = 0;

  //mapping is stat functions to event names.	
  var statIs = [['isFile','file'],['isDirectory','directory'],['isSymbolicLink','link'],['isSocket','socket'],['isFIFO','fifo'],['isBlockDevice','blockdevice'],['isCharacterDevice','characterdevice']];

  var statter = function (path,first) {
    job(1);
    var statAction = function(err,stat) {
      job(-1);
      if(err) {
        emitter.emit('fail',path,err);
        return;
      }

      //if i have evented this inode already dont again.
      if(inos[stat.dev+stat.ino] && stat.ino) return;
      inos[stat.dev+stat.ino] = 1;

      if (first && stat.isDirectory()) {
        emitter.emit('targetdirectory',path,stat);
        return;
      }

      emitter.emit('path', path, stat);

      var i,name;

      for(var j=0,k=statIs.length;j<k;j++) {
        if(stat[statIs[j][0]]()) {
          emitter.emit(statIs[j][1],path,stat);
          break;
        }
      }
    };
    
    if(options.sync) {
      var stat,e;
      try{
        stat = fs.lstatSync(path);
      } catch (e) { }

      statAction(e,stat);
    } else {
        fs.lstat(path,statAction);
    }
  },readdir = function(path,stat){
    if(!resolved) {
      path = resolve(path);
      resolved = 1;
    }

    job(1);
    var readdirAction = function(err,files) {
      job(-1);
      if (err || !files || !files.length) {
        emitter.emit('fail',path,err);
        return;
      }
      if(path == '/') path='';
      for(var i=0,j=files.length;i<j;i++){
        statter(path+'/'+files[i]);
      };

    }

    //use same pattern for sync as async api
    if(options.sync) {
      var e,files;
      try {
          files = fs.readdirSync(path);
      } catch (e) { }

      readdirAction(e,files);
    } else {
      fs.readdir(path,readdirAction);
    }
  };

  if (options.follow_symlinks) {
    var linkAction = function(err,path){
      job(-1);
      statter(resolve(path));
    };

    emitter.on('link',function(path,stat){
      job(1);
      if(options.sync) {
        var resolvedPath,e;
        try {
          resolvedPath = fs.readlinkSync(path);
        } catch(e) {}
        linkAction(e,resolvedPath);

      } else {
        fs.readlink(e,linkAction);
      }
    });
  }

  if (cb) {
    emitter.on('path',cb);
  }

  if (options.sync) {
    emitter.on('path',function(path,stat){
      //save all paths?
      if(options.returnObject) allPaths[path] = stat;
      else allPaths.push(path);
    });
  }

  emitter.on('directory',readdir);
  //directory that was specified by argument.
  emitter.once('targetdirectory',readdir);
  //only a fail on the path specified by argument is fatal 
  emitter.once('fail',function(_path,err){
        //if the first dir fails its a real error
        if(path == _path) {
          emitter.emit('error',path,err);
        }
  });

  statter(path,1);
  if (options.sync) {
    return allPaths;
  } else {
    return emitter;
  }

};
