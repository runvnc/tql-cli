#!/usr/bin/env node
'use strict';

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _timequerylog = require('timequerylog');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var argv = (0, _minimist2.default)(process.argv.slice(2));

var type = argv['_'];

var start = null,
    end = null;
if (argv.s) start = new Date(argv.s);
if (argv.e) end = new Date(argv.e);

var cfg = {};
if (argv.d) cfg.path = argv.d;

if (argv.c) cfg.snappy = 1;

var match = undefined;
if (argv.m) match = Function("r", argv.m);

if (Object.keys(cfg).length > 0) {
  (0, _timequerylog.config)(cfg);
}

console.log("Config:", JSON.stringify(cfg), "Type:", type, "Start:", start, "End:", end, 'Match:', match);
var stream = (0, _timequerylog.queryOpts)({ type: type, start: start, end: end, match: match });
stream.on('data', function (d) {
  console.log(d);
});

//stream.pipe(process.stdout);

stream.on('end', process.exit);