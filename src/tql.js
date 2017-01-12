#!/usr/bin/env node
import minimist from 'minimist';
import {config, queryOpts} from 'timequerylog';

const argv = minimist(process.argv.slice(2));

const type = argv['_'];

let start = null, end = null
if (argv.s) start = new Date(argv.s);
if (argv.e) end = new Date(argv.e);

let cfg = {};
if (argv.d) cfg.path = argv.d;

if (argv.c) cfg.snappy = 1;

let match = undefined;
if (argv.m) match = Function("r",argv.m);

if (Object.keys(cfg).length>0) {
  config(cfg);
}

console.log("Config:",JSON.stringify(cfg),"Type:",type,"Start:",start,"End:",end, 'Match:',match);
const stream = queryOpts({type, start, end, match});
stream.on('data', d => {
  console.log(d);
});

//stream.pipe(process.stdout);

stream.on('end', process.exit);
