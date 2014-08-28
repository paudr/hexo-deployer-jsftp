var fs = require('fs'),
  Ftp = require('ftp');

var client = new Ftp();
var count;

var public_dir = hexo.base_dir + (hexo.config.public_dir || '/public');
if (public_dir.slice(-1) === '/') {
  public_dir = public_dir.substring(0, public_dir.length - 1);
}

function listFiles(path, callback) {

  var results = {
    'path': path,
    'files': [],
    'directories': {}
  };

  fs.readdir(path, function (error, list) {

    if (error) {
      return callback(error);
    }

    var pending = list.length;

    if (!pending) {
      return callback(null, results);
    }

    list.forEach(function (file) {

      var fullPath = path + '/' + file;

      fs.stat(fullPath, function (error, stat) {

        if (stat && stat.isDirectory()) {

          listFiles(fullPath, function (error, res) {

            results.directories[file] = res;

            if (!--pending) {
              callback(null, results);
            }

          });

        }
        else {

          results.files.push(file);

          if (!--pending) {
            callback(null, results);
          }

        }

      });

    });

  });

}

function uploadDirectory (structure, callback) {

  var f = 0,
    d = 0,
    dirNames = Object.keys(structure.directories);

  var nextDir = function () {

    var dirName = dirNames[d++];

    if (!dirName) {
      return callback();
    }

    client.mkdir(dirName, false, function (error) {

      client.cwd(dirName, function (error) {

        if (error) {
          return callback(error);
        }

        uploadDirectory(structure.directories[dirName], function () {

          client.cdup(function (error) {

            if (error) {
              return callback(error);
            }

            nextDir();

          });

        });

      });

    });

  };

  var nextFile = function () {

    var file = structure.files[f++];

    if (!file) {
      return nextDir();
    }

    client.put(structure.path + '/' + file, file, function (error) {

      if (error) {
        return callback(error);
      }

      hexo.log.log('upload', 'Uploaded: %s', structure.path + '/' + file);
      count++;

      nextFile();

    });

  };

  nextFile();

}

function getConnOpts(args) {

  var connOpts = {},

    setConnProp = function(prop) {
      if(typeof args.connection[prop] !== 'undefined') {
        connOpts[prop] = args.connection[prop];
      }
    },

    readCert = function(prop) {
      if(connOpts.secureOptions[prop + 'Path'] && fs.existsSync(connOpts.secureOptions[prop + 'Path'])) {
        connOpts.secureOptions[prop] = fs.readFileSync(connOpts.secureOptions[prop + 'Path']);
      }
    };

  if (args.connection) {

    ['host', 'port', 'secure', 'secureOptions', 'user', 'password', 'connTimeout', 'pasvTimeout', 'keepalive'].forEach(setConnProp);

    if(connOpts.secureOptions) {

      ['pfx', 'key', 'ca', 'cert'].forEach(readCert);

    }

  }

  for (var key in args._) {

    var match = args._[key].match(/^([^=]*)=(.*)$/);

    if (match && match.length === 3) {
      connOpts[match[1]] = match[2];
    }

  }

  return connOpts;

}

hexo.extend.deployer.register('ftp', function (args, callback) {

  hexo.log.setAlias('upload', 'info');

  var start = Date.now();
  count = 0;

  var root = (args.root || '');

  var finish = function () {

    client.end();
    return callback.apply(this, arguments);

  }

  listFiles(public_dir, function (error, structure) {

    if (error) {
      return callback(error);
    }

    client.on('ready', function () {

      client.mkdir(root, function(error) {

        client.cwd(root, function (error, currentDir) {

          if (error) {
            return finish(error);
          }

          uploadDirectory(structure, function (error) {

            if (error) {
              return finish(error);
            }

            var elapsed = (Date.now() - start) / 1000;

            hexo.log.log('upload', '%d files uploaded in %ss', count, elapsed.toFixed(3));
            return finish();

          });

        });

      });

    });

    client.connect(getConnOpts(args));

  });

})