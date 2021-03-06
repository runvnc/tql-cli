#!/usr/bin/env node
'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _timequerylog = require('timequerylog');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _marked = require('marked');

var _marked2 = _interopRequireDefault(_marked);

var _markedTerminal = require('marked-terminal');

var _markedTerminal2 = _interopRequireDefault(_markedTerminal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_marked2.default.setOptions({ renderer: new _markedTerminal2.default() });

var origargv = process.argv.slice(2);
var argv = (0, _minimist2.default)(process.argv.slice(2));

var type = argv['_'];

if (argv.help || Object.keys(argv).length == 1) {
  var ver = require(__dirname + '/../package.json').version;
  console.log("tql version", ver);
  var text = _fs2.default.readFileSync(__dirname + '/../README.md', 'utf8');
  console.log((0, _marked2.default)(text));
  process.exit();
}

var start = null,
    end = null;
if (argv.s) start = new Date(argv.s);
if (argv.e) end = new Date(argv.e);

var cfg = {};
if (argv.d) cfg.path = argv.d;

if (argv.c) cfg.snappy = 1;

var match = undefined,
    map = undefined,
    sort = undefined;
if (argv.m) match = Function("r", argv.m);

if (argv.a) map = Function("r", argv.a);

if (argv.r) sort = Function("a", "b", argv.r);

if (Object.keys(cfg).length > 0) {
  (0, _timequerylog.config)(cfg);
}

if (argv.v) console.log("Config:", JSON.stringify(cfg), "Type:", type, "Start:", start, "End:", end, 'Match:', match);

var doMulti = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(_ref2) {
    var typeGlob = _ref2.typeGlob,
        start = _ref2.start,
        end = _ref2.end,
        match = _ref2.match;
    var arr;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _timequerylog.queryMultiArray)({ typeGlob: typeGlob, start: start, end: end, match: match });

          case 2:
            arr = _context.sent;

            if (sort) arr = arr.sort(sort);
            if (map) arr = arr.map(map);
            console.log(JSON.stringify(arr, null, 4));
            //process.exit();

          case 6:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function doMulti(_x) {
    return _ref.apply(this, arguments);
  };
}();

if (argv.l) {
  var _type = argv.l;
  (0, _timequerylog.latest)(_type).then(console.log);
} else if (argv.u) {
  var typeGlob = argv.u;
  doMulti({ typeGlob: typeGlob, start: start, end: end, match: match }).catch(console.error);
} else {
  var stream = (0, _timequerylog.queryOpts)({ type: type, start: start, end: end, match: match });
  console.log('[');
  var cnt = 0;
  stream.on('data', function (d) {
    if (cnt++ > 0) console.log(',');
    console.log(JSON.stringify(d));
  });

  stream.on('end', function () {
    console.log(']');
    process.exit();
  });
}