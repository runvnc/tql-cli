#!/usr/bin/env node
import minimist from 'minimist';
import {config, queryMultiArray, queryOpts} from 'timequerylog';
import fs from 'fs';
import marked from 'marked';
import TerminalRenderer from 'marked-terminal';
   
marked.setOptions({renderer: new TerminalRenderer()});

const origargv = process.argv.slice(2);
const argv = minimist(process.argv.slice(2));

let type = argv['_'];

if (argv.help || Object.keys(argv).length==1) {
  const ver = require(__dirname+'/../package.json').version;
  console.log("tql version",ver);
  let text = fs.readFileSync(__dirname+'/../README.md','utf8');
  console.log(marked(text));
  process.exit();
} 

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

if (argv.v)
  console.log("Config:",JSON.stringify(cfg),"Type:",type,"Start:",start,"End:",end, 'Match:',match);

const doMulti = async ({typeGlob, start, end, match}) => {
  const arr = await queryMultiArray({typeGlob, start, end, match});
  console.log(JSON.stringify(arr, null, 4));
  process.exit();
}

if (argv.u) {
  const typeGlob = argv.u;
  doMulti({typeGlob,start,end,match}).catch(console.error); 
} else {
    const stream = queryOpts({type, start, end, match});
    console.log('[');
    let cnt = 0;
    stream.on('data', d => {
      if (cnt++ > 0) console.log(',');
      console.log(JSON.stringify(d));
    });

    stream.on('end', () => {
      console.log(']');
      process.exit();
    });
}

