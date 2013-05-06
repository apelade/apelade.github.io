// Generated by CoffeeScript 2.0.0-beta4
var DEF_IGNORES, err, exec_args_in_dir, exports, fs, func_walk, npm_install_rec, npm_update_rec;
fs = require('fs');
DEF_IGNORES = ['.git'];
exec_args_in_dir = function (args, dir) {
  var command, exec;
  console.log('exec', args, 'in', dir);
  exec = require('child_process').exec;
  return command = exec(args, {
    cwd: dir,
    stio: 'inherit'
  }, function (err, stout, sterr) {
    console.log(' cwd:', dir);
    console.log(' err:', err);
    console.log(' stout:', stout);
    return console.log(' sterr:', sterr);
  });
};
func_walk = function (args, file, parent, ignores, targets) {
  if (null == parent)
    parent = null;
  if (null == ignores)
    ignores = DEF_IGNORES;
  if (null == targets)
    targets = [];
  if (null != args && null != file)
    if (in$(file, targets) && null != parent) {
      return exec_args_in_dir(args, parent);
    } else if (!in$(file, ignores)) {
      if (null != parent)
        file = parent + '/' + file;
      return fs.stat(file, function (err, stats) {
        if (null != err)
          console.log(err);
        if (stats.isDirectory())
          return function (accum$) {
            var item;
            for (var cache$ = fs.readdirSync(file), i$ = 0, length$ = cache$.length; i$ < length$; ++i$) {
              item = cache$[i$];
              accum$.push(function () {
                return func_walk(args, item, file, ignores, targets);
              }());
            }
            return accum$;
          }.call(this, []);
      });
    }
};
npm_install_rec = function (start) {
  return func_walk('npm -s install', start, null, DEF_IGNORES, ['package.json']);
};
npm_update_rec = function (start) {
  return func_walk('npm -s update', start, null, DEF_IGNORES, ['package.json']);
};
module.exports = exports = {
  func_walk: func_walk,
  exec_args_in_dir: exec_args_in_dir,
  npm_install_rec: npm_install_rec,
  npm_update_rec: npm_update_rec
};
if ((null != process.argv ? process.argv.length : void 0) === 4)
  try {
    module.exports[process.argv[2]](process.argv[3]);
  } catch (e$) {
    err = e$;
    console.log(err);
  }
function in$(member, list) {
  for (var i = 0, length = list.length; i < length; ++i)
    if (i in list && list[i] === member)
      return true;
  return false;
}