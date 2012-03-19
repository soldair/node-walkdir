[![Build Status](https://secure.travis-ci.org/soldair/node-recursedir.png)](http://travis-ci.org/soldair/node-recursedir)

## recuredir

Recursively traverses a directory tree emitting events for the stuff it finds. Using only native flow control its faster than other find options in node and does not crash when you attempt to traverse a big tree.

## Example

```js

var recursedir = require('recursedir');

//async with path callback 

recursedir.find('../',function(path,stat){
  console.log('found: ',path);
});

//use async emitter to capture more events

var emitter = recursedir.find('../');

emitter.on('file',function(){
  console.log('file from emitter: ',file);
});


//sync with callback

recursedir.findSync('../',function(path,stat){
  console.log('found sync:',path);
});

//sync just need paths

var paths = recursedir.findSync('../');
console.log('found paths sync: ',paths);

```


## install

	npm install recursedir

## arguments

recursedir.find(path, [options], [callback])
recursedir.findSync(path, [options], [callback]);

- path
  - the starting point of your directory walk

- options. supported options are
	- general
	```js
	{
	"follow_symlinks":true, //defaults to the first reported stat.size
	}
	```
	- sync only
	```js
	{
	"no_return":false, // if true null will be returned and no array or object will be created with found paths. useful for large listings
	"return_object":false, // if true the sync return will be in {path:stat} format instead of [path,path,...]
	}
	```

- callback
  - this is bound to the path event of the emitter. its optional in all cases.

	```js
	callback(path,stat)
	```

## events

all events are emitted with (path,stat). stat is an instanceof fs.Stats

###path
fired for everything

###file
fired only for regular files

###link
fired when a symbolic link is found

###socket
fired when a socket descriptor is found

###fifo
fired when a fifo is found

###characterdevice
fired when a character device is found

###blockdevice
fired when a block device is found

###targetdirectory
fired for the stat of the path you provided as the first argument. is is only fired if it is a directory.

###error
if the target path cannot be read an error event is emitted. this is the only failure case.

###fail
when stat or read fails on a path somewhere in the walk and it is not your target path you get a fail event instead of error.
This is handy if you want to find places you dont have access too.


