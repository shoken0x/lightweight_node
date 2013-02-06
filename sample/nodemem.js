/*
 * https://gist.github.com/1869292
de --max_old_space_size=3000 --prof nodemem.js

  # --trace_incremental_marking=true --incremental_marking_steps=false
  node --max_old_space_size=3000 --max_new_space_size=3000 --max_executable_size=1000 --gc_global --prof nodemem.js
  # --noincremental_marking

  # --nolazy_sweeping
  # --never_compact

  # --gc_global
  # --gc_interval=100000000
*/
var utilz = require('utilz')

var objs = 100000000;
var arr = [], a = []
arr.push(a)
var start = Date.now()

for(var i = 0; i < objs; i++) {
  a.push({ r: true })
  if(i % 1000000 === 0) {
    console.log(i)
    a = []
    arr.push(a)
  }
}

var end = Date.now()
var dur = utilz.timeSpan(end - start)

var mem = process.memoryUsage()
mem.rss = utilz.formatNumber(mem.rss)
mem.heapTotal = utilz.formatNumber(mem.heapTotal)
mem.heapUsed = utilz.formatNumber(mem.heapUsed)

console.log(utilz.formatNumber(objs) + ' objects allocated; rss(' + mem.rss + ') heapTotal(' + mem.heapTotal + ') heapUsed(' + mem.heapUsed + ') in ' + dur)
