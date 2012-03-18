var finder = require('../recursedir.js').recurseDir;

var em = finder(process.argv[2] || '../../../');

var count = 0;

em.on('path',function(file,stat){
  count++;
});

em.on('end',function(){
  console.log('found '+count+' files');	
});
