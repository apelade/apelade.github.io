###
Execute arbitrary args in a dir, singly or recursively.
A list of ignore files prevents bad recursions.
A list of target files triggers exec of args if found in the cwd.
Usage: See npm_install_rec below.
DEF_IGNORES works for me, but do you ever need to go to node_modules?
Note: file is passed but not currently used in exec_args_in_dir.
Paul McCulloch, 16 April 2013
License: <= MIT
###

fs = require "fs"
DEF_IGNORES = [".git"]

exec_args_in_dir = (args, dir) ->
  console.log "exec", args, "in", dir
  exec = require('child_process').exec
  command = exec args, {cwd:dir, stio:"inherit"}, (err,stout,sterr) ->
    console.log " cwd:", dir
    console.log " err:", err
    console.log " stout:", stout
    console.log " sterr:", sterr

func_walk = (args, file, parent=null, ignores=DEF_IGNORES, targets=[]) ->
#  console.log "file", file, "parent", parent
  if args? and file?
    if file in targets and parent?
      exec_args_in_dir args, parent
    else if file not in ignores
      if parent?
        file = parent + "/" + file
      fs.stat file, (err,stats) ->
        console.log err if err?
        if stats.isDirectory()
          for item in fs.readdirSync(file)
            do -> func_walk(args, item, file, ignores, targets)


npm_install_rec = (start) ->
  func_walk "npm -s install", start, null, DEF_IGNORES, ["package.json"]

npm_update_rec = (start) ->
  func_walk "npm -s update", start, null, DEF_IGNORES, ["package.json"]

module.exports = exports =
  func_walk: func_walk
  exec_args_in_dir: exec_args_in_dir
  npm_install_rec: npm_install_rec
  npm_update_rec: npm_update_rec

if process.argv?.length is 4
  try
    module.exports[process.argv[2]](process.argv[3])
  catch err
    console.log err

