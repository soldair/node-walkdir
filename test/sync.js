var find = require('../recursedir').recurseDirSync;


var files = find(process.argv[2] || '../../../');

console.log('found '+files.length+' files');
