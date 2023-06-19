var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var singleton = {exports: {}};

var stringify$2 = {exports: {}};

/*
 json-stringify-safe
 Like JSON.stringify, but doesn't throw on circular references.

 Originally forked from https://github.com/isaacs/json-stringify-safe
 version 5.0.1 on 3/8/2017 and modified to handle Errors serialization
 and IE8 compatibility. Tests for this are in test/vendor.

 ISC license: https://github.com/isaacs/json-stringify-safe/blob/master/LICENSE
*/

(function (module, exports) {
	exports = module.exports = stringify;
	exports.getSerialize = serializer;

	function indexOf(haystack, needle) {
	  for (var i = 0; i < haystack.length; ++i) {
	    if (haystack[i] === needle) return i;
	  }
	  return -1;
	}

	function stringify(obj, replacer, spaces, cycleReplacer) {
	  return JSON.stringify(obj, serializer(replacer, cycleReplacer), spaces);
	}

	// https://github.com/ftlabs/js-abbreviate/blob/fa709e5f139e7770a71827b1893f22418097fbda/index.js#L95-L106
	function stringifyError(value) {
	  var err = {
	    // These properties are implemented as magical getters and don't show up in for in
	    stack: value.stack,
	    message: value.message,
	    name: value.name
	  };

	  for (var i in value) {
	    if (Object.prototype.hasOwnProperty.call(value, i)) {
	      err[i] = value[i];
	    }
	  }

	  return err;
	}

	function serializer(replacer, cycleReplacer) {
	  var stack = [];
	  var keys = [];

	  if (cycleReplacer == null) {
	    cycleReplacer = function(key, value) {
	      if (stack[0] === value) {
	        return '[Circular ~]';
	      }
	      return '[Circular ~.' + keys.slice(0, indexOf(stack, value)).join('.') + ']';
	    };
	  }

	  return function(key, value) {
	    if (stack.length > 0) {
	      var thisPos = indexOf(stack, this);
	      ~thisPos ? stack.splice(thisPos + 1) : stack.push(this);
	      ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key);

	      if (~indexOf(stack, value)) {
	        value = cycleReplacer.call(this, key, value);
	      }
	    } else {
	      stack.push(value);
	    }

	    return replacer == null
	      ? value instanceof Error ? stringifyError(value) : value
	      : replacer.call(this, key, value);
	  };
	}
} (stringify$2, stringify$2.exports));

var stringify$1 = stringify$2.exports;

var _window$3 =
  typeof window !== 'undefined'
    ? window
    : typeof commonjsGlobal !== 'undefined'
      ? commonjsGlobal
      : typeof self !== 'undefined'
        ? self
        : {};

function isObject$1(what) {
  return typeof what === 'object' && what !== null;
}

// Yanked from https://git.io/vS8DV re-used under CC0
// with some tiny modifications
function isError$1(value) {
  switch (Object.prototype.toString.call(value)) {
    case '[object Error]':
      return true;
    case '[object Exception]':
      return true;
    case '[object DOMException]':
      return true;
    default:
      return value instanceof Error;
  }
}

function isErrorEvent$1(value) {
  return Object.prototype.toString.call(value) === '[object ErrorEvent]';
}

function isDOMError$1(value) {
  return Object.prototype.toString.call(value) === '[object DOMError]';
}

function isDOMException$1(value) {
  return Object.prototype.toString.call(value) === '[object DOMException]';
}

function isUndefined$1(what) {
  return what === void 0;
}

function isFunction$1(what) {
  return typeof what === 'function';
}

function isPlainObject$1(what) {
  return Object.prototype.toString.call(what) === '[object Object]';
}

function isString$1(what) {
  return Object.prototype.toString.call(what) === '[object String]';
}

function isArray$1(what) {
  return Object.prototype.toString.call(what) === '[object Array]';
}

function isEmptyObject$1(what) {
  if (!isPlainObject$1(what)) return false;

  for (var _ in what) {
    if (what.hasOwnProperty(_)) {
      return false;
    }
  }
  return true;
}

function supportsErrorEvent() {
  try {
    new ErrorEvent(''); // eslint-disable-line no-new
    return true;
  } catch (e) {
    return false;
  }
}

function supportsDOMError() {
  try {
    new DOMError(''); // eslint-disable-line no-new
    return true;
  } catch (e) {
    return false;
  }
}

function supportsDOMException() {
  try {
    new DOMException(''); // eslint-disable-line no-new
    return true;
  } catch (e) {
    return false;
  }
}

function supportsFetch$1() {
  if (!('fetch' in _window$3)) return false;

  try {
    new Headers(); // eslint-disable-line no-new
    new Request(''); // eslint-disable-line no-new
    new Response(); // eslint-disable-line no-new
    return true;
  } catch (e) {
    return false;
  }
}

// Despite all stars in the sky saying that Edge supports old draft syntax, aka 'never', 'always', 'origin' and 'default
// https://caniuse.com/#feat=referrer-policy
// It doesn't. And it throw exception instead of ignoring this parameter...
// REF: https://github.com/getsentry/raven-js/issues/1233
function supportsReferrerPolicy$1() {
  if (!supportsFetch$1()) return false;

  try {
    // eslint-disable-next-line no-new
    new Request('pickleRick', {
      referrerPolicy: 'origin'
    });
    return true;
  } catch (e) {
    return false;
  }
}

function supportsPromiseRejectionEvent() {
  return typeof PromiseRejectionEvent === 'function';
}

function wrappedCallback(callback) {
  function dataCallback(data, original) {
    var normalizedData = callback(data) || data;
    if (original) {
      return original(normalizedData) || normalizedData;
    }
    return normalizedData;
  }

  return dataCallback;
}

function each$1(obj, callback) {
  var i, j;

  if (isUndefined$1(obj.length)) {
    for (i in obj) {
      if (hasKey$1(obj, i)) {
        callback.call(null, i, obj[i]);
      }
    }
  } else {
    j = obj.length;
    if (j) {
      for (i = 0; i < j; i++) {
        callback.call(null, i, obj[i]);
      }
    }
  }
}

function objectMerge$1(obj1, obj2) {
  if (!obj2) {
    return obj1;
  }
  each$1(obj2, function(key, value) {
    obj1[key] = value;
  });
  return obj1;
}

/**
 * This function is only used for react-native.
 * react-native freezes object that have already been sent over the
 * js bridge. We need this function in order to check if the object is frozen.
 * So it's ok that objectFrozen returns false if Object.isFrozen is not
 * supported because it's not relevant for other "platforms". See related issue:
 * https://github.com/getsentry/react-native-sentry/issues/57
 */
function objectFrozen$1(obj) {
  if (!Object.isFrozen) {
    return false;
  }
  return Object.isFrozen(obj);
}

function truncate$1(str, max) {
  if (typeof max !== 'number') {
    throw new Error('2nd argument to `truncate` function should be a number');
  }
  if (typeof str !== 'string' || max === 0) {
    return str;
  }
  return str.length <= max ? str : str.substr(0, max) + '\u2026';
}

/**
 * hasKey, a better form of hasOwnProperty
 * Example: hasKey(MainHostObject, property) === true/false
 *
 * @param {Object} host object to check property
 * @param {string} key to check
 */
function hasKey$1(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}

function joinRegExp$1(patterns) {
  // Combine an array of regular expressions and strings into one large regexp
  // Be mad.
  var sources = [],
    i = 0,
    len = patterns.length,
    pattern;

  for (; i < len; i++) {
    pattern = patterns[i];
    if (isString$1(pattern)) {
      // If it's a string, we need to escape it
      // Taken from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
      sources.push(pattern.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1'));
    } else if (pattern && pattern.source) {
      // If it's a regexp already, we want to extract the source
      sources.push(pattern.source);
    }
    // Intentionally skip other cases
  }
  return new RegExp(sources.join('|'), 'i');
}

function urlencode$1(o) {
  var pairs = [];
  each$1(o, function(key, value) {
    pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
  });
  return pairs.join('&');
}

// borrowed from https://tools.ietf.org/html/rfc3986#appendix-B
// intentionally using regex and not <a/> href parsing trick because React Native and other
// environments where DOM might not be available
function parseUrl$1(url) {
  if (typeof url !== 'string') return {};
  var match = url.match(/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/);

  // coerce to undefined values to empty string so we don't get 'undefined'
  var query = match[6] || '';
  var fragment = match[8] || '';
  return {
    protocol: match[2],
    host: match[4],
    path: match[5],
    relative: match[5] + query + fragment // everything minus origin
  };
}
function uuid4$1() {
  var crypto = _window$3.crypto || _window$3.msCrypto;

  if (!isUndefined$1(crypto) && crypto.getRandomValues) {
    // Use window.crypto API if available
    // eslint-disable-next-line no-undef
    var arr = new Uint16Array(8);
    crypto.getRandomValues(arr);

    // set 4 in byte 7
    arr[3] = (arr[3] & 0xfff) | 0x4000;
    // set 2 most significant bits of byte 9 to '10'
    arr[4] = (arr[4] & 0x3fff) | 0x8000;

    var pad = function(num) {
      var v = num.toString(16);
      while (v.length < 4) {
        v = '0' + v;
      }
      return v;
    };

    return (
      pad(arr[0]) +
      pad(arr[1]) +
      pad(arr[2]) +
      pad(arr[3]) +
      pad(arr[4]) +
      pad(arr[5]) +
      pad(arr[6]) +
      pad(arr[7])
    );
  } else {
    // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#2117523
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}

/**
 * Given a child DOM element, returns a query-selector statement describing that
 * and its ancestors
 * e.g. [HTMLElement] => body > div > input#foo.btn[name=baz]
 * @param elem
 * @returns {string}
 */
function htmlTreeAsString$1(elem) {
  /* eslint no-extra-parens:0*/
  var MAX_TRAVERSE_HEIGHT = 5,
    MAX_OUTPUT_LEN = 80,
    out = [],
    height = 0,
    len = 0,
    separator = ' > ',
    sepLength = separator.length,
    nextStr;

  while (elem && height++ < MAX_TRAVERSE_HEIGHT) {
    nextStr = htmlElementAsString(elem);
    // bail out if
    // - nextStr is the 'html' element
    // - the length of the string that would be created exceeds MAX_OUTPUT_LEN
    //   (ignore this limit if we are on the first iteration)
    if (
      nextStr === 'html' ||
      (height > 1 && len + out.length * sepLength + nextStr.length >= MAX_OUTPUT_LEN)
    ) {
      break;
    }

    out.push(nextStr);

    len += nextStr.length;
    elem = elem.parentNode;
  }

  return out.reverse().join(separator);
}

/**
 * Returns a simple, query-selector representation of a DOM element
 * e.g. [HTMLElement] => input#foo.btn[name=baz]
 * @param HTMLElement
 * @returns {string}
 */
function htmlElementAsString(elem) {
  var out = [],
    className,
    classes,
    key,
    attr,
    i;

  if (!elem || !elem.tagName) {
    return '';
  }

  out.push(elem.tagName.toLowerCase());
  if (elem.id) {
    out.push('#' + elem.id);
  }

  className = elem.className;
  if (className && isString$1(className)) {
    classes = className.split(/\s+/);
    for (i = 0; i < classes.length; i++) {
      out.push('.' + classes[i]);
    }
  }
  var attrWhitelist = ['type', 'name', 'title', 'alt'];
  for (i = 0; i < attrWhitelist.length; i++) {
    key = attrWhitelist[i];
    attr = elem.getAttribute(key);
    if (attr) {
      out.push('[' + key + '="' + attr + '"]');
    }
  }
  return out.join('');
}

/**
 * Returns true if either a OR b is truthy, but not both
 */
function isOnlyOneTruthy(a, b) {
  return !!(!!a ^ !!b);
}

/**
 * Returns true if both parameters are undefined
 */
function isBothUndefined(a, b) {
  return isUndefined$1(a) && isUndefined$1(b);
}

/**
 * Returns true if the two input exception interfaces have the same content
 */
function isSameException$1(ex1, ex2) {
  if (isOnlyOneTruthy(ex1, ex2)) return false;

  ex1 = ex1.values[0];
  ex2 = ex2.values[0];

  if (ex1.type !== ex2.type || ex1.value !== ex2.value) return false;

  // in case both stacktraces are undefined, we can't decide so default to false
  if (isBothUndefined(ex1.stacktrace, ex2.stacktrace)) return false;

  return isSameStacktrace$1(ex1.stacktrace, ex2.stacktrace);
}

/**
 * Returns true if the two input stack trace interfaces have the same content
 */
function isSameStacktrace$1(stack1, stack2) {
  if (isOnlyOneTruthy(stack1, stack2)) return false;

  var frames1 = stack1.frames;
  var frames2 = stack2.frames;

  // Exit early if stacktrace is malformed
  if (frames1 === undefined || frames2 === undefined) return false;

  // Exit early if frame count differs
  if (frames1.length !== frames2.length) return false;

  // Iterate through every frame; bail out if anything differs
  var a, b;
  for (var i = 0; i < frames1.length; i++) {
    a = frames1[i];
    b = frames2[i];
    if (
      a.filename !== b.filename ||
      a.lineno !== b.lineno ||
      a.colno !== b.colno ||
      a['function'] !== b['function']
    )
      return false;
  }
  return true;
}

/**
 * Polyfill a method
 * @param obj object e.g. `document`
 * @param name method name present on object e.g. `addEventListener`
 * @param replacement replacement function
 * @param track {optional} record instrumentation to an array
 */
function fill$1(obj, name, replacement, track) {
  if (obj == null) return;
  var orig = obj[name];
  obj[name] = replacement(orig);
  obj[name].__raven__ = true;
  obj[name].__orig__ = orig;
  if (track) {
    track.push([obj, name, orig]);
  }
}

/**
 * Join values in array
 * @param input array of values to be joined together
 * @param delimiter string to be placed in-between values
 * @returns {string}
 */
function safeJoin(input, delimiter) {
  if (!isArray$1(input)) return '';

  var output = [];

  for (var i = 0; i < input.length; i++) {
    try {
      output.push(String(input[i]));
    } catch (e) {
      output.push('[value cannot be serialized]');
    }
  }

  return output.join(delimiter);
}

// Default Node.js REPL depth
var MAX_SERIALIZE_EXCEPTION_DEPTH = 3;
// 50kB, as 100kB is max payload size, so half sounds reasonable
var MAX_SERIALIZE_EXCEPTION_SIZE = 50 * 1024;
var MAX_SERIALIZE_KEYS_LENGTH = 40;

function utf8Length(value) {
  return ~-encodeURI(value).split(/%..|./).length;
}

function jsonSize(value) {
  return utf8Length(JSON.stringify(value));
}

function serializeValue(value) {
  if (typeof value === 'string') {
    var maxLength = 40;
    return truncate$1(value, maxLength);
  } else if (
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'undefined'
  ) {
    return value;
  }

  var type = Object.prototype.toString.call(value);

  // Node.js REPL notation
  if (type === '[object Object]') return '[Object]';
  if (type === '[object Array]') return '[Array]';
  if (type === '[object Function]')
    return value.name ? '[Function: ' + value.name + ']' : '[Function]';

  return value;
}

function serializeObject(value, depth) {
  if (depth === 0) return serializeValue(value);

  if (isPlainObject$1(value)) {
    return Object.keys(value).reduce(function(acc, key) {
      acc[key] = serializeObject(value[key], depth - 1);
      return acc;
    }, {});
  } else if (Array.isArray(value)) {
    return value.map(function(val) {
      return serializeObject(val, depth - 1);
    });
  }

  return serializeValue(value);
}

function serializeException$1(ex, depth, maxSize) {
  if (!isPlainObject$1(ex)) return ex;

  depth = typeof depth !== 'number' ? MAX_SERIALIZE_EXCEPTION_DEPTH : depth;
  maxSize = typeof depth !== 'number' ? MAX_SERIALIZE_EXCEPTION_SIZE : maxSize;

  var serialized = serializeObject(ex, depth);

  if (jsonSize(stringify$1(serialized)) > maxSize) {
    return serializeException$1(ex, depth - 1);
  }

  return serialized;
}

function serializeKeysForMessage$1(keys, maxLength) {
  if (typeof keys === 'number' || typeof keys === 'string') return keys.toString();
  if (!Array.isArray(keys)) return '';

  keys = keys.filter(function(key) {
    return typeof key === 'string';
  });
  if (keys.length === 0) return '[object has no keys]';

  maxLength = typeof maxLength !== 'number' ? MAX_SERIALIZE_KEYS_LENGTH : maxLength;
  if (keys[0].length >= maxLength) return keys[0];

  for (var usedKeys = keys.length; usedKeys > 0; usedKeys--) {
    var serialized = keys.slice(0, usedKeys).join(', ');
    if (serialized.length > maxLength) continue;
    if (usedKeys === keys.length) return serialized;
    return serialized + '\u2026';
  }

  return '';
}

function sanitize$1(input, sanitizeKeys) {
  if (!isArray$1(sanitizeKeys) || (isArray$1(sanitizeKeys) && sanitizeKeys.length === 0))
    return input;

  var sanitizeRegExp = joinRegExp$1(sanitizeKeys);
  var sanitizeMask = '********';
  var safeInput;

  try {
    safeInput = JSON.parse(stringify$1(input));
  } catch (o_O) {
    return input;
  }

  function sanitizeWorker(workerInput) {
    if (isArray$1(workerInput)) {
      return workerInput.map(function(val) {
        return sanitizeWorker(val);
      });
    }

    if (isPlainObject$1(workerInput)) {
      return Object.keys(workerInput).reduce(function(acc, k) {
        if (sanitizeRegExp.test(k)) {
          acc[k] = sanitizeMask;
        } else {
          acc[k] = sanitizeWorker(workerInput[k]);
        }
        return acc;
      }, {});
    }

    return workerInput;
  }

  return sanitizeWorker(safeInput);
}

var utils$3 = {
  isObject: isObject$1,
  isError: isError$1,
  isErrorEvent: isErrorEvent$1,
  isDOMError: isDOMError$1,
  isDOMException: isDOMException$1,
  isUndefined: isUndefined$1,
  isFunction: isFunction$1,
  isPlainObject: isPlainObject$1,
  isString: isString$1,
  isArray: isArray$1,
  isEmptyObject: isEmptyObject$1,
  supportsErrorEvent: supportsErrorEvent,
  supportsDOMError: supportsDOMError,
  supportsDOMException: supportsDOMException,
  supportsFetch: supportsFetch$1,
  supportsReferrerPolicy: supportsReferrerPolicy$1,
  supportsPromiseRejectionEvent: supportsPromiseRejectionEvent,
  wrappedCallback: wrappedCallback,
  each: each$1,
  objectMerge: objectMerge$1,
  truncate: truncate$1,
  objectFrozen: objectFrozen$1,
  hasKey: hasKey$1,
  joinRegExp: joinRegExp$1,
  urlencode: urlencode$1,
  uuid4: uuid4$1,
  htmlTreeAsString: htmlTreeAsString$1,
  htmlElementAsString: htmlElementAsString,
  isSameException: isSameException$1,
  isSameStacktrace: isSameStacktrace$1,
  parseUrl: parseUrl$1,
  fill: fill$1,
  safeJoin: safeJoin,
  serializeException: serializeException$1,
  serializeKeysForMessage: serializeKeysForMessage$1,
  sanitize: sanitize$1
};

var utils$2 = utils$3;

/*
 TraceKit - Cross brower stack traces

 This was originally forked from github.com/occ/TraceKit, but has since been
 largely re-written and is now maintained as part of raven-js.  Tests for
 this are in test/vendor.

 MIT license
*/

var TraceKit$1 = {
  collectWindowErrors: true,
  debug: false
};

// This is to be defensive in environments where window does not exist (see https://github.com/getsentry/raven-js/pull/785)
var _window$2 =
  typeof window !== 'undefined'
    ? window
    : typeof commonjsGlobal !== 'undefined'
    ? commonjsGlobal
    : typeof self !== 'undefined'
    ? self
    : {};

// global reference to slice
var _slice = [].slice;
var UNKNOWN_FUNCTION = '?';

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#Error_types
var ERROR_TYPES_RE = /^(?:[Uu]ncaught (?:exception: )?)?(?:((?:Eval|Internal|Range|Reference|Syntax|Type|URI|)Error): )?(.*)$/;

function getLocationHref() {
  if (typeof document === 'undefined' || document.location == null) return '';
  return document.location.href;
}

function getLocationOrigin() {
  if (typeof document === 'undefined' || document.location == null) return '';

  // Oh dear IE10...
  if (!document.location.origin) {
    return (
      document.location.protocol +
      '//' +
      document.location.hostname +
      (document.location.port ? ':' + document.location.port : '')
    );
  }

  return document.location.origin;
}

/**
 * TraceKit.report: cross-browser processing of unhandled exceptions
 *
 * Syntax:
 *   TraceKit.report.subscribe(function(stackInfo) { ... })
 *   TraceKit.report.unsubscribe(function(stackInfo) { ... })
 *   TraceKit.report(exception)
 *   try { ...code... } catch(ex) { TraceKit.report(ex); }
 *
 * Supports:
 *   - Firefox: full stack trace with line numbers, plus column number
 *              on top frame; column number is not guaranteed
 *   - Opera:   full stack trace with line and column numbers
 *   - Chrome:  full stack trace with line and column numbers
 *   - Safari:  line and column number for the top frame only; some frames
 *              may be missing, and column number is not guaranteed
 *   - IE:      line and column number for the top frame only; some frames
 *              may be missing, and column number is not guaranteed
 *
 * In theory, TraceKit should work on all of the following versions:
 *   - IE5.5+ (only 8.0 tested)
 *   - Firefox 0.9+ (only 3.5+ tested)
 *   - Opera 7+ (only 10.50 tested; versions 9 and earlier may require
 *     Exceptions Have Stacktrace to be enabled in opera:config)
 *   - Safari 3+ (only 4+ tested)
 *   - Chrome 1+ (only 5+ tested)
 *   - Konqueror 3.5+ (untested)
 *
 * Requires TraceKit.computeStackTrace.
 *
 * Tries to catch all unhandled exceptions and report them to the
 * subscribed handlers. Please note that TraceKit.report will rethrow the
 * exception. This is REQUIRED in order to get a useful stack trace in IE.
 * If the exception does not reach the top of the browser, you will only
 * get a stack trace from the point where TraceKit.report was called.
 *
 * Handlers receive a stackInfo object as described in the
 * TraceKit.computeStackTrace docs.
 */
TraceKit$1.report = (function reportModuleWrapper() {
  var handlers = [],
    lastArgs = null,
    lastException = null,
    lastExceptionStack = null;

  /**
   * Add a crash handler.
   * @param {Function} handler
   */
  function subscribe(handler) {
    installGlobalHandler();
    handlers.push(handler);
  }

  /**
   * Remove a crash handler.
   * @param {Function} handler
   */
  function unsubscribe(handler) {
    for (var i = handlers.length - 1; i >= 0; --i) {
      if (handlers[i] === handler) {
        handlers.splice(i, 1);
      }
    }
  }

  /**
   * Remove all crash handlers.
   */
  function unsubscribeAll() {
    uninstallGlobalHandler();
    handlers = [];
  }

  /**
   * Dispatch stack information to all handlers.
   * @param {Object.<string, *>} stack
   */
  function notifyHandlers(stack, isWindowError) {
    var exception = null;
    if (isWindowError && !TraceKit$1.collectWindowErrors) {
      return;
    }
    for (var i in handlers) {
      if (handlers.hasOwnProperty(i)) {
        try {
          handlers[i].apply(null, [stack].concat(_slice.call(arguments, 2)));
        } catch (inner) {
          exception = inner;
        }
      }
    }

    if (exception) {
      throw exception;
    }
  }

  var _oldOnerrorHandler, _onErrorHandlerInstalled;

  /**
   * Ensures all global unhandled exceptions are recorded.
   * Supported by Gecko and IE.
   * @param {string} msg Error message.
   * @param {string} url URL of script that generated the exception.
   * @param {(number|string)} lineNo The line number at which the error
   * occurred.
   * @param {?(number|string)} colNo The column number at which the error
   * occurred.
   * @param {?Error} ex The actual Error object.
   */
  function traceKitWindowOnError(msg, url, lineNo, colNo, ex) {
    var stack = null;
    // If 'ex' is ErrorEvent, get real Error from inside
    var exception = utils$2.isErrorEvent(ex) ? ex.error : ex;
    // If 'msg' is ErrorEvent, get real message from inside
    var message = utils$2.isErrorEvent(msg) ? msg.message : msg;

    if (lastExceptionStack) {
      TraceKit$1.computeStackTrace.augmentStackTraceWithInitialElement(
        lastExceptionStack,
        url,
        lineNo,
        message
      );
      processLastException();
    } else if (exception && utils$2.isError(exception)) {
      // non-string `exception` arg; attempt to extract stack trace

      // New chrome and blink send along a real error object
      // Let's just report that like a normal error.
      // See: https://mikewest.org/2013/08/debugging-runtime-errors-with-window-onerror
      stack = TraceKit$1.computeStackTrace(exception);
      notifyHandlers(stack, true);
    } else {
      var location = {
        url: url,
        line: lineNo,
        column: colNo
      };

      var name = undefined;
      var groups;

      if ({}.toString.call(message) === '[object String]') {
        var groups = message.match(ERROR_TYPES_RE);
        if (groups) {
          name = groups[1];
          message = groups[2];
        }
      }

      location.func = UNKNOWN_FUNCTION;

      stack = {
        name: name,
        message: message,
        url: getLocationHref(),
        stack: [location]
      };
      notifyHandlers(stack, true);
    }

    if (_oldOnerrorHandler) {
      return _oldOnerrorHandler.apply(this, arguments);
    }

    return false;
  }

  function installGlobalHandler() {
    if (_onErrorHandlerInstalled) {
      return;
    }
    _oldOnerrorHandler = _window$2.onerror;
    _window$2.onerror = traceKitWindowOnError;
    _onErrorHandlerInstalled = true;
  }

  function uninstallGlobalHandler() {
    if (!_onErrorHandlerInstalled) {
      return;
    }
    _window$2.onerror = _oldOnerrorHandler;
    _onErrorHandlerInstalled = false;
    _oldOnerrorHandler = undefined;
  }

  function processLastException() {
    var _lastExceptionStack = lastExceptionStack,
      _lastArgs = lastArgs;
    lastArgs = null;
    lastExceptionStack = null;
    lastException = null;
    notifyHandlers.apply(null, [_lastExceptionStack, false].concat(_lastArgs));
  }

  /**
   * Reports an unhandled Error to TraceKit.
   * @param {Error} ex
   * @param {?boolean} rethrow If false, do not re-throw the exception.
   * Only used for window.onerror to not cause an infinite loop of
   * rethrowing.
   */
  function report(ex, rethrow) {
    var args = _slice.call(arguments, 1);
    if (lastExceptionStack) {
      if (lastException === ex) {
        return; // already caught by an inner catch block, ignore
      } else {
        processLastException();
      }
    }

    var stack = TraceKit$1.computeStackTrace(ex);
    lastExceptionStack = stack;
    lastException = ex;
    lastArgs = args;

    // If the stack trace is incomplete, wait for 2 seconds for
    // slow slow IE to see if onerror occurs or not before reporting
    // this exception; otherwise, we will end up with an incomplete
    // stack trace
    setTimeout(
      function() {
        if (lastException === ex) {
          processLastException();
        }
      },
      stack.incomplete ? 2000 : 0
    );

    if (rethrow !== false) {
      throw ex; // re-throw to propagate to the top level (and cause window.onerror)
    }
  }

  report.subscribe = subscribe;
  report.unsubscribe = unsubscribe;
  report.uninstall = unsubscribeAll;
  return report;
})();

/**
 * TraceKit.computeStackTrace: cross-browser stack traces in JavaScript
 *
 * Syntax:
 *   s = TraceKit.computeStackTrace(exception) // consider using TraceKit.report instead (see below)
 * Returns:
 *   s.name              - exception name
 *   s.message           - exception message
 *   s.stack[i].url      - JavaScript or HTML file URL
 *   s.stack[i].func     - function name, or empty for anonymous functions (if guessing did not work)
 *   s.stack[i].args     - arguments passed to the function, if known
 *   s.stack[i].line     - line number, if known
 *   s.stack[i].column   - column number, if known
 *
 * Supports:
 *   - Firefox:  full stack trace with line numbers and unreliable column
 *               number on top frame
 *   - Opera 10: full stack trace with line and column numbers
 *   - Opera 9-: full stack trace with line numbers
 *   - Chrome:   full stack trace with line and column numbers
 *   - Safari:   line and column number for the topmost stacktrace element
 *               only
 *   - IE:       no line numbers whatsoever
 *
 * Tries to guess names of anonymous functions by looking for assignments
 * in the source code. In IE and Safari, we have to guess source file names
 * by searching for function bodies inside all page scripts. This will not
 * work for scripts that are loaded cross-domain.
 * Here be dragons: some function names may be guessed incorrectly, and
 * duplicate functions may be mismatched.
 *
 * TraceKit.computeStackTrace should only be used for tracing purposes.
 * Logging of unhandled exceptions should be done with TraceKit.report,
 * which builds on top of TraceKit.computeStackTrace and provides better
 * IE support by utilizing the window.onerror event to retrieve information
 * about the top of the stack.
 *
 * Note: In IE and Safari, no stack trace is recorded on the Error object,
 * so computeStackTrace instead walks its *own* chain of callers.
 * This means that:
 *  * in Safari, some methods may be missing from the stack trace;
 *  * in IE, the topmost function in the stack trace will always be the
 *    caller of computeStackTrace.
 *
 * This is okay for tracing (because you are likely to be calling
 * computeStackTrace from the function you want to be the topmost element
 * of the stack trace anyway), but not okay for logging unhandled
 * exceptions (because your catch block will likely be far away from the
 * inner function that actually caused the exception).
 *
 */
TraceKit$1.computeStackTrace = (function computeStackTraceWrapper() {
  // Contents of Exception in various browsers.
  //
  // SAFARI:
  // ex.message = Can't find variable: qq
  // ex.line = 59
  // ex.sourceId = 580238192
  // ex.sourceURL = http://...
  // ex.expressionBeginOffset = 96
  // ex.expressionCaretOffset = 98
  // ex.expressionEndOffset = 98
  // ex.name = ReferenceError
  //
  // FIREFOX:
  // ex.message = qq is not defined
  // ex.fileName = http://...
  // ex.lineNumber = 59
  // ex.columnNumber = 69
  // ex.stack = ...stack trace... (see the example below)
  // ex.name = ReferenceError
  //
  // CHROME:
  // ex.message = qq is not defined
  // ex.name = ReferenceError
  // ex.type = not_defined
  // ex.arguments = ['aa']
  // ex.stack = ...stack trace...
  //
  // INTERNET EXPLORER:
  // ex.message = ...
  // ex.name = ReferenceError
  //
  // OPERA:
  // ex.message = ...message... (see the example below)
  // ex.name = ReferenceError
  // ex.opera#sourceloc = 11  (pretty much useless, duplicates the info in ex.message)
  // ex.stacktrace = n/a; see 'opera:config#UserPrefs|Exceptions Have Stacktrace'

  /**
   * Computes stack trace information from the stack property.
   * Chrome and Gecko use this property.
   * @param {Error} ex
   * @return {?Object.<string, *>} Stack trace information.
   */
  function computeStackTraceFromStackProp(ex) {
    if (typeof ex.stack === 'undefined' || !ex.stack) return;

    var chrome = /^\s*at (?:(.*?) ?\()?((?:file|https?|blob|chrome-extension|native|eval|webpack|<anonymous>|[a-z]:|\/).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i;
    var winjs = /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:file|ms-appx(?:-web)|https?|webpack|blob):.*?):(\d+)(?::(\d+))?\)?\s*$/i;
    // NOTE: blob urls are now supposed to always have an origin, therefore it's format
    // which is `blob:http://url/path/with-some-uuid`, is matched by `blob.*?:\/` as well
    var gecko = /^\s*(.*?)(?:\((.*?)\))?(?:^|@)((?:file|https?|blob|chrome|webpack|resource|moz-extension).*?:\/.*?|\[native code\]|[^@]*(?:bundle|\d+\.js))(?::(\d+))?(?::(\d+))?\s*$/i;
    // Used to additionally parse URL/line/column from eval frames
    var geckoEval = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i;
    var chromeEval = /\((\S*)(?::(\d+))(?::(\d+))\)/;
    var lines = ex.stack.split('\n');
    var stack = [];
    var submatch;
    var parts;
    var element;
    /^(.*) is undefined$/.exec(ex.message);

    for (var i = 0, j = lines.length; i < j; ++i) {
      if ((parts = chrome.exec(lines[i]))) {
        var isNative = parts[2] && parts[2].indexOf('native') === 0; // start of line
        var isEval = parts[2] && parts[2].indexOf('eval') === 0; // start of line
        if (isEval && (submatch = chromeEval.exec(parts[2]))) {
          // throw out eval line/column and use top-most line/column number
          parts[2] = submatch[1]; // url
          parts[3] = submatch[2]; // line
          parts[4] = submatch[3]; // column
        }
        element = {
          url: !isNative ? parts[2] : null,
          func: parts[1] || UNKNOWN_FUNCTION,
          args: isNative ? [parts[2]] : [],
          line: parts[3] ? +parts[3] : null,
          column: parts[4] ? +parts[4] : null
        };
      } else if ((parts = winjs.exec(lines[i]))) {
        element = {
          url: parts[2],
          func: parts[1] || UNKNOWN_FUNCTION,
          args: [],
          line: +parts[3],
          column: parts[4] ? +parts[4] : null
        };
      } else if ((parts = gecko.exec(lines[i]))) {
        var isEval = parts[3] && parts[3].indexOf(' > eval') > -1;
        if (isEval && (submatch = geckoEval.exec(parts[3]))) {
          // throw out eval line/column and use top-most line number
          parts[3] = submatch[1];
          parts[4] = submatch[2];
          parts[5] = null; // no column when eval
        } else if (i === 0 && !parts[5] && typeof ex.columnNumber !== 'undefined') {
          // FireFox uses this awesome columnNumber property for its top frame
          // Also note, Firefox's column number is 0-based and everything else expects 1-based,
          // so adding 1
          // NOTE: this hack doesn't work if top-most frame is eval
          stack[0].column = ex.columnNumber + 1;
        }
        element = {
          url: parts[3],
          func: parts[1] || UNKNOWN_FUNCTION,
          args: parts[2] ? parts[2].split(',') : [],
          line: parts[4] ? +parts[4] : null,
          column: parts[5] ? +parts[5] : null
        };
      } else {
        continue;
      }

      if (!element.func && element.line) {
        element.func = UNKNOWN_FUNCTION;
      }

      if (element.url && element.url.substr(0, 5) === 'blob:') {
        // Special case for handling JavaScript loaded into a blob.
        // We use a synchronous AJAX request here as a blob is already in
        // memory - it's not making a network request.  This will generate a warning
        // in the browser console, but there has already been an error so that's not
        // that much of an issue.
        var xhr = new XMLHttpRequest();
        xhr.open('GET', element.url, false);
        xhr.send(null);

        // If we failed to download the source, skip this patch
        if (xhr.status === 200) {
          var source = xhr.responseText || '';

          // We trim the source down to the last 300 characters as sourceMappingURL is always at the end of the file.
          // Why 300? To be in line with: https://github.com/getsentry/sentry/blob/4af29e8f2350e20c28a6933354e4f42437b4ba42/src/sentry/lang/javascript/processor.py#L164-L175
          source = source.slice(-300);

          // Now we dig out the source map URL
          var sourceMaps = source.match(/\/\/# sourceMappingURL=(.*)$/);

          // If we don't find a source map comment or we find more than one, continue on to the next element.
          if (sourceMaps) {
            var sourceMapAddress = sourceMaps[1];

            // Now we check to see if it's a relative URL.
            // If it is, convert it to an absolute one.
            if (sourceMapAddress.charAt(0) === '~') {
              sourceMapAddress = getLocationOrigin() + sourceMapAddress.slice(1);
            }

            // Now we strip the '.map' off of the end of the URL and update the
            // element so that Sentry can match the map to the blob.
            element.url = sourceMapAddress.slice(0, -4);
          }
        }
      }

      stack.push(element);
    }

    if (!stack.length) {
      return null;
    }

    return {
      name: ex.name,
      message: ex.message,
      url: getLocationHref(),
      stack: stack
    };
  }

  /**
   * Adds information about the first frame to incomplete stack traces.
   * Safari and IE require this to get complete data on the first frame.
   * @param {Object.<string, *>} stackInfo Stack trace information from
   * one of the compute* methods.
   * @param {string} url The URL of the script that caused an error.
   * @param {(number|string)} lineNo The line number of the script that
   * caused an error.
   * @param {string=} message The error generated by the browser, which
   * hopefully contains the name of the object that caused the error.
   * @return {boolean} Whether or not the stack information was
   * augmented.
   */
  function augmentStackTraceWithInitialElement(stackInfo, url, lineNo, message) {
    var initial = {
      url: url,
      line: lineNo
    };

    if (initial.url && initial.line) {
      stackInfo.incomplete = false;

      if (!initial.func) {
        initial.func = UNKNOWN_FUNCTION;
      }

      if (stackInfo.stack.length > 0) {
        if (stackInfo.stack[0].url === initial.url) {
          if (stackInfo.stack[0].line === initial.line) {
            return false; // already in stack trace
          } else if (
            !stackInfo.stack[0].line &&
            stackInfo.stack[0].func === initial.func
          ) {
            stackInfo.stack[0].line = initial.line;
            return false;
          }
        }
      }

      stackInfo.stack.unshift(initial);
      stackInfo.partial = true;
      return true;
    } else {
      stackInfo.incomplete = true;
    }

    return false;
  }

  /**
   * Computes stack trace information by walking the arguments.caller
   * chain at the time the exception occurred. This will cause earlier
   * frames to be missed but is the only way to get any stack trace in
   * Safari and IE. The top frame is restored by
   * {@link augmentStackTraceWithInitialElement}.
   * @param {Error} ex
   * @return {?Object.<string, *>} Stack trace information.
   */
  function computeStackTraceByWalkingCallerChain(ex, depth) {
    var functionName = /function\s+([_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*)?\s*\(/i,
      stack = [],
      funcs = {},
      recursion = false,
      parts,
      item;

    for (
      var curr = computeStackTraceByWalkingCallerChain.caller;
      curr && !recursion;
      curr = curr.caller
    ) {
      if (curr === computeStackTrace || curr === TraceKit$1.report) {
        // console.log('skipping internal function');
        continue;
      }

      item = {
        url: null,
        func: UNKNOWN_FUNCTION,
        line: null,
        column: null
      };

      if (curr.name) {
        item.func = curr.name;
      } else if ((parts = functionName.exec(curr.toString()))) {
        item.func = parts[1];
      }

      if (typeof item.func === 'undefined') {
        try {
          item.func = parts.input.substring(0, parts.input.indexOf('{'));
        } catch (e) {}
      }

      if (funcs['' + curr]) {
        recursion = true;
      } else {
        funcs['' + curr] = true;
      }

      stack.push(item);
    }

    if (depth) {
      // console.log('depth is ' + depth);
      // console.log('stack is ' + stack.length);
      stack.splice(0, depth);
    }

    var result = {
      name: ex.name,
      message: ex.message,
      url: getLocationHref(),
      stack: stack
    };
    augmentStackTraceWithInitialElement(
      result,
      ex.sourceURL || ex.fileName,
      ex.line || ex.lineNumber,
      ex.message || ex.description
    );
    return result;
  }

  /**
   * Computes a stack trace for an exception.
   * @param {Error} ex
   * @param {(string|number)=} depth
   */
  function computeStackTrace(ex, depth) {
    var stack = null;
    depth = depth == null ? 0 : +depth;

    try {
      stack = computeStackTraceFromStackProp(ex);
      if (stack) {
        return stack;
      }
    } catch (e) {
      if (TraceKit$1.debug) {
        throw e;
      }
    }

    try {
      stack = computeStackTraceByWalkingCallerChain(ex, depth + 1);
      if (stack) {
        return stack;
      }
    } catch (e) {
      if (TraceKit$1.debug) {
        throw e;
      }
    }
    return {
      name: ex.name,
      message: ex.message,
      url: getLocationHref()
    };
  }

  computeStackTrace.augmentStackTraceWithInitialElement = augmentStackTraceWithInitialElement;
  computeStackTrace.computeStackTraceFromStackProp = computeStackTraceFromStackProp;

  return computeStackTrace;
})();

var tracekit = TraceKit$1;

/*
 * JavaScript MD5
 * https://github.com/blueimp/JavaScript-MD5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 *
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

/*
* Add integers, wrapping at 2^32. This uses 16-bit operations internally
* to work around bugs in some JS interpreters.
*/
function safeAdd(x, y) {
  var lsw = (x & 0xffff) + (y & 0xffff);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xffff);
}

/*
* Bitwise rotate a 32-bit number to the left.
*/
function bitRotateLeft(num, cnt) {
  return (num << cnt) | (num >>> (32 - cnt));
}

/*
* These functions implement the four basic operations the algorithm uses.
*/
function md5cmn(q, a, b, x, s, t) {
  return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
}
function md5ff(a, b, c, d, x, s, t) {
  return md5cmn((b & c) | (~b & d), a, b, x, s, t);
}
function md5gg(a, b, c, d, x, s, t) {
  return md5cmn((b & d) | (c & ~d), a, b, x, s, t);
}
function md5hh(a, b, c, d, x, s, t) {
  return md5cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5ii(a, b, c, d, x, s, t) {
  return md5cmn(c ^ (b | ~d), a, b, x, s, t);
}

/*
* Calculate the MD5 of an array of little-endian words, and a bit length.
*/
function binlMD5(x, len) {
  /* append padding */
  x[len >> 5] |= 0x80 << (len % 32);
  x[(((len + 64) >>> 9) << 4) + 14] = len;

  var i;
  var olda;
  var oldb;
  var oldc;
  var oldd;
  var a = 1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d = 271733878;

  for (i = 0; i < x.length; i += 16) {
    olda = a;
    oldb = b;
    oldc = c;
    oldd = d;

    a = md5ff(a, b, c, d, x[i], 7, -680876936);
    d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
    c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
    b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
    a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
    d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
    c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
    b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
    a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
    d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
    c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
    b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
    a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
    d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
    c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
    b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);

    a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
    d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
    c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
    b = md5gg(b, c, d, a, x[i], 20, -373897302);
    a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
    d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
    c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
    b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
    a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
    d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
    c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
    b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
    a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
    d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
    c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
    b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);

    a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
    d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
    c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
    b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
    a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
    d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
    c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
    b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
    a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
    d = md5hh(d, a, b, c, x[i], 11, -358537222);
    c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
    b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
    a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
    d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
    c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
    b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);

    a = md5ii(a, b, c, d, x[i], 6, -198630844);
    d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
    c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
    b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
    a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
    d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
    c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
    b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
    a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
    d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
    c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
    b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
    a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
    d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
    c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
    b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);

    a = safeAdd(a, olda);
    b = safeAdd(b, oldb);
    c = safeAdd(c, oldc);
    d = safeAdd(d, oldd);
  }
  return [a, b, c, d];
}

/*
* Convert an array of little-endian words to a string
*/
function binl2rstr(input) {
  var i;
  var output = '';
  var length32 = input.length * 32;
  for (i = 0; i < length32; i += 8) {
    output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xff);
  }
  return output;
}

/*
* Convert a raw string to an array of little-endian words
* Characters >255 have their high-byte silently ignored.
*/
function rstr2binl(input) {
  var i;
  var output = [];
  output[(input.length >> 2) - 1] = undefined;
  for (i = 0; i < output.length; i += 1) {
    output[i] = 0;
  }
  var length8 = input.length * 8;
  for (i = 0; i < length8; i += 8) {
    output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << (i % 32);
  }
  return output;
}

/*
* Calculate the MD5 of a raw string
*/
function rstrMD5(s) {
  return binl2rstr(binlMD5(rstr2binl(s), s.length * 8));
}

/*
* Calculate the HMAC-MD5, of a key and some data (raw strings)
*/
function rstrHMACMD5(key, data) {
  var i;
  var bkey = rstr2binl(key);
  var ipad = [];
  var opad = [];
  var hash;
  ipad[15] = opad[15] = undefined;
  if (bkey.length > 16) {
    bkey = binlMD5(bkey, key.length * 8);
  }
  for (i = 0; i < 16; i += 1) {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5c5c5c5c;
  }
  hash = binlMD5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
  return binl2rstr(binlMD5(opad.concat(hash), 512 + 128));
}

/*
* Convert a raw string to a hex string
*/
function rstr2hex(input) {
  var hexTab = '0123456789abcdef';
  var output = '';
  var x;
  var i;
  for (i = 0; i < input.length; i += 1) {
    x = input.charCodeAt(i);
    output += hexTab.charAt((x >>> 4) & 0x0f) + hexTab.charAt(x & 0x0f);
  }
  return output;
}

/*
* Encode a string as utf-8
*/
function str2rstrUTF8(input) {
  return unescape(encodeURIComponent(input));
}

/*
* Take string arguments and return either raw or hex encoded strings
*/
function rawMD5(s) {
  return rstrMD5(str2rstrUTF8(s));
}
function hexMD5(s) {
  return rstr2hex(rawMD5(s));
}
function rawHMACMD5(k, d) {
  return rstrHMACMD5(str2rstrUTF8(k), str2rstrUTF8(d));
}
function hexHMACMD5(k, d) {
  return rstr2hex(rawHMACMD5(k, d));
}

function md5$1(string, key, raw) {
  if (!key) {
    if (!raw) {
      return hexMD5(string);
    }
    return rawMD5(string);
  }
  if (!raw) {
    return hexHMACMD5(key, string);
  }
  return rawHMACMD5(key, string);
}

var md5_1 = md5$1;

function RavenConfigError$1(message) {
  this.name = 'RavenConfigError';
  this.message = message;
}
RavenConfigError$1.prototype = new Error();
RavenConfigError$1.prototype.constructor = RavenConfigError$1;

var configError = RavenConfigError$1;

var utils$1 = utils$3;

var wrapMethod = function(console, level, callback) {
  var originalConsoleLevel = console[level];
  var originalConsole = console;

  if (!(level in console)) {
    return;
  }

  var sentryLevel = level === 'warn' ? 'warning' : level;

  console[level] = function() {
    var args = [].slice.call(arguments);

    var msg = utils$1.safeJoin(args, ' ');
    var data = {level: sentryLevel, logger: 'console', extra: {arguments: args}};

    if (level === 'assert') {
      if (args[0] === false) {
        // Default browsers message
        msg =
          'Assertion failed: ' + (utils$1.safeJoin(args.slice(1), ' ') || 'console.assert');
        data.extra.arguments = args.slice(1);
        callback && callback(msg, data);
      }
    } else {
      callback && callback(msg, data);
    }

    // this fails for some browsers. :(
    if (originalConsoleLevel) {
      // IE9 doesn't allow calling apply on console functions directly
      // See: https://stackoverflow.com/questions/5472938/does-ie9-support-console-log-and-is-it-a-real-function#answer-5473193
      Function.prototype.apply.call(originalConsoleLevel, originalConsole, args);
    }
  };
};

var console$1 = {
  wrapMethod: wrapMethod
};

/*global XDomainRequest:false */

var TraceKit = tracekit;
var stringify = stringify$2.exports;
var md5 = md5_1;
var RavenConfigError = configError;

var utils = utils$3;
var isErrorEvent = utils.isErrorEvent;
var isDOMError = utils.isDOMError;
var isDOMException = utils.isDOMException;
var isError = utils.isError;
var isObject = utils.isObject;
var isPlainObject = utils.isPlainObject;
var isUndefined = utils.isUndefined;
var isFunction = utils.isFunction;
var isString = utils.isString;
var isArray = utils.isArray;
var isEmptyObject = utils.isEmptyObject;
var each = utils.each;
var objectMerge = utils.objectMerge;
var truncate = utils.truncate;
var objectFrozen = utils.objectFrozen;
var hasKey = utils.hasKey;
var joinRegExp = utils.joinRegExp;
var urlencode = utils.urlencode;
var uuid4 = utils.uuid4;
var htmlTreeAsString = utils.htmlTreeAsString;
var isSameException = utils.isSameException;
var isSameStacktrace = utils.isSameStacktrace;
var parseUrl = utils.parseUrl;
var fill = utils.fill;
var supportsFetch = utils.supportsFetch;
var supportsReferrerPolicy = utils.supportsReferrerPolicy;
var serializeKeysForMessage = utils.serializeKeysForMessage;
var serializeException = utils.serializeException;
var sanitize = utils.sanitize;

var wrapConsoleMethod = console$1.wrapMethod;

var dsnKeys = 'source protocol user pass host port path'.split(' '),
  dsnPattern = /^(?:(\w+):)?\/\/(?:(\w+)(:\w+)?@)?([\w\.-]+)(?::(\d+))?(\/.*)/;

function now() {
  return +new Date();
}

// This is to be defensive in environments where window does not exist (see https://github.com/getsentry/raven-js/pull/785)
var _window$1 =
  typeof window !== 'undefined'
    ? window
    : typeof commonjsGlobal !== 'undefined' ? commonjsGlobal : typeof self !== 'undefined' ? self : {};
var _document = _window$1.document;
var _navigator = _window$1.navigator;

function keepOriginalCallback(original, callback) {
  return isFunction(callback)
    ? function(data) {
        return callback(data, original);
      }
    : callback;
}

// First, check for JSON support
// If there is no JSON, we no-op the core features of Raven
// since JSON is required to encode the payload
function Raven$1() {
  this._hasJSON = !!(typeof JSON === 'object' && JSON.stringify);
  // Raven can run in contexts where there's no document (react-native)
  this._hasDocument = !isUndefined(_document);
  this._hasNavigator = !isUndefined(_navigator);
  this._lastCapturedException = null;
  this._lastData = null;
  this._lastEventId = null;
  this._globalServer = null;
  this._globalKey = null;
  this._globalProject = null;
  this._globalContext = {};
  this._globalOptions = {
    // SENTRY_RELEASE can be injected by https://github.com/getsentry/sentry-webpack-plugin
    release: _window$1.SENTRY_RELEASE && _window$1.SENTRY_RELEASE.id,
    logger: 'javascript',
    ignoreErrors: [],
    ignoreUrls: [],
    whitelistUrls: [],
    includePaths: [],
    headers: null,
    collectWindowErrors: true,
    captureUnhandledRejections: true,
    maxMessageLength: 0,
    // By default, truncates URL values to 250 chars
    maxUrlLength: 250,
    stackTraceLimit: 50,
    autoBreadcrumbs: true,
    instrument: true,
    sampleRate: 1,
    sanitizeKeys: []
  };
  this._fetchDefaults = {
    method: 'POST',
    // Despite all stars in the sky saying that Edge supports old draft syntax, aka 'never', 'always', 'origin' and 'default
    // https://caniuse.com/#feat=referrer-policy
    // It doesn't. And it throw exception instead of ignoring this parameter...
    // REF: https://github.com/getsentry/raven-js/issues/1233
    referrerPolicy: supportsReferrerPolicy() ? 'origin' : ''
  };
  this._ignoreOnError = 0;
  this._isRavenInstalled = false;
  this._originalErrorStackTraceLimit = Error.stackTraceLimit;
  // capture references to window.console *and* all its methods first
  // before the console plugin has a chance to monkey patch
  this._originalConsole = _window$1.console || {};
  this._originalConsoleMethods = {};
  this._plugins = [];
  this._startTime = now();
  this._wrappedBuiltIns = [];
  this._breadcrumbs = [];
  this._lastCapturedEvent = null;
  this._keypressTimeout;
  this._location = _window$1.location;
  this._lastHref = this._location && this._location.href;
  this._resetBackoff();

  // eslint-disable-next-line guard-for-in
  for (var method in this._originalConsole) {
    this._originalConsoleMethods[method] = this._originalConsole[method];
  }
}

/*
 * The core Raven singleton
 *
 * @this {Raven}
 */

Raven$1.prototype = {
  // Hardcode version string so that raven source can be loaded directly via
  // webpack (using a build step causes webpack #1617). Grunt verifies that
  // this value matches package.json during build.
  //   See: https://github.com/getsentry/raven-js/issues/465
  VERSION: '3.27.2',

  debug: false,

  TraceKit: TraceKit, // alias to TraceKit

  /*
     * Configure Raven with a DSN and extra options
     *
     * @param {string} dsn The public Sentry DSN
     * @param {object} options Set of global options [optional]
     * @return {Raven}
     */
  config: function(dsn, options) {
    var self = this;

    if (self._globalServer) {
      this._logDebug('error', 'Error: Raven has already been configured');
      return self;
    }
    if (!dsn) return self;

    var globalOptions = self._globalOptions;

    // merge in options
    if (options) {
      each(options, function(key, value) {
        // tags and extra are special and need to be put into context
        if (key === 'tags' || key === 'extra' || key === 'user') {
          self._globalContext[key] = value;
        } else {
          globalOptions[key] = value;
        }
      });
    }

    self.setDSN(dsn);

    // "Script error." is hard coded into browsers for errors that it can't read.
    // this is the result of a script being pulled in from an external domain and CORS.
    globalOptions.ignoreErrors.push(/^Script error\.?$/);
    globalOptions.ignoreErrors.push(/^Javascript error: Script error\.? on line 0$/);

    // join regexp rules into one big rule
    globalOptions.ignoreErrors = joinRegExp(globalOptions.ignoreErrors);
    globalOptions.ignoreUrls = globalOptions.ignoreUrls.length
      ? joinRegExp(globalOptions.ignoreUrls)
      : false;
    globalOptions.whitelistUrls = globalOptions.whitelistUrls.length
      ? joinRegExp(globalOptions.whitelistUrls)
      : false;
    globalOptions.includePaths = joinRegExp(globalOptions.includePaths);
    globalOptions.maxBreadcrumbs = Math.max(
      0,
      Math.min(globalOptions.maxBreadcrumbs || 100, 100)
    ); // default and hard limit is 100

    var autoBreadcrumbDefaults = {
      xhr: true,
      console: true,
      dom: true,
      location: true,
      sentry: true
    };

    var autoBreadcrumbs = globalOptions.autoBreadcrumbs;
    if ({}.toString.call(autoBreadcrumbs) === '[object Object]') {
      autoBreadcrumbs = objectMerge(autoBreadcrumbDefaults, autoBreadcrumbs);
    } else if (autoBreadcrumbs !== false) {
      autoBreadcrumbs = autoBreadcrumbDefaults;
    }
    globalOptions.autoBreadcrumbs = autoBreadcrumbs;

    var instrumentDefaults = {
      tryCatch: true
    };

    var instrument = globalOptions.instrument;
    if ({}.toString.call(instrument) === '[object Object]') {
      instrument = objectMerge(instrumentDefaults, instrument);
    } else if (instrument !== false) {
      instrument = instrumentDefaults;
    }
    globalOptions.instrument = instrument;

    TraceKit.collectWindowErrors = !!globalOptions.collectWindowErrors;

    // return for chaining
    return self;
  },

  /*
     * Installs a global window.onerror error handler
     * to capture and report uncaught exceptions.
     * At this point, install() is required to be called due
     * to the way TraceKit is set up.
     *
     * @return {Raven}
     */
  install: function() {
    var self = this;
    if (self.isSetup() && !self._isRavenInstalled) {
      TraceKit.report.subscribe(function() {
        self._handleOnErrorStackInfo.apply(self, arguments);
      });

      if (self._globalOptions.captureUnhandledRejections) {
        self._attachPromiseRejectionHandler();
      }

      self._patchFunctionToString();

      if (self._globalOptions.instrument && self._globalOptions.instrument.tryCatch) {
        self._instrumentTryCatch();
      }

      if (self._globalOptions.autoBreadcrumbs) self._instrumentBreadcrumbs();

      // Install all of the plugins
      self._drainPlugins();

      self._isRavenInstalled = true;
    }

    Error.stackTraceLimit = self._globalOptions.stackTraceLimit;
    return this;
  },

  /*
     * Set the DSN (can be called multiple time unlike config)
     *
     * @param {string} dsn The public Sentry DSN
     */
  setDSN: function(dsn) {
    var self = this,
      uri = self._parseDSN(dsn),
      lastSlash = uri.path.lastIndexOf('/'),
      path = uri.path.substr(1, lastSlash);

    self._dsn = dsn;
    self._globalKey = uri.user;
    self._globalSecret = uri.pass && uri.pass.substr(1);
    self._globalProject = uri.path.substr(lastSlash + 1);

    self._globalServer = self._getGlobalServer(uri);

    self._globalEndpoint =
      self._globalServer + '/' + path + 'api/' + self._globalProject + '/store/';

    // Reset backoff state since we may be pointing at a
    // new project/server
    this._resetBackoff();
  },

  /*
     * Wrap code within a context so Raven can capture errors
     * reliably across domains that is executed immediately.
     *
     * @param {object} options A specific set of options for this context [optional]
     * @param {function} func The callback to be immediately executed within the context
     * @param {array} args An array of arguments to be called with the callback [optional]
     */
  context: function(options, func, args) {
    if (isFunction(options)) {
      args = func || [];
      func = options;
      options = {};
    }

    return this.wrap(options, func).apply(this, args);
  },

  /*
     * Wrap code within a context and returns back a new function to be executed
     *
     * @param {object} options A specific set of options for this context [optional]
     * @param {function} func The function to be wrapped in a new context
     * @param {function} _before A function to call before the try/catch wrapper [optional, private]
     * @return {function} The newly wrapped functions with a context
     */
  wrap: function(options, func, _before) {
    var self = this;
    // 1 argument has been passed, and it's not a function
    // so just return it
    if (isUndefined(func) && !isFunction(options)) {
      return options;
    }

    // options is optional
    if (isFunction(options)) {
      func = options;
      options = undefined;
    }

    // At this point, we've passed along 2 arguments, and the second one
    // is not a function either, so we'll just return the second argument.
    if (!isFunction(func)) {
      return func;
    }

    // We don't wanna wrap it twice!
    try {
      if (func.__raven__) {
        return func;
      }

      // If this has already been wrapped in the past, return that
      if (func.__raven_wrapper__) {
        return func.__raven_wrapper__;
      }
    } catch (e) {
      // Just accessing custom props in some Selenium environments
      // can cause a "Permission denied" exception (see raven-js#495).
      // Bail on wrapping and return the function as-is (defers to window.onerror).
      return func;
    }

    function wrapped() {
      var args = [],
        i = arguments.length,
        deep = !options || (options && options.deep !== false);

      if (_before && isFunction(_before)) {
        _before.apply(this, arguments);
      }

      // Recursively wrap all of a function's arguments that are
      // functions themselves.
      while (i--) args[i] = deep ? self.wrap(options, arguments[i]) : arguments[i];

      try {
        // Attempt to invoke user-land function
        // NOTE: If you are a Sentry user, and you are seeing this stack frame, it
        //       means Raven caught an error invoking your application code. This is
        //       expected behavior and NOT indicative of a bug with Raven.js.
        return func.apply(this, args);
      } catch (e) {
        self._ignoreNextOnError();
        self.captureException(e, options);
        throw e;
      }
    }

    // copy over properties of the old function
    for (var property in func) {
      if (hasKey(func, property)) {
        wrapped[property] = func[property];
      }
    }
    wrapped.prototype = func.prototype;

    func.__raven_wrapper__ = wrapped;
    // Signal that this function has been wrapped/filled already
    // for both debugging and to prevent it to being wrapped/filled twice
    wrapped.__raven__ = true;
    wrapped.__orig__ = func;

    return wrapped;
  },

  /**
   * Uninstalls the global error handler.
   *
   * @return {Raven}
   */
  uninstall: function() {
    TraceKit.report.uninstall();

    this._detachPromiseRejectionHandler();
    this._unpatchFunctionToString();
    this._restoreBuiltIns();
    this._restoreConsole();

    Error.stackTraceLimit = this._originalErrorStackTraceLimit;
    this._isRavenInstalled = false;

    return this;
  },

  /**
   * Callback used for `unhandledrejection` event
   *
   * @param {PromiseRejectionEvent} event An object containing
   *   promise: the Promise that was rejected
   *   reason: the value with which the Promise was rejected
   * @return void
   */
  _promiseRejectionHandler: function(event) {
    this._logDebug('debug', 'Raven caught unhandled promise rejection:', event);
    this.captureException(event.reason, {
      mechanism: {
        type: 'onunhandledrejection',
        handled: false
      }
    });
  },

  /**
   * Installs the global promise rejection handler.
   *
   * @return {raven}
   */
  _attachPromiseRejectionHandler: function() {
    this._promiseRejectionHandler = this._promiseRejectionHandler.bind(this);
    _window$1.addEventListener &&
      _window$1.addEventListener('unhandledrejection', this._promiseRejectionHandler);
    return this;
  },

  /**
   * Uninstalls the global promise rejection handler.
   *
   * @return {raven}
   */
  _detachPromiseRejectionHandler: function() {
    _window$1.removeEventListener &&
      _window$1.removeEventListener('unhandledrejection', this._promiseRejectionHandler);
    return this;
  },

  /**
   * Manually capture an exception and send it over to Sentry
   *
   * @param {error} ex An exception to be logged
   * @param {object} options A specific set of options for this error [optional]
   * @return {Raven}
   */
  captureException: function(ex, options) {
    options = objectMerge({trimHeadFrames: 0}, options ? options : {});

    if (isErrorEvent(ex) && ex.error) {
      // If it is an ErrorEvent with `error` property, extract it to get actual Error
      ex = ex.error;
    } else if (isDOMError(ex) || isDOMException(ex)) {
      // If it is a DOMError or DOMException (which are legacy APIs, but still supported in some browsers)
      // then we just extract the name and message, as they don't provide anything else
      // https://developer.mozilla.org/en-US/docs/Web/API/DOMError
      // https://developer.mozilla.org/en-US/docs/Web/API/DOMException
      var name = ex.name || (isDOMError(ex) ? 'DOMError' : 'DOMException');
      var message = ex.message ? name + ': ' + ex.message : name;

      return this.captureMessage(
        message,
        objectMerge(options, {
          // neither DOMError or DOMException provide stack trace and we most likely wont get it this way as well
          // but it's barely any overhead so we may at least try
          stacktrace: true,
          trimHeadFrames: options.trimHeadFrames + 1
        })
      );
    } else if (isError(ex)) {
      // we have a real Error object
      ex = ex;
    } else if (isPlainObject(ex)) {
      // If it is plain Object, serialize it manually and extract options
      // This will allow us to group events based on top-level keys
      // which is much better than creating new group when any key/value change
      options = this._getCaptureExceptionOptionsFromPlainObject(options, ex);
      ex = new Error(options.message);
    } else {
      // If none of previous checks were valid, then it means that
      // it's not a DOMError/DOMException
      // it's not a plain Object
      // it's not a valid ErrorEvent (one with an error property)
      // it's not an Error
      // So bail out and capture it as a simple message:
      return this.captureMessage(
        ex,
        objectMerge(options, {
          stacktrace: true, // if we fall back to captureMessage, default to attempting a new trace
          trimHeadFrames: options.trimHeadFrames + 1
        })
      );
    }

    // Store the raw exception object for potential debugging and introspection
    this._lastCapturedException = ex;

    // TraceKit.report will re-raise any exception passed to it,
    // which means you have to wrap it in try/catch. Instead, we
    // can wrap it here and only re-raise if TraceKit.report
    // raises an exception different from the one we asked to
    // report on.
    try {
      var stack = TraceKit.computeStackTrace(ex);
      this._handleStackInfo(stack, options);
    } catch (ex1) {
      if (ex !== ex1) {
        throw ex1;
      }
    }

    return this;
  },

  _getCaptureExceptionOptionsFromPlainObject: function(currentOptions, ex) {
    var exKeys = Object.keys(ex).sort();
    var options = objectMerge(currentOptions, {
      message:
        'Non-Error exception captured with keys: ' + serializeKeysForMessage(exKeys),
      fingerprint: [md5(exKeys)],
      extra: currentOptions.extra || {}
    });
    options.extra.__serialized__ = serializeException(ex);

    return options;
  },

  /*
     * Manually send a message to Sentry
     *
     * @param {string} msg A plain message to be captured in Sentry
     * @param {object} options A specific set of options for this message [optional]
     * @return {Raven}
     */
  captureMessage: function(msg, options) {
    // config() automagically converts ignoreErrors from a list to a RegExp so we need to test for an
    // early call; we'll error on the side of logging anything called before configuration since it's
    // probably something you should see:
    if (
      !!this._globalOptions.ignoreErrors.test &&
      this._globalOptions.ignoreErrors.test(msg)
    ) {
      return;
    }

    options = options || {};
    msg = msg + ''; // Make sure it's actually a string

    var data = objectMerge(
      {
        message: msg
      },
      options
    );

    var ex;
    // Generate a "synthetic" stack trace from this point.
    // NOTE: If you are a Sentry user, and you are seeing this stack frame, it is NOT indicative
    //       of a bug with Raven.js. Sentry generates synthetic traces either by configuration,
    //       or if it catches a thrown object without a "stack" property.
    try {
      throw new Error(msg);
    } catch (ex1) {
      ex = ex1;
    }

    // null exception name so `Error` isn't prefixed to msg
    ex.name = null;
    var stack = TraceKit.computeStackTrace(ex);

    // stack[0] is `throw new Error(msg)` call itself, we are interested in the frame that was just before that, stack[1]
    var initialCall = isArray(stack.stack) && stack.stack[1];

    // if stack[1] is `Raven.captureException`, it means that someone passed a string to it and we redirected that call
    // to be handled by `captureMessage`, thus `initialCall` is the 3rd one, not 2nd
    // initialCall => captureException(string) => captureMessage(string)
    if (initialCall && initialCall.func === 'Raven.captureException') {
      initialCall = stack.stack[2];
    }

    var fileurl = (initialCall && initialCall.url) || '';

    if (
      !!this._globalOptions.ignoreUrls.test &&
      this._globalOptions.ignoreUrls.test(fileurl)
    ) {
      return;
    }

    if (
      !!this._globalOptions.whitelistUrls.test &&
      !this._globalOptions.whitelistUrls.test(fileurl)
    ) {
      return;
    }

    // Always attempt to get stacktrace if message is empty.
    // It's the only way to provide any helpful information to the user.
    if (this._globalOptions.stacktrace || options.stacktrace || data.message === '') {
      // fingerprint on msg, not stack trace (legacy behavior, could be revisited)
      data.fingerprint = data.fingerprint == null ? msg : data.fingerprint;

      options = objectMerge(
        {
          trimHeadFrames: 0
        },
        options
      );
      // Since we know this is a synthetic trace, the top frame (this function call)
      // MUST be from Raven.js, so mark it for trimming
      // We add to the trim counter so that callers can choose to trim extra frames, such
      // as utility functions.
      options.trimHeadFrames += 1;

      var frames = this._prepareFrames(stack, options);
      data.stacktrace = {
        // Sentry expects frames oldest to newest
        frames: frames.reverse()
      };
    }

    // Make sure that fingerprint is always wrapped in an array
    if (data.fingerprint) {
      data.fingerprint = isArray(data.fingerprint)
        ? data.fingerprint
        : [data.fingerprint];
    }

    // Fire away!
    this._send(data);

    return this;
  },

  captureBreadcrumb: function(obj) {
    var crumb = objectMerge(
      {
        timestamp: now() / 1000
      },
      obj
    );

    if (isFunction(this._globalOptions.breadcrumbCallback)) {
      var result = this._globalOptions.breadcrumbCallback(crumb);

      if (isObject(result) && !isEmptyObject(result)) {
        crumb = result;
      } else if (result === false) {
        return this;
      }
    }

    this._breadcrumbs.push(crumb);
    if (this._breadcrumbs.length > this._globalOptions.maxBreadcrumbs) {
      this._breadcrumbs.shift();
    }
    return this;
  },

  addPlugin: function(plugin /*arg1, arg2, ... argN*/) {
    var pluginArgs = [].slice.call(arguments, 1);

    this._plugins.push([plugin, pluginArgs]);
    if (this._isRavenInstalled) {
      this._drainPlugins();
    }

    return this;
  },

  /*
     * Set/clear a user to be sent along with the payload.
     *
     * @param {object} user An object representing user data [optional]
     * @return {Raven}
     */
  setUserContext: function(user) {
    // Intentionally do not merge here since that's an unexpected behavior.
    this._globalContext.user = user;

    return this;
  },

  /*
     * Merge extra attributes to be sent along with the payload.
     *
     * @param {object} extra An object representing extra data [optional]
     * @return {Raven}
     */
  setExtraContext: function(extra) {
    this._mergeContext('extra', extra);

    return this;
  },

  /*
     * Merge tags to be sent along with the payload.
     *
     * @param {object} tags An object representing tags [optional]
     * @return {Raven}
     */
  setTagsContext: function(tags) {
    this._mergeContext('tags', tags);

    return this;
  },

  /*
     * Clear all of the context.
     *
     * @return {Raven}
     */
  clearContext: function() {
    this._globalContext = {};

    return this;
  },

  /*
     * Get a copy of the current context. This cannot be mutated.
     *
     * @return {object} copy of context
     */
  getContext: function() {
    // lol javascript
    return JSON.parse(stringify(this._globalContext));
  },

  /*
     * Set environment of application
     *
     * @param {string} environment Typically something like 'production'.
     * @return {Raven}
     */
  setEnvironment: function(environment) {
    this._globalOptions.environment = environment;

    return this;
  },

  /*
     * Set release version of application
     *
     * @param {string} release Typically something like a git SHA to identify version
     * @return {Raven}
     */
  setRelease: function(release) {
    this._globalOptions.release = release;

    return this;
  },

  /*
     * Set the dataCallback option
     *
     * @param {function} callback The callback to run which allows the
     *                            data blob to be mutated before sending
     * @return {Raven}
     */
  setDataCallback: function(callback) {
    var original = this._globalOptions.dataCallback;
    this._globalOptions.dataCallback = keepOriginalCallback(original, callback);
    return this;
  },

  /*
     * Set the breadcrumbCallback option
     *
     * @param {function} callback The callback to run which allows filtering
     *                            or mutating breadcrumbs
     * @return {Raven}
     */
  setBreadcrumbCallback: function(callback) {
    var original = this._globalOptions.breadcrumbCallback;
    this._globalOptions.breadcrumbCallback = keepOriginalCallback(original, callback);
    return this;
  },

  /*
     * Set the shouldSendCallback option
     *
     * @param {function} callback The callback to run which allows
     *                            introspecting the blob before sending
     * @return {Raven}
     */
  setShouldSendCallback: function(callback) {
    var original = this._globalOptions.shouldSendCallback;
    this._globalOptions.shouldSendCallback = keepOriginalCallback(original, callback);
    return this;
  },

  /**
   * Override the default HTTP transport mechanism that transmits data
   * to the Sentry server.
   *
   * @param {function} transport Function invoked instead of the default
   *                             `makeRequest` handler.
   *
   * @return {Raven}
   */
  setTransport: function(transport) {
    this._globalOptions.transport = transport;

    return this;
  },

  /*
     * Get the latest raw exception that was captured by Raven.
     *
     * @return {error}
     */
  lastException: function() {
    return this._lastCapturedException;
  },

  /*
     * Get the last event id
     *
     * @return {string}
     */
  lastEventId: function() {
    return this._lastEventId;
  },

  /*
     * Determine if Raven is setup and ready to go.
     *
     * @return {boolean}
     */
  isSetup: function() {
    if (!this._hasJSON) return false; // needs JSON support
    if (!this._globalServer) {
      if (!this.ravenNotConfiguredError) {
        this.ravenNotConfiguredError = true;
        this._logDebug('error', 'Error: Raven has not been configured.');
      }
      return false;
    }
    return true;
  },

  afterLoad: function() {
    // TODO: remove window dependence?

    // Attempt to initialize Raven on load
    var RavenConfig = _window$1.RavenConfig;
    if (RavenConfig) {
      this.config(RavenConfig.dsn, RavenConfig.config).install();
    }
  },

  showReportDialog: function(options) {
    if (
      !_document // doesn't work without a document (React native)
    )
      return;

    options = objectMerge(
      {
        eventId: this.lastEventId(),
        dsn: this._dsn,
        user: this._globalContext.user || {}
      },
      options
    );

    if (!options.eventId) {
      throw new RavenConfigError('Missing eventId');
    }

    if (!options.dsn) {
      throw new RavenConfigError('Missing DSN');
    }

    var encode = encodeURIComponent;
    var encodedOptions = [];

    for (var key in options) {
      if (key === 'user') {
        var user = options.user;
        if (user.name) encodedOptions.push('name=' + encode(user.name));
        if (user.email) encodedOptions.push('email=' + encode(user.email));
      } else {
        encodedOptions.push(encode(key) + '=' + encode(options[key]));
      }
    }
    var globalServer = this._getGlobalServer(this._parseDSN(options.dsn));

    var script = _document.createElement('script');
    script.async = true;
    script.src = globalServer + '/api/embed/error-page/?' + encodedOptions.join('&');
    (_document.head || _document.body).appendChild(script);
  },

  /**** Private functions ****/
  _ignoreNextOnError: function() {
    var self = this;
    this._ignoreOnError += 1;
    setTimeout(function() {
      // onerror should trigger before setTimeout
      self._ignoreOnError -= 1;
    });
  },

  _triggerEvent: function(eventType, options) {
    // NOTE: `event` is a native browser thing, so let's avoid conflicting wiht it
    var evt, key;

    if (!this._hasDocument) return;

    options = options || {};

    eventType = 'raven' + eventType.substr(0, 1).toUpperCase() + eventType.substr(1);

    if (_document.createEvent) {
      evt = _document.createEvent('HTMLEvents');
      evt.initEvent(eventType, true, true);
    } else {
      evt = _document.createEventObject();
      evt.eventType = eventType;
    }

    for (key in options)
      if (hasKey(options, key)) {
        evt[key] = options[key];
      }

    if (_document.createEvent) {
      // IE9 if standards
      _document.dispatchEvent(evt);
    } else {
      // IE8 regardless of Quirks or Standards
      // IE9 if quirks
      try {
        _document.fireEvent('on' + evt.eventType.toLowerCase(), evt);
      } catch (e) {
        // Do nothing
      }
    }
  },

  /**
   * Wraps addEventListener to capture UI breadcrumbs
   * @param evtName the event name (e.g. "click")
   * @returns {Function}
   * @private
   */
  _breadcrumbEventHandler: function(evtName) {
    var self = this;
    return function(evt) {
      // reset keypress timeout; e.g. triggering a 'click' after
      // a 'keypress' will reset the keypress debounce so that a new
      // set of keypresses can be recorded
      self._keypressTimeout = null;

      // It's possible this handler might trigger multiple times for the same
      // event (e.g. event propagation through node ancestors). Ignore if we've
      // already captured the event.
      if (self._lastCapturedEvent === evt) return;

      self._lastCapturedEvent = evt;

      // try/catch both:
      // - accessing evt.target (see getsentry/raven-js#838, #768)
      // - `htmlTreeAsString` because it's complex, and just accessing the DOM incorrectly
      //   can throw an exception in some circumstances.
      var target;
      try {
        target = htmlTreeAsString(evt.target);
      } catch (e) {
        target = '<unknown>';
      }

      self.captureBreadcrumb({
        category: 'ui.' + evtName, // e.g. ui.click, ui.input
        message: target
      });
    };
  },

  /**
   * Wraps addEventListener to capture keypress UI events
   * @returns {Function}
   * @private
   */
  _keypressEventHandler: function() {
    var self = this,
      debounceDuration = 1000; // milliseconds

    // TODO: if somehow user switches keypress target before
    //       debounce timeout is triggered, we will only capture
    //       a single breadcrumb from the FIRST target (acceptable?)
    return function(evt) {
      var target;
      try {
        target = evt.target;
      } catch (e) {
        // just accessing event properties can throw an exception in some rare circumstances
        // see: https://github.com/getsentry/raven-js/issues/838
        return;
      }
      var tagName = target && target.tagName;

      // only consider keypress events on actual input elements
      // this will disregard keypresses targeting body (e.g. tabbing
      // through elements, hotkeys, etc)
      if (
        !tagName ||
        (tagName !== 'INPUT' && tagName !== 'TEXTAREA' && !target.isContentEditable)
      )
        return;

      // record first keypress in a series, but ignore subsequent
      // keypresses until debounce clears
      var timeout = self._keypressTimeout;
      if (!timeout) {
        self._breadcrumbEventHandler('input')(evt);
      }
      clearTimeout(timeout);
      self._keypressTimeout = setTimeout(function() {
        self._keypressTimeout = null;
      }, debounceDuration);
    };
  },

  /**
   * Captures a breadcrumb of type "navigation", normalizing input URLs
   * @param to the originating URL
   * @param from the target URL
   * @private
   */
  _captureUrlChange: function(from, to) {
    var parsedLoc = parseUrl(this._location.href);
    var parsedTo = parseUrl(to);
    var parsedFrom = parseUrl(from);

    // because onpopstate only tells you the "new" (to) value of location.href, and
    // not the previous (from) value, we need to track the value of the current URL
    // state ourselves
    this._lastHref = to;

    // Use only the path component of the URL if the URL matches the current
    // document (almost all the time when using pushState)
    if (parsedLoc.protocol === parsedTo.protocol && parsedLoc.host === parsedTo.host)
      to = parsedTo.relative;
    if (parsedLoc.protocol === parsedFrom.protocol && parsedLoc.host === parsedFrom.host)
      from = parsedFrom.relative;

    this.captureBreadcrumb({
      category: 'navigation',
      data: {
        to: to,
        from: from
      }
    });
  },

  _patchFunctionToString: function() {
    var self = this;
    self._originalFunctionToString = Function.prototype.toString;
    // eslint-disable-next-line no-extend-native
    Function.prototype.toString = function() {
      if (typeof this === 'function' && this.__raven__) {
        return self._originalFunctionToString.apply(this.__orig__, arguments);
      }
      return self._originalFunctionToString.apply(this, arguments);
    };
  },

  _unpatchFunctionToString: function() {
    if (this._originalFunctionToString) {
      // eslint-disable-next-line no-extend-native
      Function.prototype.toString = this._originalFunctionToString;
    }
  },

  /**
   * Wrap timer functions and event targets to catch errors and provide
   * better metadata.
   */
  _instrumentTryCatch: function() {
    var self = this;

    var wrappedBuiltIns = self._wrappedBuiltIns;

    function wrapTimeFn(orig) {
      return function(fn, t) {
        // preserve arity
        // Make a copy of the arguments to prevent deoptimization
        // https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#32-leaking-arguments
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; ++i) {
          args[i] = arguments[i];
        }
        var originalCallback = args[0];
        if (isFunction(originalCallback)) {
          args[0] = self.wrap(
            {
              mechanism: {
                type: 'instrument',
                data: {function: orig.name || '<anonymous>'}
              }
            },
            originalCallback
          );
        }

        // IE < 9 doesn't support .call/.apply on setInterval/setTimeout, but it
        // also supports only two arguments and doesn't care what this is, so we
        // can just call the original function directly.
        if (orig.apply) {
          return orig.apply(this, args);
        } else {
          return orig(args[0], args[1]);
        }
      };
    }

    var autoBreadcrumbs = this._globalOptions.autoBreadcrumbs;

    function wrapEventTarget(global) {
      var proto = _window$1[global] && _window$1[global].prototype;
      if (proto && proto.hasOwnProperty && proto.hasOwnProperty('addEventListener')) {
        fill(
          proto,
          'addEventListener',
          function(orig) {
            return function(evtName, fn, capture, secure) {
              // preserve arity
              try {
                if (fn && fn.handleEvent) {
                  fn.handleEvent = self.wrap(
                    {
                      mechanism: {
                        type: 'instrument',
                        data: {
                          target: global,
                          function: 'handleEvent',
                          handler: (fn && fn.name) || '<anonymous>'
                        }
                      }
                    },
                    fn.handleEvent
                  );
                }
              } catch (err) {
                // can sometimes get 'Permission denied to access property "handle Event'
              }

              // More breadcrumb DOM capture ... done here and not in `_instrumentBreadcrumbs`
              // so that we don't have more than one wrapper function
              var before, clickHandler, keypressHandler;

              if (
                autoBreadcrumbs &&
                autoBreadcrumbs.dom &&
                (global === 'EventTarget' || global === 'Node')
              ) {
                // NOTE: generating multiple handlers per addEventListener invocation, should
                //       revisit and verify we can just use one (almost certainly)
                clickHandler = self._breadcrumbEventHandler('click');
                keypressHandler = self._keypressEventHandler();
                before = function(evt) {
                  // need to intercept every DOM event in `before` argument, in case that
                  // same wrapped method is re-used for different events (e.g. mousemove THEN click)
                  // see #724
                  if (!evt) return;

                  var eventType;
                  try {
                    eventType = evt.type;
                  } catch (e) {
                    // just accessing event properties can throw an exception in some rare circumstances
                    // see: https://github.com/getsentry/raven-js/issues/838
                    return;
                  }
                  if (eventType === 'click') return clickHandler(evt);
                  else if (eventType === 'keypress') return keypressHandler(evt);
                };
              }
              return orig.call(
                this,
                evtName,
                self.wrap(
                  {
                    mechanism: {
                      type: 'instrument',
                      data: {
                        target: global,
                        function: 'addEventListener',
                        handler: (fn && fn.name) || '<anonymous>'
                      }
                    }
                  },
                  fn,
                  before
                ),
                capture,
                secure
              );
            };
          },
          wrappedBuiltIns
        );
        fill(
          proto,
          'removeEventListener',
          function(orig) {
            return function(evt, fn, capture, secure) {
              try {
                fn = fn && (fn.__raven_wrapper__ ? fn.__raven_wrapper__ : fn);
              } catch (e) {
                // ignore, accessing __raven_wrapper__ will throw in some Selenium environments
              }
              return orig.call(this, evt, fn, capture, secure);
            };
          },
          wrappedBuiltIns
        );
      }
    }

    fill(_window$1, 'setTimeout', wrapTimeFn, wrappedBuiltIns);
    fill(_window$1, 'setInterval', wrapTimeFn, wrappedBuiltIns);
    if (_window$1.requestAnimationFrame) {
      fill(
        _window$1,
        'requestAnimationFrame',
        function(orig) {
          return function(cb) {
            return orig(
              self.wrap(
                {
                  mechanism: {
                    type: 'instrument',
                    data: {
                      function: 'requestAnimationFrame',
                      handler: (orig && orig.name) || '<anonymous>'
                    }
                  }
                },
                cb
              )
            );
          };
        },
        wrappedBuiltIns
      );
    }

    // event targets borrowed from bugsnag-js:
    // https://github.com/bugsnag/bugsnag-js/blob/master/src/bugsnag.js#L666
    var eventTargets = [
      'EventTarget',
      'Window',
      'Node',
      'ApplicationCache',
      'AudioTrackList',
      'ChannelMergerNode',
      'CryptoOperation',
      'EventSource',
      'FileReader',
      'HTMLUnknownElement',
      'IDBDatabase',
      'IDBRequest',
      'IDBTransaction',
      'KeyOperation',
      'MediaController',
      'MessagePort',
      'ModalWindow',
      'Notification',
      'SVGElementInstance',
      'Screen',
      'TextTrack',
      'TextTrackCue',
      'TextTrackList',
      'WebSocket',
      'WebSocketWorker',
      'Worker',
      'XMLHttpRequest',
      'XMLHttpRequestEventTarget',
      'XMLHttpRequestUpload'
    ];
    for (var i = 0; i < eventTargets.length; i++) {
      wrapEventTarget(eventTargets[i]);
    }
  },

  /**
   * Instrument browser built-ins w/ breadcrumb capturing
   *  - XMLHttpRequests
   *  - DOM interactions (click/typing)
   *  - window.location changes
   *  - console
   *
   * Can be disabled or individually configured via the `autoBreadcrumbs` config option
   */
  _instrumentBreadcrumbs: function() {
    var self = this;
    var autoBreadcrumbs = this._globalOptions.autoBreadcrumbs;

    var wrappedBuiltIns = self._wrappedBuiltIns;

    function wrapProp(prop, xhr) {
      if (prop in xhr && isFunction(xhr[prop])) {
        fill(xhr, prop, function(orig) {
          return self.wrap(
            {
              mechanism: {
                type: 'instrument',
                data: {function: prop, handler: (orig && orig.name) || '<anonymous>'}
              }
            },
            orig
          );
        }); // intentionally don't track filled methods on XHR instances
      }
    }

    if (autoBreadcrumbs.xhr && 'XMLHttpRequest' in _window$1) {
      var xhrproto = _window$1.XMLHttpRequest && _window$1.XMLHttpRequest.prototype;
      fill(
        xhrproto,
        'open',
        function(origOpen) {
          return function(method, url) {
            // preserve arity

            // if Sentry key appears in URL, don't capture
            if (isString(url) && url.indexOf(self._globalKey) === -1) {
              this.__raven_xhr = {
                method: method,
                url: url,
                status_code: null
              };
            }

            return origOpen.apply(this, arguments);
          };
        },
        wrappedBuiltIns
      );

      fill(
        xhrproto,
        'send',
        function(origSend) {
          return function() {
            // preserve arity
            var xhr = this;

            function onreadystatechangeHandler() {
              if (xhr.__raven_xhr && xhr.readyState === 4) {
                try {
                  // touching statusCode in some platforms throws
                  // an exception
                  xhr.__raven_xhr.status_code = xhr.status;
                } catch (e) {
                  /* do nothing */
                }

                self.captureBreadcrumb({
                  type: 'http',
                  category: 'xhr',
                  data: xhr.__raven_xhr
                });
              }
            }

            var props = ['onload', 'onerror', 'onprogress'];
            for (var j = 0; j < props.length; j++) {
              wrapProp(props[j], xhr);
            }

            if ('onreadystatechange' in xhr && isFunction(xhr.onreadystatechange)) {
              fill(
                xhr,
                'onreadystatechange',
                function(orig) {
                  return self.wrap(
                    {
                      mechanism: {
                        type: 'instrument',
                        data: {
                          function: 'onreadystatechange',
                          handler: (orig && orig.name) || '<anonymous>'
                        }
                      }
                    },
                    orig,
                    onreadystatechangeHandler
                  );
                } /* intentionally don't track this instrumentation */
              );
            } else {
              // if onreadystatechange wasn't actually set by the page on this xhr, we
              // are free to set our own and capture the breadcrumb
              xhr.onreadystatechange = onreadystatechangeHandler;
            }

            return origSend.apply(this, arguments);
          };
        },
        wrappedBuiltIns
      );
    }

    if (autoBreadcrumbs.xhr && supportsFetch()) {
      fill(
        _window$1,
        'fetch',
        function(origFetch) {
          return function() {
            // preserve arity
            // Make a copy of the arguments to prevent deoptimization
            // https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#32-leaking-arguments
            var args = new Array(arguments.length);
            for (var i = 0; i < args.length; ++i) {
              args[i] = arguments[i];
            }

            var fetchInput = args[0];
            var method = 'GET';
            var url;

            if (typeof fetchInput === 'string') {
              url = fetchInput;
            } else if ('Request' in _window$1 && fetchInput instanceof _window$1.Request) {
              url = fetchInput.url;
              if (fetchInput.method) {
                method = fetchInput.method;
              }
            } else {
              url = '' + fetchInput;
            }

            // if Sentry key appears in URL, don't capture, as it's our own request
            if (url.indexOf(self._globalKey) !== -1) {
              return origFetch.apply(this, args);
            }

            if (args[1] && args[1].method) {
              method = args[1].method;
            }

            var fetchData = {
              method: method,
              url: url,
              status_code: null
            };

            return origFetch
              .apply(this, args)
              .then(function(response) {
                fetchData.status_code = response.status;

                self.captureBreadcrumb({
                  type: 'http',
                  category: 'fetch',
                  data: fetchData
                });

                return response;
              })
              ['catch'](function(err) {
                // if there is an error performing the request
                self.captureBreadcrumb({
                  type: 'http',
                  category: 'fetch',
                  data: fetchData,
                  level: 'error'
                });

                throw err;
              });
          };
        },
        wrappedBuiltIns
      );
    }

    // Capture breadcrumbs from any click that is unhandled / bubbled up all the way
    // to the document. Do this before we instrument addEventListener.
    if (autoBreadcrumbs.dom && this._hasDocument) {
      if (_document.addEventListener) {
        _document.addEventListener('click', self._breadcrumbEventHandler('click'), false);
        _document.addEventListener('keypress', self._keypressEventHandler(), false);
      } else if (_document.attachEvent) {
        // IE8 Compatibility
        _document.attachEvent('onclick', self._breadcrumbEventHandler('click'));
        _document.attachEvent('onkeypress', self._keypressEventHandler());
      }
    }

    // record navigation (URL) changes
    // NOTE: in Chrome App environment, touching history.pushState, *even inside
    //       a try/catch block*, will cause Chrome to output an error to console.error
    // borrowed from: https://github.com/angular/angular.js/pull/13945/files
    var chrome = _window$1.chrome;
    var isChromePackagedApp = chrome && chrome.app && chrome.app.runtime;
    var hasPushAndReplaceState =
      !isChromePackagedApp &&
      _window$1.history &&
      _window$1.history.pushState &&
      _window$1.history.replaceState;
    if (autoBreadcrumbs.location && hasPushAndReplaceState) {
      // TODO: remove onpopstate handler on uninstall()
      var oldOnPopState = _window$1.onpopstate;
      _window$1.onpopstate = function() {
        var currentHref = self._location.href;
        self._captureUrlChange(self._lastHref, currentHref);

        if (oldOnPopState) {
          return oldOnPopState.apply(this, arguments);
        }
      };

      var historyReplacementFunction = function(origHistFunction) {
        // note history.pushState.length is 0; intentionally not declaring
        // params to preserve 0 arity
        return function(/* state, title, url */) {
          var url = arguments.length > 2 ? arguments[2] : undefined;

          // url argument is optional
          if (url) {
            // coerce to string (this is what pushState does)
            self._captureUrlChange(self._lastHref, url + '');
          }

          return origHistFunction.apply(this, arguments);
        };
      };

      fill(_window$1.history, 'pushState', historyReplacementFunction, wrappedBuiltIns);
      fill(_window$1.history, 'replaceState', historyReplacementFunction, wrappedBuiltIns);
    }

    if (autoBreadcrumbs.console && 'console' in _window$1 && console.log) {
      // console
      var consoleMethodCallback = function(msg, data) {
        self.captureBreadcrumb({
          message: msg,
          level: data.level,
          category: 'console'
        });
      };

      each(['debug', 'info', 'warn', 'error', 'log'], function(_, level) {
        wrapConsoleMethod(console, level, consoleMethodCallback);
      });
    }
  },

  _restoreBuiltIns: function() {
    // restore any wrapped builtins
    var builtin;
    while (this._wrappedBuiltIns.length) {
      builtin = this._wrappedBuiltIns.shift();

      var obj = builtin[0],
        name = builtin[1],
        orig = builtin[2];

      obj[name] = orig;
    }
  },

  _restoreConsole: function() {
    // eslint-disable-next-line guard-for-in
    for (var method in this._originalConsoleMethods) {
      this._originalConsole[method] = this._originalConsoleMethods[method];
    }
  },

  _drainPlugins: function() {
    var self = this;

    // FIX ME TODO
    each(this._plugins, function(_, plugin) {
      var installer = plugin[0];
      var args = plugin[1];
      installer.apply(self, [self].concat(args));
    });
  },

  _parseDSN: function(str) {
    var m = dsnPattern.exec(str),
      dsn = {},
      i = 7;

    try {
      while (i--) dsn[dsnKeys[i]] = m[i] || '';
    } catch (e) {
      throw new RavenConfigError('Invalid DSN: ' + str);
    }

    if (dsn.pass && !this._globalOptions.allowSecretKey) {
      throw new RavenConfigError(
        'Do not specify your secret key in the DSN. See: http://bit.ly/raven-secret-key'
      );
    }

    return dsn;
  },

  _getGlobalServer: function(uri) {
    // assemble the endpoint from the uri pieces
    var globalServer = '//' + uri.host + (uri.port ? ':' + uri.port : '');

    if (uri.protocol) {
      globalServer = uri.protocol + ':' + globalServer;
    }
    return globalServer;
  },

  _handleOnErrorStackInfo: function(stackInfo, options) {
    options = options || {};
    options.mechanism = options.mechanism || {
      type: 'onerror',
      handled: false
    };

    // if we are intentionally ignoring errors via onerror, bail out
    if (!this._ignoreOnError) {
      this._handleStackInfo(stackInfo, options);
    }
  },

  _handleStackInfo: function(stackInfo, options) {
    var frames = this._prepareFrames(stackInfo, options);

    this._triggerEvent('handle', {
      stackInfo: stackInfo,
      options: options
    });

    this._processException(
      stackInfo.name,
      stackInfo.message,
      stackInfo.url,
      stackInfo.lineno,
      frames,
      options
    );
  },

  _prepareFrames: function(stackInfo, options) {
    var self = this;
    var frames = [];
    if (stackInfo.stack && stackInfo.stack.length) {
      each(stackInfo.stack, function(i, stack) {
        var frame = self._normalizeFrame(stack, stackInfo.url);
        if (frame) {
          frames.push(frame);
        }
      });

      // e.g. frames captured via captureMessage throw
      if (options && options.trimHeadFrames) {
        for (var j = 0; j < options.trimHeadFrames && j < frames.length; j++) {
          frames[j].in_app = false;
        }
      }
    }
    frames = frames.slice(0, this._globalOptions.stackTraceLimit);
    return frames;
  },

  _normalizeFrame: function(frame, stackInfoUrl) {
    // normalize the frames data
    var normalized = {
      filename: frame.url,
      lineno: frame.line,
      colno: frame.column,
      function: frame.func || '?'
    };

    // Case when we don't have any information about the error
    // E.g. throwing a string or raw object, instead of an `Error` in Firefox
    // Generating synthetic error doesn't add any value here
    //
    // We should probably somehow let a user know that they should fix their code
    if (!frame.url) {
      normalized.filename = stackInfoUrl; // fallback to whole stacks url from onerror handler
    }

    normalized.in_app = !// determine if an exception came from outside of our app
    // first we check the global includePaths list.
    (
      (!!this._globalOptions.includePaths.test &&
        !this._globalOptions.includePaths.test(normalized.filename)) ||
      // Now we check for fun, if the function name is Raven or TraceKit
      /(Raven|TraceKit)\./.test(normalized['function']) ||
      // finally, we do a last ditch effort and check for raven.min.js
      /raven\.(min\.)?js$/.test(normalized.filename)
    );

    return normalized;
  },

  _processException: function(type, message, fileurl, lineno, frames, options) {
    var prefixedMessage = (type ? type + ': ' : '') + (message || '');
    if (
      !!this._globalOptions.ignoreErrors.test &&
      (this._globalOptions.ignoreErrors.test(message) ||
        this._globalOptions.ignoreErrors.test(prefixedMessage))
    ) {
      return;
    }

    var stacktrace;

    if (frames && frames.length) {
      fileurl = frames[0].filename || fileurl;
      // Sentry expects frames oldest to newest
      // and JS sends them as newest to oldest
      frames.reverse();
      stacktrace = {frames: frames};
    } else if (fileurl) {
      stacktrace = {
        frames: [
          {
            filename: fileurl,
            lineno: lineno,
            in_app: true
          }
        ]
      };
    }

    if (
      !!this._globalOptions.ignoreUrls.test &&
      this._globalOptions.ignoreUrls.test(fileurl)
    ) {
      return;
    }

    if (
      !!this._globalOptions.whitelistUrls.test &&
      !this._globalOptions.whitelistUrls.test(fileurl)
    ) {
      return;
    }

    var data = objectMerge(
      {
        // sentry.interfaces.Exception
        exception: {
          values: [
            {
              type: type,
              value: message,
              stacktrace: stacktrace
            }
          ]
        },
        transaction: fileurl
      },
      options
    );

    var ex = data.exception.values[0];
    if (ex.type == null && ex.value === '') {
      ex.value = 'Unrecoverable error caught';
    }

    // Move mechanism from options to exception interface
    // We do this, as requiring user to pass `{exception:{mechanism:{ ... }}}` would be
    // too much
    if (!data.exception.mechanism && data.mechanism) {
      data.exception.mechanism = data.mechanism;
      delete data.mechanism;
    }

    data.exception.mechanism = objectMerge(
      {
        type: 'generic',
        handled: true
      },
      data.exception.mechanism || {}
    );

    // Fire away!
    this._send(data);
  },

  _trimPacket: function(data) {
    // For now, we only want to truncate the two different messages
    // but this could/should be expanded to just trim everything
    var max = this._globalOptions.maxMessageLength;
    if (data.message) {
      data.message = truncate(data.message, max);
    }
    if (data.exception) {
      var exception = data.exception.values[0];
      exception.value = truncate(exception.value, max);
    }

    var request = data.request;
    if (request) {
      if (request.url) {
        request.url = truncate(request.url, this._globalOptions.maxUrlLength);
      }
      if (request.Referer) {
        request.Referer = truncate(request.Referer, this._globalOptions.maxUrlLength);
      }
    }

    if (data.breadcrumbs && data.breadcrumbs.values)
      this._trimBreadcrumbs(data.breadcrumbs);

    return data;
  },

  /**
   * Truncate breadcrumb values (right now just URLs)
   */
  _trimBreadcrumbs: function(breadcrumbs) {
    // known breadcrumb properties with urls
    // TODO: also consider arbitrary prop values that start with (https?)?://
    var urlProps = ['to', 'from', 'url'],
      urlProp,
      crumb,
      data;

    for (var i = 0; i < breadcrumbs.values.length; ++i) {
      crumb = breadcrumbs.values[i];
      if (
        !crumb.hasOwnProperty('data') ||
        !isObject(crumb.data) ||
        objectFrozen(crumb.data)
      )
        continue;

      data = objectMerge({}, crumb.data);
      for (var j = 0; j < urlProps.length; ++j) {
        urlProp = urlProps[j];
        if (data.hasOwnProperty(urlProp) && data[urlProp]) {
          data[urlProp] = truncate(data[urlProp], this._globalOptions.maxUrlLength);
        }
      }
      breadcrumbs.values[i].data = data;
    }
  },

  _getHttpData: function() {
    if (!this._hasNavigator && !this._hasDocument) return;
    var httpData = {};

    if (this._hasNavigator && _navigator.userAgent) {
      httpData.headers = {
        'User-Agent': _navigator.userAgent
      };
    }

    // Check in `window` instead of `document`, as we may be in ServiceWorker environment
    if (_window$1.location && _window$1.location.href) {
      httpData.url = _window$1.location.href;
    }

    if (this._hasDocument && _document.referrer) {
      if (!httpData.headers) httpData.headers = {};
      httpData.headers.Referer = _document.referrer;
    }

    return httpData;
  },

  _resetBackoff: function() {
    this._backoffDuration = 0;
    this._backoffStart = null;
  },

  _shouldBackoff: function() {
    return this._backoffDuration && now() - this._backoffStart < this._backoffDuration;
  },

  /**
   * Returns true if the in-process data payload matches the signature
   * of the previously-sent data
   *
   * NOTE: This has to be done at this level because TraceKit can generate
   *       data from window.onerror WITHOUT an exception object (IE8, IE9,
   *       other old browsers). This can take the form of an "exception"
   *       data object with a single frame (derived from the onerror args).
   */
  _isRepeatData: function(current) {
    var last = this._lastData;

    if (
      !last ||
      current.message !== last.message || // defined for captureMessage
      current.transaction !== last.transaction // defined for captureException/onerror
    )
      return false;

    // Stacktrace interface (i.e. from captureMessage)
    if (current.stacktrace || last.stacktrace) {
      return isSameStacktrace(current.stacktrace, last.stacktrace);
    } else if (current.exception || last.exception) {
      // Exception interface (i.e. from captureException/onerror)
      return isSameException(current.exception, last.exception);
    } else if (current.fingerprint || last.fingerprint) {
      return Boolean(current.fingerprint && last.fingerprint) &&
        JSON.stringify(current.fingerprint) === JSON.stringify(last.fingerprint)
    }

    return true;
  },

  _setBackoffState: function(request) {
    // If we are already in a backoff state, don't change anything
    if (this._shouldBackoff()) {
      return;
    }

    var status = request.status;

    // 400 - project_id doesn't exist or some other fatal
    // 401 - invalid/revoked dsn
    // 429 - too many requests
    if (!(status === 400 || status === 401 || status === 429)) return;

    var retry;
    try {
      // If Retry-After is not in Access-Control-Expose-Headers, most
      // browsers will throw an exception trying to access it
      if (supportsFetch()) {
        retry = request.headers.get('Retry-After');
      } else {
        retry = request.getResponseHeader('Retry-After');
      }

      // Retry-After is returned in seconds
      retry = parseInt(retry, 10) * 1000;
    } catch (e) {
      /* eslint no-empty:0 */
    }

    this._backoffDuration = retry
      ? // If Sentry server returned a Retry-After value, use it
        retry
      : // Otherwise, double the last backoff duration (starts at 1 sec)
        this._backoffDuration * 2 || 1000;

    this._backoffStart = now();
  },

  _send: function(data) {
    var globalOptions = this._globalOptions;

    var baseData = {
        project: this._globalProject,
        logger: globalOptions.logger,
        platform: 'javascript'
      },
      httpData = this._getHttpData();

    if (httpData) {
      baseData.request = httpData;
    }

    // HACK: delete `trimHeadFrames` to prevent from appearing in outbound payload
    if (data.trimHeadFrames) delete data.trimHeadFrames;

    data = objectMerge(baseData, data);

    // Merge in the tags and extra separately since objectMerge doesn't handle a deep merge
    data.tags = objectMerge(objectMerge({}, this._globalContext.tags), data.tags);
    data.extra = objectMerge(objectMerge({}, this._globalContext.extra), data.extra);

    // Send along our own collected metadata with extra
    data.extra['session:duration'] = now() - this._startTime;

    if (this._breadcrumbs && this._breadcrumbs.length > 0) {
      // intentionally make shallow copy so that additions
      // to breadcrumbs aren't accidentally sent in this request
      data.breadcrumbs = {
        values: [].slice.call(this._breadcrumbs, 0)
      };
    }

    if (this._globalContext.user) {
      // sentry.interfaces.User
      data.user = this._globalContext.user;
    }

    // Include the environment if it's defined in globalOptions
    if (globalOptions.environment) data.environment = globalOptions.environment;

    // Include the release if it's defined in globalOptions
    if (globalOptions.release) data.release = globalOptions.release;

    // Include server_name if it's defined in globalOptions
    if (globalOptions.serverName) data.server_name = globalOptions.serverName;

    data = this._sanitizeData(data);

    // Cleanup empty properties before sending them to the server
    Object.keys(data).forEach(function(key) {
      if (data[key] == null || data[key] === '' || isEmptyObject(data[key])) {
        delete data[key];
      }
    });

    if (isFunction(globalOptions.dataCallback)) {
      data = globalOptions.dataCallback(data) || data;
    }

    // Why??????????
    if (!data || isEmptyObject(data)) {
      return;
    }

    // Check if the request should be filtered or not
    if (
      isFunction(globalOptions.shouldSendCallback) &&
      !globalOptions.shouldSendCallback(data)
    ) {
      return;
    }

    // Backoff state: Sentry server previously responded w/ an error (e.g. 429 - too many requests),
    // so drop requests until "cool-off" period has elapsed.
    if (this._shouldBackoff()) {
      this._logDebug('warn', 'Raven dropped error due to backoff: ', data);
      return;
    }

    if (typeof globalOptions.sampleRate === 'number') {
      if (Math.random() < globalOptions.sampleRate) {
        this._sendProcessedPayload(data);
      }
    } else {
      this._sendProcessedPayload(data);
    }
  },

  _sanitizeData: function(data) {
    return sanitize(data, this._globalOptions.sanitizeKeys);
  },

  _getUuid: function() {
    return uuid4();
  },

  _sendProcessedPayload: function(data, callback) {
    var self = this;
    var globalOptions = this._globalOptions;

    if (!this.isSetup()) return;

    // Try and clean up the packet before sending by truncating long values
    data = this._trimPacket(data);

    // ideally duplicate error testing should occur *before* dataCallback/shouldSendCallback,
    // but this would require copying an un-truncated copy of the data packet, which can be
    // arbitrarily deep (extra_data) -- could be worthwhile? will revisit
    if (!this._globalOptions.allowDuplicates && this._isRepeatData(data)) {
      this._logDebug('warn', 'Raven dropped repeat event: ', data);
      return;
    }

    // Send along an event_id if not explicitly passed.
    // This event_id can be used to reference the error within Sentry itself.
    // Set lastEventId after we know the error should actually be sent
    this._lastEventId = data.event_id || (data.event_id = this._getUuid());

    // Store outbound payload after trim
    this._lastData = data;

    this._logDebug('debug', 'Raven about to send:', data);

    var auth = {
      sentry_version: '7',
      sentry_client: 'raven-js/' + this.VERSION,
      sentry_key: this._globalKey
    };

    if (this._globalSecret) {
      auth.sentry_secret = this._globalSecret;
    }

    var exception = data.exception && data.exception.values[0];

    // only capture 'sentry' breadcrumb is autoBreadcrumbs is truthy
    if (
      this._globalOptions.autoBreadcrumbs &&
      this._globalOptions.autoBreadcrumbs.sentry
    ) {
      this.captureBreadcrumb({
        category: 'sentry',
        message: exception
          ? (exception.type ? exception.type + ': ' : '') + exception.value
          : data.message,
        event_id: data.event_id,
        level: data.level || 'error' // presume error unless specified
      });
    }

    var url = this._globalEndpoint;
    (globalOptions.transport || this._makeRequest).call(this, {
      url: url,
      auth: auth,
      data: data,
      options: globalOptions,
      onSuccess: function success() {
        self._resetBackoff();

        self._triggerEvent('success', {
          data: data,
          src: url
        });
        callback && callback();
      },
      onError: function failure(error) {
        self._logDebug('error', 'Raven transport failed to send: ', error);

        if (error.request) {
          self._setBackoffState(error.request);
        }

        self._triggerEvent('failure', {
          data: data,
          src: url
        });
        error = error || new Error('Raven send failed (no additional details provided)');
        callback && callback(error);
      }
    });
  },

  _makeRequest: function(opts) {
    // Auth is intentionally sent as part of query string (NOT as custom HTTP header) to avoid preflight CORS requests
    var url = opts.url + '?' + urlencode(opts.auth);

    var evaluatedHeaders = null;
    var evaluatedFetchParameters = {};

    if (opts.options.headers) {
      evaluatedHeaders = this._evaluateHash(opts.options.headers);
    }

    if (opts.options.fetchParameters) {
      evaluatedFetchParameters = this._evaluateHash(opts.options.fetchParameters);
    }

    if (supportsFetch()) {
      evaluatedFetchParameters.body = stringify(opts.data);

      var defaultFetchOptions = objectMerge({}, this._fetchDefaults);
      var fetchOptions = objectMerge(defaultFetchOptions, evaluatedFetchParameters);

      if (evaluatedHeaders) {
        fetchOptions.headers = evaluatedHeaders;
      }

      return _window$1
        .fetch(url, fetchOptions)
        .then(function(response) {
          if (response.ok) {
            opts.onSuccess && opts.onSuccess();
          } else {
            var error = new Error('Sentry error code: ' + response.status);
            // It's called request only to keep compatibility with XHR interface
            // and not add more redundant checks in setBackoffState method
            error.request = response;
            opts.onError && opts.onError(error);
          }
        })
        ['catch'](function() {
          opts.onError &&
            opts.onError(new Error('Sentry error code: network unavailable'));
        });
    }

    var request = _window$1.XMLHttpRequest && new _window$1.XMLHttpRequest();
    if (!request) return;

    // if browser doesn't support CORS (e.g. IE7), we are out of luck
    var hasCORS = 'withCredentials' in request || typeof XDomainRequest !== 'undefined';

    if (!hasCORS) return;

    if ('withCredentials' in request) {
      request.onreadystatechange = function() {
        if (request.readyState !== 4) {
          return;
        } else if (request.status === 200) {
          opts.onSuccess && opts.onSuccess();
        } else if (opts.onError) {
          var err = new Error('Sentry error code: ' + request.status);
          err.request = request;
          opts.onError(err);
        }
      };
    } else {
      request = new XDomainRequest();
      // xdomainrequest cannot go http -> https (or vice versa),
      // so always use protocol relative
      url = url.replace(/^https?:/, '');

      // onreadystatechange not supported by XDomainRequest
      if (opts.onSuccess) {
        request.onload = opts.onSuccess;
      }
      if (opts.onError) {
        request.onerror = function() {
          var err = new Error('Sentry error code: XDomainRequest');
          err.request = request;
          opts.onError(err);
        };
      }
    }

    request.open('POST', url);

    if (evaluatedHeaders) {
      each(evaluatedHeaders, function(key, value) {
        request.setRequestHeader(key, value);
      });
    }

    request.send(stringify(opts.data));
  },

  _evaluateHash: function(hash) {
    var evaluated = {};

    for (var key in hash) {
      if (hash.hasOwnProperty(key)) {
        var value = hash[key];
        evaluated[key] = typeof value === 'function' ? value() : value;
      }
    }

    return evaluated;
  },

  _logDebug: function(level) {
    // We allow `Raven.debug` and `Raven.config(DSN, { debug: true })` to not make backward incompatible API change
    if (
      this._originalConsoleMethods[level] &&
      (this.debug || this._globalOptions.debug)
    ) {
      // In IE<10 console methods do not have their own 'apply' method
      Function.prototype.apply.call(
        this._originalConsoleMethods[level],
        this._originalConsole,
        [].slice.call(arguments, 1)
      );
    }
  },

  _mergeContext: function(key, context) {
    if (isUndefined(context)) {
      delete this._globalContext[key];
    } else {
      this._globalContext[key] = objectMerge(this._globalContext[key] || {}, context);
    }
  }
};

// Deprecations
Raven$1.prototype.setUser = Raven$1.prototype.setUserContext;
Raven$1.prototype.setReleaseContext = Raven$1.prototype.setRelease;

var raven = Raven$1;

/**
 * Enforces a single instance of the Raven client, and the
 * main entry point for Raven. If you are a consumer of the
 * Raven library, you SHOULD load this file (vs raven.js).
 **/

var RavenConstructor = raven;

// This is to be defensive in environments where window does not exist (see https://github.com/getsentry/raven-js/pull/785)
var _window =
  typeof window !== 'undefined'
    ? window
    : typeof commonjsGlobal !== 'undefined' ? commonjsGlobal : typeof self !== 'undefined' ? self : {};
var _Raven = _window.Raven;

var Raven = new RavenConstructor();

/*
 * Allow multiple versions of Raven to be installed.
 * Strip Raven from the global context and returns the instance.
 *
 * @return {Raven}
 */
Raven.noConflict = function() {
  _window.Raven = _Raven;
  return Raven;
};

Raven.afterLoad();

singleton.exports = Raven;

/**
 * DISCLAIMER:
 *
 * Expose `Client` constructor for cases where user want to track multiple "sub-applications" in one larger app.
 * It's not meant to be used by a wide audience, so pleaaase make sure that you know what you're doing before using it.
 * Accidentally calling `install` multiple times, may result in an unexpected behavior that's very hard to debug.
 *
 * It's called `Client' to be in-line with Raven Node implementation.
 *
 * HOWTO:
 *
 * import Raven from 'raven-js';
 *
 * const someAppReporter = new Raven.Client();
 * const someOtherAppReporter = new Raven.Client();
 *
 * someAppReporter.config('__DSN__', {
 *   ...config goes here
 * });
 *
 * someOtherAppReporter.config('__OTHER_DSN__', {
 *   ...config goes here
 * });
 *
 * someAppReporter.captureMessage(...);
 * someAppReporter.captureException(...);
 * someAppReporter.captureBreadcrumb(...);
 *
 * someOtherAppReporter.captureMessage(...);
 * someOtherAppReporter.captureException(...);
 * someOtherAppReporter.captureBreadcrumb(...);
 *
 * It should "just work".
 */
singleton.exports.Client = RavenConstructor;

/**
 * This module configures Raven for reporting crashes
 * to Sentry.
 *
 * Logging requires the Sentry DSN and Hypothesis
 * version to be provided via the app's settings object.
 */
function init(config) {
  singleton.exports.config(config.dsn, {
    release: config.release
  }).install();

  if (config.userid) {
    singleton.exports.setUserContext({
      id: config.userid
    });
  }

  installUnhandledPromiseErrorHandler();
}
/**
 * Report an error to Sentry.
 *
 * @param {Error} error - An error object describing what went wrong
 * @param {string} when - A string describing the context in which
 *                        the error occurred.
 * @param {Object} [context] - A JSON-serializable object containing additional
 *                             information which may be useful when
 *                             investigating the error.
 */

function report(error, when, context) {
  if (!(error instanceof Error)) {
    // If the passed object is not an Error, raven-js
    // will serialize it using toString() which produces unhelpful results
    // for objects that do not provide their own toString() implementations.
    //
    // If the error is a plain object or non-Error subclass with a message
    // property, such as errors returned by chrome.extension.lastError,
    // use that instead.
    if (typeof error === 'object' && error.message) {
      error = error.message;
    }
  }

  var extra = Object.assign({
    when: when
  }, context);
  singleton.exports.captureException(error, {
    extra: extra
  });
}
/**
 * Installs a handler to catch unhandled rejected promises.
 *
 * For this to work, the browser or the Promise polyfill must support
 * the unhandled promise rejection event (Chrome >= 49). On other browsers,
 * the rejections will simply go unnoticed. Therefore, app code _should_
 * always provide a .catch() handler on the top-most promise chain.
 *
 * See https://github.com/getsentry/raven-js/issues/424
 * and https://www.chromestatus.com/feature/4805872211460096
 *
 * It is possible that future versions of Raven JS may handle these events
 * automatically, in which case this code can simply be removed.
 */

function installUnhandledPromiseErrorHandler() {
  window.addEventListener('unhandledrejection', event => {
    if (event.reason) {
      report(event.reason, 'Unhandled Promise rejection');
    }
  });
}

/**
 * Return application configuration information from the host page.
 *
 * Exposes shared application settings, read from script tags with the
 * class `settingsClass` which contain JSON content.
 *
 * If there are multiple such tags, the configuration from each is merged.
 *
 * @param {Document|Element} document - The root element to search for
 *                                      <script> settings tags.
 * @param {string} settingsClass - The class name to match on <script> tags.
 */
function settings(document, settingsClass) {
  if (!settingsClass) {
    settingsClass = 'js-hypothesis-settings';
  }

  var settingsElements = document.querySelectorAll('script.' + settingsClass);
  var config = {};

  for (var i = 0; i < settingsElements.length; i++) {
    Object.assign(config, JSON.parse(settingsElements[i].textContent));
  }

  return config;
}

/**
 * Mark an element as having been upgraded.
 */
function markReady(element) {
  var HIDE_CLASS = 'is-hidden-when-loading';
  var hideOnLoad = Array.from(element.querySelectorAll('.' + HIDE_CLASS));
  hideOnLoad.forEach(el => {
    el.classList.remove(HIDE_CLASS);
  });
  element.classList.remove(HIDE_CLASS);
} // List of all elements which have had upgrades applied


var upgradedElements = [];
/**
 * Remove all of the controllers for elements under `root`.
 *
 * This clears the `controllers` list for all elements under `root` and notifies
 * the controllers that their root element is about to be removed from the
 * document.
 */

function removeControllers(root) {
  upgradedElements = upgradedElements.filter(el => {
    if (root.contains(el)) {
      el.controllers.forEach(ctrl => ctrl.beforeRemove());
      el.controllers = [];
      return false;
    } else {
      return true;
    }
  });
}
/**
 * Upgrade elements on the page with additional functionality
 *
 * Controllers attached to upgraded elements are accessible via the `controllers`
 * property on the element.
 *
 * @param {Element} root - The root element to search for matching elements
 * @param {Object} controllers - Object mapping selectors to controller classes.
 *        For each element matching a given selector, an instance of the
 *        controller class will be constructed and passed the element in
 *        order to upgrade it.
 */


function upgradeElements(root, controllers) {
  // A helper which replaces the content (including the root element) of
  // an upgraded element with new markup and re-applies element upgrades to
  // the new root element
  function reload(element, html) {
    removeControllers(element);

    if (typeof html !== 'string') {
      throw new Error('Replacement markup must be a string');
    }

    var container = document.createElement('div');
    container.innerHTML = html;
    upgradeElements(container, controllers);
    var newElement = container.children[0];
    element.parentElement.replaceChild(newElement, element);
    return newElement;
  }

  Object.keys(controllers).forEach(selector => {
    var elements = Array.from(root.querySelectorAll(selector));
    elements.forEach(el => {
      var ControllerClass = controllers[selector];

      try {
        new ControllerClass(el, {
          reload: reload.bind(null, el)
        });
        upgradedElements.push(el);
        markReady(el);
      } catch (err) {
        console.error('Failed to upgrade element %s with controller', el, ControllerClass, ':', err.toString()); // Re-raise error so that Raven can capture and report it

        throw err;
      }
    });
  });
}

// Unicode combining characters
// from http://xregexp.com/addons/unicode/unicode-categories.js line:30
var COMBINING_MARKS = // eslint-disable-next-line no-misleading-character-class
/[\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08E4-\u08FE\u0900-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B62\u0B63\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0C01-\u0C03\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C82\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D02\u0D03\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D82\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F\u109A-\u109D\u135D-\u135F\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u180B-\u180D\u18A9\u1920-\u192B\u1930-\u193B\u19B0-\u19C0\u19C8\u19C9\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F\u1B00-\u1B04\u1B34-\u1B44\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BE6-\u1BF3\u1C24-\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF2-\u1CF4\u1DC0-\u1DE6\u1DFC-\u1DFF\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA880\uA881\uA8B4-\uA8C4\uA8E0-\uA8F1\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA7B\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE26]/g;
/**
 * Convert a `camelCase` or `CapitalCase` string to `kebab-case`
 */

function hyphenate$1(name) {
  var uppercasePattern = /([A-Z])/g;
  return name.replace(uppercasePattern, '-$1').toLowerCase();
}
/**
 * Normalize a string to NFKD form.
 *
 * In combination with `fold()` this can be used to create a representation of
 * a string which is useful for comparisons that should ignore differences in
 * accents/combining marks. See
 * http://www.unicode.org/reports/tr15/#Compatibility_Composite_Figure
 *
 * @example
 *
 * // returns true
 * fold(normalize('Éire')) === 'Eire'
 *
 * @param {String} str
 * @return {String}
 */

function normalize(str) {
  if (!String.prototype.normalize) {
    return str;
  }

  return str.normalize('NFKD');
}
/**
 * Remove the combining marks from characters in Unicode strings
 *
 * This assumes that `str` has first been decomposed using `normalize()`.
 *
 * @param {String} str
 * @return {String}
 */

function fold(str) {
  return str.replace(COMBINING_MARKS, '');
}

var hyphenate = hyphenate$1;
/**
 * Utility functions for DOM manipulation.
 */

/**
 * Set the state classes (`is-$state`) on an element.
 *
 * @param {Element} el
 * @param {Object} state - A map of state keys to boolean. For each key `k`,
 *                 the class `is-$k` will be added to the element if the value
 *                 is true or removed otherwise.
 */

function setElementState(el, state) {
  Object.keys(state).forEach(key => {
    var stateClass = 'is-' + hyphenate(key);

    if (state[key]) {
      el.classList.add(stateClass);
    } else {
      el.classList.remove(stateClass);
    }
  });
}
/**
 * Search the DOM tree starting at `el` and return a map of "data-ref" attribute
 * values to elements.
 *
 * This provides a way to label parts of a control in markup and get a
 * reference to them subsequently in code.
 */

function findRefs(el) {
  var map = {};
  var descendantsWithRef = el.querySelectorAll('[data-ref]');

  var _loop = function _loop(i) {
    // Use `Element#getAttribute` rather than `Element#dataset` to support IE 10
    // and avoid https://bugs.webkit.org/show_bug.cgi?id=161454
    var refEl = descendantsWithRef[i];
    var refs = (refEl.getAttribute('data-ref') || '').split(' ');
    refs.forEach(ref => {
      map[ref] = refEl;
    });
  };

  for (var i = 0; i < descendantsWithRef.length; i++) {
    _loop(i);
  }

  return map;
}
/**
 * Return the first child of `node` which is an `Element`.
 *
 * Work around certain browsers (IE, Edge) not supporting firstElementChild on
 * Document, DocumentFragment.
 *
 * @param {Node} node
 */

function firstElementChild(node) {
  for (var i = 0; i < node.childNodes.length; i++) {
    if (node.childNodes[i].nodeType === Node.ELEMENT_NODE) {
      return node.childNodes[i];
    }
  }

  return null;
}
/**
 * Clone the content of a <template> element and return the first child Element.
 *
 * @param {HTMLTemplateElement} templateEl
 */


function cloneTemplate(templateEl) {
  if (templateEl.content) {
    // <template> supported natively.
    var content = templateEl.content.cloneNode(true);
    return firstElementChild(content);
  } else {
    // <template> not supported. Browser just treats it as an unknown Element.
    return templateEl.firstElementChild.cloneNode(true);
  }
}

/*
 * @typedef {Object} ControllerOptions
 * @property {Function} [reload] - A function that replaces the content of
 *           the current element with new markup (eg. returned by an XHR request
 *           to the server) and returns the new root Element.
 */

/**
 * Base class for controllers that upgrade elements with additional
 * functionality.
 *
 * - Child elements with `data-ref="$name"` attributes are exposed on the
 *   controller as `this.refs.$name`.
 * - The element passed to the controller is exposed via the `element` property
 * - The controllers attached to an element are accessible via the
 *   `element.controllers` array
 *
 * The controller maintains internal state in `this.state`, which can only be
 * updated by calling (`this.setState(changes)`). Whenever the internal state of
 * the controller changes, `this.update()` is called to sync the DOM with this
 * state.
 */

class Controller {
  /**
   * Initialize the controller.
   *
   * @param {Element} element - The DOM Element to upgrade
   * @param {ControllerOptions} [options] - Configuration options for the
   *        controller. Subclasses extend this interface to provide config
   *        specific to that type of controller.
   */
  constructor(element) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (!element) {
      throw new Error('Controllers require an element passed to the constructor');
    } else if (!element.controllers) {
      element.controllers = [this];
    } else {
      element.controllers.push(this);
    }

    this.state = {};
    this.element = element;
    this.options = options;
    this.refs = findRefs(element);
  }
  /**
   * Set the state of the controller.
   *
   * This will merge `changes` into the current state and call the `update()`
   * method provided by the subclass to update the DOM to match the current state.
   */


  setState(changes) {
    var prevState = this.state;
    this.state = Object.freeze(Object.assign({}, this.state, changes));
    this.update(this.state, prevState);
  }
  /**
   * Calls update() with the current state.
   *
   * This is useful for controllers where the state is available in the DOM
   * itself, so doesn't need to be maintained internally.
   */


  forceUpdate() {
    this.update(this.state, this.state);
  }
  /**
   * Listen for events dispatched to the root element passed to the controller.
   *
   * This a convenience wrapper around `this.element.addEventListener`.
   */


  on(event, listener, useCapture) {
    this.element.addEventListener(event, listener, useCapture);
  }
  /**
   * Handler which is invoked when the controller's element is about to be
   * removed.
   *
   * This can be used to clean up subscriptions, timeouts etc.
   */


  beforeRemove() {}

}

class CharacterLimitController extends Controller {
  constructor(element) {
    super(element);
    this.refs.characterLimitInput.addEventListener('input', () => {
      this.forceUpdate();
    });
    this.forceUpdate();
  }

  update() {
    var input = this.refs.characterLimitInput;
    var maxlength = parseInt(input.dataset.maxlength);
    var counter = this.refs.characterLimitCounter;
    counter.textContent = input.value.length + '/' + maxlength;
    setElementState(counter, {
      tooLong: input.value.length > maxlength
    });
    setElementState(this.refs.characterLimitCounter, {
      ready: true
    });
  }

}

function isProbablyMobileSafari(userAgent) {
  return /\bMobile\b/.test(userAgent) && /\bSafari\b/.test(userAgent);
}

class CopyButtonController extends Controller {
  constructor(element) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    super(element, options);
    var userAgent = options.userAgent || navigator.userAgent; // Make the input field read-only to avoid the user accidentally modifying
    // the link before copying it.
    //
    // An exception is made for Mobile Safari because selecting the contents of
    // a read-only input field is hard in that browser.

    this.refs.input.readOnly = !isProbablyMobileSafari(userAgent);

    this.refs.button.onclick = () => {
      // Method for selecting <input> text taken from 'select' package.
      // See https://github.com/zenorocha/select/issues/1 and
      // http://stackoverflow.com/questions/3272089
      this.refs.input.focus();
      this.refs.input.setSelectionRange(0, this.refs.input.value.length);
      var notificationText = document.execCommand('copy') ? 'Link copied to clipboard!' : 'Copying link failed';
      var NOTIFICATION_TEXT_TIMEOUT = 1000;
      var originalValue = this.refs.input.value;
      this.refs.input.value = notificationText;
      window.setTimeout(() => {
        this.refs.input.value = originalValue; // Copying can leave the <input> focused but its value text not
        // selected, and since it's already focused clicking on it to focus
        // it doesn't trigger the auto select all on focus. So we unfocus it.

        this.refs.input.blur();
      }, NOTIFICATION_TEXT_TIMEOUT);
    };
  }

}

/* Turn a normal submit element into one that shows a confirm dialog.
 *
 * The element's form will only be submitted if the user answers the
 * confirmation dialog positively.
 *
 */

class ConfirmSubmitController extends Controller {
  constructor(element, options) {
    super(element);
    var window_ = options.window || window;
    element.addEventListener('click', event => {
      if (!window_.confirm(element.dataset.confirmMessage)) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        return;
      }
    },
    /*capture*/
    true);
  }

}

/**
 * For this form, disable all submit elements (inputs or buttons) after
 * the form has been submitted—helps prevent duplicate submission of form data.
 * Note that this will only work on buttons or inputs with `type="submit"`
 */

class DisableOnSubmitController extends Controller {
  constructor(element) {
    super(element);
    var submitEls = element.querySelectorAll('[type="submit"]');
    element.addEventListener('submit', () => {
      for (var i = 0; i < submitEls.length; i++) {
        submitEls[i].disabled = true;
      }
    });
  }

}

/**
 * Controller for dropdown menus.
 */

class DropdownMenuController extends Controller {
  constructor(element) {
    super(element);
    var toggleEl = this.refs.dropdownMenuToggle;

    var handleClickOutside = event => {
      if (!this.refs.dropdownMenuContent.contains(event.target)) {
        // When clicking outside the menu on the toggle element, stop the event
        // so that it does not re-trigger the menu
        if (toggleEl.contains(event.target)) {
          event.stopPropagation();
          event.preventDefault();
        }

        this.setState({
          open: false
        });
        element.ownerDocument.removeEventListener('click', handleClickOutside, true
        /* capture */
        );
      }
    };

    toggleEl.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      this.setState({
        open: true
      });
      element.ownerDocument.addEventListener('click', handleClickOutside, true
      /* capture */
      );
    });
  }

  update(state) {
    setElementState(this.refs.dropdownMenuContent, {
      open: state.open
    });
    this.refs.dropdownMenuToggle.setAttribute('aria-expanded', state.open.toString());
  }

}

// Focus release function returned by most recent call to trap()
var currentReleaseFn;
/**
 * Trap focus within a group of elements.
 *
 * Watch focus changes in a document and react to and/or prevent focus moving
 * outside a specified group of elements.
 *
 * @param {Element[]} elements - Array of elements which make up the modal group
 * @param {(Element) => Element|null} callback - Callback which is invoked when
 *        focus tries to move outside the modal group. It is called with the
 *        new element that will be focused. If it returns null, the focus change
 *        will proceed, otherwise if it returns an element within the group,
 *        that element will be focused instead.
 * @return {Function} A function which releases the modal focus, if it has not
 *        been changed by another call to trap() in the meantime.
 */

function trap(elements, callback) {
  if (currentReleaseFn) {
    currentReleaseFn();
  } // The most obvious way of detecting an element losing focus and reacting
  // based on the new focused element is the "focusout" event and the
  // FocusEvent#relatedTarget property.
  //
  // However, FocusEvent#relatedTarget is not implemented in all browsers
  // (Firefox < 48, IE) and is null in some cases even for browsers that do
  // support it.
  //
  // Instead we watch the 'focus' event on the document itself.


  var onFocusChange = event => {
    if (elements.some(el => el.contains(event.target))) {
      // Focus remains within modal group
      return;
    } // Focus is trying to move outside of the modal group, test whether to
    // allow this


    var newTarget = callback(event.target);

    if (newTarget) {
      event.preventDefault();
      event.stopPropagation();
      newTarget.focus();
    } else if (currentReleaseFn) {
      currentReleaseFn();
    }
  };

  document.addEventListener('focus', onFocusChange, true
  /* useCapture */
  );

  var releaseFn = () => {
    if (currentReleaseFn === releaseFn) {
      currentReleaseFn = null;
      document.removeEventListener('focus', onFocusChange, true
      /* useCapture */
      );
    }
  };

  currentReleaseFn = releaseFn;
  return releaseFn;
}

/**
 * @typedef SubmitError
 * @property {number} status - HTTP status code. 400 if form submission failed
 *           due to a validation error or a different 4xx or 5xx code if it
 *           failed for other reasons.
 * @property {string} [form] - HTML markup for the form containing validation
 *           error messages if submission failed with a 400 status.
 * @property {string} [reason] - The status message if form submission failed
 *           for reasons other than a validation error.
 */

/**
 * Exception thrown if form submission fails.
 *
 * @property {SubmitError} params - Describes why submission failed. These
 *           properties are exposed on the FormSubmitError instance.
 */
class FormSubmitError extends Error {
  constructor(message, params) {
    super(message);
    Object.assign(this, params);
  }

}
/**
 * Return the URL which a form should be submitted to.
 *
 * @param {HTMLFormElement} form
 */


function formUrl(form) {
  if (form.getAttribute('action')) {
    return form.action;
  } else {
    // `form.action` returns an absolute URL created by resolving the URL
    // in the "action" attribute against the document's location.
    //
    // Browsers except IE implement a special case where the document's URL
    // is returned if the "action" attribute is missing or an empty string.
    return document.location.href;
  }
}
/**
 * @typedef {Object} SubmitResult
 * @property {number} status - Always 200
 * @property {string} form - The HTML markup for the re-rendered form
 */

/**
 * Submit a form using the Fetch API and return the markup for the re-rendered
 * version of the form.
 *
 * @param {HTMLFormElement} formEl - The `<form>` to submit
 * @return {Promise<SubmitResult>} A promise which resolves when the form
 *         submission completes or rejects with a FormSubmitError if the server
 *         rejects the submission due to a validation error or the network
 *         request fails.
 */


function submitForm(formEl) {
  var fetch = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window.fetch;
  var response;
  return fetch(formUrl(formEl), {
    body: new FormData(formEl),
    credentials: 'same-origin',
    method: 'POST',
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    }
  }).then(response_ => {
    response = response_;
    return response.text();
  }).then(body => {
    var {
      status
    } = response;

    switch (status) {
      case 200:
        return {
          status,
          form: body
        };

      case 400:
        throw new FormSubmitError('Form validation failed', {
          status,
          form: body
        });

      default:
        throw new FormSubmitError('Form submission failed', {
          status,
          reason: response.statusText
        });
    }
  });
}

function shouldAutosubmit(type) {
  var autosubmitTypes = ['checkbox', 'radio'];
  return autosubmitTypes.indexOf(type) !== -1;
}
/**
 * Return true if a form field should be hidden until the user starts editing
 * the form.
 *
 * @param {Element} el - The container for an individual form field, which may
 *        have a "data-hide-until-active" attribute.
 */


function isHiddenField(el) {
  return el.dataset.hideUntilActive;
}
/**
 * @typedef {Object} Field
 * @property {Element} container - The container element for an input field
 * @property {HTMLInputElement} input - The <input> element for an input field
 * @property {HTMLLabelElement} label - The <label> element for a field
 */

/**
 * A controller which adds inline editing functionality to forms.
 *
 * When forms have inline editing enabled, individual fields can be edited and
 * changes can be saved without a full page reload.
 *
 * Instead when the user focuses a field, Save/Cancel buttons are shown beneath
 * the field and everything else on the page is dimmed. When the user clicks 'Save'
 * the form is submitted to the server via a `fetch()` request and the HTML of
 * the form is updated with the result, which may be a successfully updated form
 * or a re-rendered version of the form with validation errors indicated.
 */


class FormController extends Controller {
  constructor(element, options) {
    super(element, options);
    setElementState(this.refs.cancelBtn, {
      hidden: false
    });
    this.refs.cancelBtn.addEventListener('click', event => {
      event.preventDefault();
      this.cancel();
    }); // List of groups of controls that constitute each form field

    this._fields = Array.from(element.querySelectorAll('.js-form-input')).map(el => {
      var parts = findRefs(el);
      return {
        container: el,
        input: parts.formInput,
        label: parts.label
      };
    });
    this.on('focus', event => {
      var field = this._fields.find(field => field.input === event.target);

      if (!field) {
        return;
      }

      this.setState({
        editingFields: this._editSet(field),
        focusedField: field
      });
    }, true
    /* capture - focus does not bubble */
    );
    this.on('change', event => {
      if (shouldAutosubmit(event.target.type)) {
        this.submit();
      }
    });
    this.on('input', event => {
      // Some but not all browsers deliver an `input` event for radio/checkbox
      // inputs. Since we auto-submit when such inputs change, don't mark the
      // field as dirty.
      if (shouldAutosubmit(event.target.type)) {
        return;
      }

      this.setState({
        dirty: true
      });
    });
    this.on('keydown', event => {
      event.stopPropagation();

      if (event.key === 'Escape') {
        this.cancel();
      }
    }); // Ignore clicks outside of the active field when editing

    this.refs.formBackdrop.addEventListener('mousedown', event => {
      event.preventDefault();
      event.stopPropagation();
    }); // Setup AJAX handling for forms

    this.on('submit', event => {
      event.preventDefault();
      this.submit();
    });
    this.setState({
      // True if the user has made changes to the field they are currently
      // editing
      dirty: false,
      // The set of fields currently being edited
      editingFields: [],
      // The field within the `editingFields` set that was last focused
      focusedField: null,
      // Markup for the original form. Used to revert the form to its original
      // state when the user cancels editing
      originalForm: this.element.outerHTML,
      // Flag that indicates a save is currently in progress
      saving: false,
      // Error that occurred while submitting the form
      submitError: ''
    });
  }

  update(state, prevState) {
    // In forms that support editing a single field at a time, show the
    // Save/Cancel buttons below the field that we are currently editing.
    //
    // In the current forms that support editing multiple fields at once,
    // we always display the Save/Cancel buttons in their default position
    if (state.editingFields.length === 1) {
      state.editingFields[0].container.parentElement.insertBefore(this.refs.formActions, state.editingFields[0].container.nextSibling);
    }

    if (state.editingFields.length > 0 && state.editingFields !== prevState.editingFields) {
      this._trapFocus();
    }

    var isEditing = state.editingFields.length > 0;
    setElementState(this.element, {
      editing: isEditing
    });
    setElementState(this.refs.formActions, {
      hidden: !isEditing || shouldAutosubmit(state.editingFields[0].input.type),
      saving: state.saving
    });
    setElementState(this.refs.formSubmitError, {
      visible: state.submitError.length > 0
    });
    this.refs.formSubmitErrorMessage.textContent = state.submitError;

    this._updateFields(state);
  }
  /**
   * Update the appearance of individual form fields to match the current state
   * of the form.
   *
   * @param {Object} state - The internal state of the form
   */


  _updateFields(state) {
    this._fields.forEach(field => {
      setElementState(field.container, {
        editing: state.editingFields.includes(field),
        focused: field === state.focusedField,
        hidden: isHiddenField(field.container) && !state.editingFields.includes(field)
      }); // Update labels

      var activeLabel = field.container.dataset.activeLabel;
      var inactiveLabel = field.container.dataset.inactiveLabel;
      var isEditing = state.editingFields.includes(field);

      if (activeLabel && inactiveLabel) {
        field.label.textContent = isEditing ? activeLabel : inactiveLabel;
      } // Update placeholder
      //
      // The UA may or may not autofill password fields.
      // Set a dummy password as a placeholder when the field is not being edited
      // so that it appears non-empty if the UA doesn't autofill it.


      if (field.input.type === 'password') {
        field.input.setAttribute('placeholder', !isEditing ? '••••••••' : '');
      }
    });
  }

  beforeRemove() {
    if (this._releaseFocus) {
      this._releaseFocus();
    }
  }
  /**
   * Perform an AJAX submission of the form and replace it with the rendered
   * result.
   */


  submit() {
    var originalForm = this.state.originalForm;
    var activeInputId;

    if (this.state.editingFields.length > 0) {
      activeInputId = this.state.editingFields[0].input.id;
    }

    this.setState({
      saving: true
    });
    return submitForm(this.element).then(response => {
      this.options.reload(response.form);
    }).catch(err => {
      if (err.form) {
        // The server processed the request but rejected the submission.
        // Display the returned form which will contain any validation error
        // messages.
        var newFormEl = this.options.reload(err.form);
        var newFormCtrl = newFormEl.controllers.find(ctrl => ctrl instanceof FormController); // Resume editing the field where validation failed

        var newInput = document.getElementById(activeInputId);

        if (newInput) {
          newInput.focus();
        }

        newFormCtrl.setState({
          // Mark the field in the replaced form as dirty since it has unsaved
          // changes
          dirty: newInput !== null,
          // If editing is canceled, revert back to the _original_ version of
          // the form, not the version with validation errors from the server.
          originalForm
        });
      } else {
        // If there was an error processing the request or the server could
        // not be reached, display a helpful error
        this.setState({
          submitError: err.reason || 'There was a problem saving changes.',
          saving: false
        });
      }
    });
  }
  /**
   * Return the set of elements that the user should be able to interact with,
   * depending upon the field which is currently focused.
   */


  _focusGroup() {
    var fieldContainers = this.state.editingFields.map(field => field.container);

    if (fieldContainers.length === 0) {
      return null;
    }

    return [this.refs.formActions].concat(fieldContainers);
  }
  /**
   * Trap focus within the set of form fields currently being edited.
   */


  _trapFocus() {
    this._releaseFocus = trap(this._focusGroup(), newFocusedElement => {
      // Keep focus in the current field when it has unsaved changes,
      // otherwise let the user focus another field in the form or move focus
      // outside the form entirely.
      if (this.state.dirty) {
        return this.state.editingFields[0].input;
      } // If the user tabs out of the form, clear the editing state


      if (!this.element.contains(newFocusedElement)) {
        this.setState({
          editingFields: []
        });
      }

      return null;
    });
  }
  /**
   * Return the set of fields that should be displayed in the editing state
   * when a given field is selected.
   *
   * @param {Field} - The field that was focused
   * @return {Field[]} - Set of fields that should be active for editing
   */


  _editSet(field) {
    // Currently we have two types of form:
    // 1. Forms which only edit one field at a time
    // 2. Forms with hidden fields (eg. the Change Email, Change Password forms)
    //    which should enable editing all fields when any is focused
    if (this._fields.some(field => isHiddenField(field.container))) {
      return this._fields;
    } else {
      return [field];
    }
  }
  /**
   * Cancel editing for the currently active field and revert any unsaved
   * changes.
   */


  cancel() {
    this.options.reload(this.state.originalForm);
  }

}

/**
 * Button for canceling a form in a single-form page.
 *
 * This is used only when the form is *not* using inline editing.
 * Forms which use inline editing have a cancel button that is shown below the
 * active field. That is managed by `FormController`.
 */

class FormCancelController extends Controller {
  constructor(element, options) {
    super(element, options);
    var window_ = options.window || window;
    element.addEventListener('click', event => {
      event.preventDefault();
      window_.close();
    });
  }

}

/**
 * Controller for individual form input fields.
 *
 * This is used for both forms with inline editing (ie. those which show "Save"
 * and "Cancel" buttons beneath individual form fields, see `FormController`)
 * and those without.
 *
 * Note that for forms using inline editing much of the logic lives in the
 * form-level controller rather than here.
 */

class FormInputController extends Controller {
  constructor(element) {
    super(element);
    var hasError = element.classList.contains('is-error');
    this.setState({
      hasError
    });
    element.addEventListener('input', () => {
      this.setState({
        hasError: false
      });
    });
  }

  update() {
    setElementState(this.element, {
      error: this.state.hasError
    });
  }

}

class FormSelectOnFocusController extends Controller {
  constructor(element) {
    super(element); // In case the `focus` event has already been fired, select the element

    if (element === document.activeElement) {
      element.select();
    }

    element.addEventListener('focus', event => {
      event.target.select();
    });
  }

}

function isWordChar(event) {
  return event.key.match(/^\w$/) && !event.ctrlKey && !event.altKey && !event.metaKey;
}
/**
 * Automatically focuses an input field when the user presses a letter, number
 * or backspace if no other element on the page has keyboard focus. The field's
 * focus can also be blurred by pressing Escape.
 *
 * This provides behavior similar to Google.com where the user can "type" in the
 * search box even if it is not focused.
 */


class InputAutofocusController extends Controller {
  constructor(element) {
    super(element);

    this._onKeyDown = event => {
      if (document.activeElement === document.body) {
        if (isWordChar(event) || event.key === 'Backspace') {
          element.focus();
        }
      } else if (document.activeElement === element && event.key === 'Escape') {
        element.blur();
      }
    };

    document.addEventListener('keydown', this._onKeyDown);
  }

  beforeRemove() {
    document.removeEventListener('keydown', this._onKeyDown);
  }

}

/**
 * Controller for list inputs.
 *
 * The default deform widget for editing sequences,
 * `deform.widget.SequenceWidget` has support for various options such as a
 * minimum and maximum number of items and drag-and-drop re-ordering, which are
 * not yet implemented here.
 */

class ListInputController extends Controller {
  constructor(element) {
    super(element); // Handle 'Add {item type}' button.

    this.refs.addItemButton.addEventListener('click', () => {
      var newItemEl = cloneTemplate(this.refs.itemTemplate);
      this.refs.itemList.appendChild(newItemEl);
    }); // Handle 'Remove' button.

    element.addEventListener('click', event => {
      var btn = event.target.closest('button');

      if (btn.getAttribute('data-ref') === 'removeItemButton') {
        var parentItem = event.target.closest('li');
        parentItem.remove();
      }
    });
  }

}

/**
 * A custom tooltip similar to the one used in Google Docs which appears
 * instantly when activated on a target element.
 *
 * The tooltip is displayed and hidden by setting its target element.
 *
 *  var tooltip = new Tooltip(document.body);
 *  tooltip.setState({target: aWidget}); // Show tooltip
 *  tooltip.setState({target: null}); // Hide tooltip
 *
 * The tooltip's label is derived from the target element's 'aria-label'
 * attribute.
 */

class TooltipController extends Controller {
  constructor(el) {
    super(el); // With mouse input, show the tooltip on hover. On touch devices we rely on
    // the browser to synthesize 'mouseover' events to make the tooltip appear
    // when the host element is tapped and disappear when the host element loses
    // focus.
    // See http://www.codediesel.com/javascript/making-mouseover-event-work-on-an-ipad/

    el.addEventListener('mouseover', () => {
      this.setState({
        target: el
      });
    });
    el.addEventListener('mouseout', () => {
      this.setState({
        target: null
      });
    });
    this._tooltipEl = el.ownerDocument.createElement('div');
    this._tooltipEl.innerHTML = '<span class="tooltip-label js-tooltip-label"></span>';
    this._tooltipEl.className = 'tooltip';
    el.appendChild(this._tooltipEl);
    this._labelEl = this._tooltipEl.querySelector('.js-tooltip-label');
    this.setState({
      target: null
    });
  }

  update(state) {
    if (!state.target) {
      this._tooltipEl.style.visibility = 'hidden';
      return;
    }

    var target = state.target;
    var label = target.getAttribute('aria-label');
    this._labelEl.textContent = label;
    Object.assign(this._tooltipEl.style, {
      visibility: '',
      bottom: 'calc(100% + 5px)'
    });
  }

}

/**
 * Controllers provide client-side logic for server-rendered HTML.
 *
 * HTML elements declare their associated controller(s) using `js-`-prefixed
 * class names.
 *
 * This file exports a mapping between CSS selectors and controller
 * classes for "common" controls that are useful on both the admin and
 * user-facing sites.
 */
var sharedControllers = {
  '.js-character-limit': CharacterLimitController,
  '.js-copy-button': CopyButtonController,
  '.js-confirm-submit': ConfirmSubmitController,
  '.js-disable-on-submit': DisableOnSubmitController,
  '.js-dropdown-menu': DropdownMenuController,
  '.js-form': FormController,
  '.js-form-cancel': FormCancelController,
  '.js-form-input': FormInputController,
  '.js-input-autofocus': InputAutofocusController,
  '.js-list-input': ListInputController,
  '.js-select-onfocus': FormSelectOnFocusController,
  '.js-tooltip': TooltipController
};

/**
 * Controller for the OAuth authorization popup.
 */

class AuthorizeFormController extends Controller {
  constructor(element) {
    super(element);
    this.on('submit', () => {
      // Prevent multiple submission or clicking the "Cancel" button after
      // clicking "Accept".
      this.setState({
        submitting: true
      });
    });
    this.refs.cancelBtn.addEventListener('click', () => {
      window.close();
    });
    window.addEventListener('beforeunload', () => {
      this._sendAuthCanceledMessage();
    });
  }
  /**
   * Notify the parent window that auth was canceled.
   *
   * This is necessary since there isn't a DOM event that a cross-origin opener
   * window can listen for to know when a popup window is closed.
   */


  _sendAuthCanceledMessage() {
    if (this.state.submitting) {
      // User already pressed "Accept" button.
      return;
    }

    if (window.opener) {
      var state;

      if (this.refs.stateInput) {
        state = this.refs.stateInput.value;
      } // Since this message contains no private data, just set the origin to
      // '*' (any).


      window.opener.postMessage({
        type: 'authorization_canceled',
        state
      }, '*');
    }
  }

  update() {
    this.refs.cancelBtn.disabled = !this.state.submitting;
    this.refs.acceptBtn.disabled = !this.state.submitting;
  }

}

function CreateGroupFormController(element) {
  // Create Group form handling
  var self = this;
  this._submitBtn = element.querySelector('.js-create-group-create-btn');
  this._groupNameInput = element.querySelector('.js-group-name-input');
  this._infoLink = element.querySelector('.js-group-info-link');
  this._infoText = element.querySelector('.js-group-info-text');

  function groupNameChanged() {
    self._submitBtn.disabled = self._groupNameInput.value.trim().length === 0;
  }

  self._groupNameInput.addEventListener('input', groupNameChanged);

  groupNameChanged();

  this._infoLink.addEventListener('click', event => {
    event.preventDefault();

    self._infoLink.classList.add('is-hidden');

    self._infoText.classList.remove('is-hidden');
  });
}

/*!
 * escape-html
 * Copyright(c) 2012-2013 TJ Holowaychuk
 * Copyright(c) 2015 Andreas Lubbe
 * Copyright(c) 2015 Tiancheng "Timothy" Gu
 * MIT Licensed
 */

/**
 * Module variables.
 * @private
 */

var matchHtmlRegExp = /["'&<>]/;

/**
 * Module exports.
 * @public
 */

var escapeHtml_1 = escapeHtml;

/**
 * Escape special characters in the given string of html.
 *
 * @param  {string} string The string to escape for inserting into HTML
 * @return {string}
 * @public
 */

function escapeHtml(string) {
  var str = '' + string;
  var match = matchHtmlRegExp.exec(str);

  if (!match) {
    return str;
  }

  var escape;
  var html = '';
  var index = 0;
  var lastIndex = 0;

  for (index = match.index; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34: // "
        escape = '&quot;';
        break;
      case 38: // &
        escape = '&amp;';
        break;
      case 39: // '
        escape = '&#39;';
        break;
      case 60: // <
        escape = '&lt;';
        break;
      case 62: // >
        escape = '&gt;';
        break;
      default:
        continue;
    }

    if (lastIndex !== index) {
      html += str.substring(lastIndex, index);
    }

    lastIndex = index + 1;
    html += escape;
  }

  return lastIndex !== index
    ? html + str.substring(lastIndex, index)
    : html;
}

/**
 * Function which determines if it is possible to lozengify a given phrase.
 *
 * @param {string} phrase A potential query term.
 *
 * @returns {boolean} True if the input phrase can be lozengified and false otherwise.
 *
 * @example
 * // returns True
 * canLozengify('foo')
 * @example
 * // returns False
 * canLozengify('foo)
 */
function canLozengify(phrase) {
  phrase = phrase.trim(); // if there is no word

  if (!phrase) {
    return false;
  } // if a phrase starts with a double quote, it has to have a closing double quote


  if (phrase.indexOf('"') === 0 && (phrase.indexOf('"', 1) > phrase.length - 1 || phrase.indexOf('"', 1) < 0)) {
    return false;
  } // if a phrase starts with a single quote, it has to have a closing double quote


  if (phrase.indexOf("'") === 0 && (phrase.indexOf("'", 1) > phrase.length - 1 || phrase.indexOf("'", 1) < 0)) {
    return false;
  } // if phrase ends with a double quote it has to start with one


  if (phrase.indexOf('"', 1) === phrase.length - 1 && phrase.indexOf('"') !== 0) {
    return false;
  } // if phrase ends with a single quote it has to start with one


  if (phrase.indexOf("'", 1) === phrase.length - 1 && phrase.indexOf("'") !== 0) {
    return false;
  }

  return true;
}
/**
 * Function which determines if a phrase can be lozengified as is or
 * if it needs to be divided into a facet name and value first.
 *
 * @param {string} phrase A potential query term.
 *
 * @returns {boolean} True if the input phrase is ready to be
 * lozengified and false otherwise.
 *
 * @example
 * // returns True
 * shouldLozengify('foo:bar')
 * @example
 * // returns False
 * shouldLozengify('foo:"bar')
 */


function shouldLozengify(phrase) {
  // if the phrase has a facet and value
  if (phrase.indexOf(':') >= 0) {
    var queryTerm = getLozengeFacetNameAndValue(phrase);

    if (!canLozengify(queryTerm.facetName)) {
      return false;
    }

    if (queryTerm.facetValue.length > 0 && !canLozengify(queryTerm.facetValue)) {
      return false;
    }
  } else if (!canLozengify(phrase)) {
    return false;
  }

  return true;
}
/**
 * Return an array of lozenge values from the given string.
 *
 * @param {string} queryString A string of query terms.
 *
 * @returns {Object} An object with two properties: lozengeValues is an array
 *   of values to be turned into lozenges, and incompleteInputValue is any
 *   remaining un-lozengifiable text from the end of the input string
 *
 * @example
 * // returns {
 *   'lozengeValues': ['foo', 'key:"foo bar"', 'gar'],
 *   'incompleteInputValue': '"unclosed',
 * }
 * getLozengeValues('foo key:"foo bar" gar "unclosed')
 */

function getLozengeValues(queryString) {
  var inputTerms = '';
  var quoted;
  var queryTerms = [];
  queryString.split(' ').forEach(term => {
    if (quoted) {
      inputTerms = inputTerms + ' ' + term;

      if (shouldLozengify(inputTerms)) {
        queryTerms.push(inputTerms);
        inputTerms = '';
        quoted = false;
      }
    } else if (shouldLozengify(term)) {
      queryTerms.push(term);
    } else {
      inputTerms = term;
      quoted = true;
    }
  });
  return {
    lozengeValues: queryTerms,
    incompleteInputValue: inputTerms
  };
}
/**
 * Return an object with the facet name and value for a given query term.
 *
 * @param {string} queryTerm The query term string.
 *
 * @returns {Object} An object with two properties:
 * facetName and facetValue.
 *
 * @example
 * // returns {
 *   facetName: foo,
 *   facetValue: bar,
 * }
 * getLozengeFacetNameAndValue('foo:bar')
 * @example
 * // returns {
 *   facetName: '',
 *   facetValue: gar,
 * }
 * getLozengeFacetNameAndValue('gar')
 */

function getLozengeFacetNameAndValue(queryTerm) {
  var i;
  var lozengeFacetNameAndValue = {
    facetName: '',
    facetValue: ''
  };

  if (queryTerm.indexOf(':') >= 0) {
    i = queryTerm.indexOf(':');
    lozengeFacetNameAndValue.facetName = queryTerm.slice(0, i).trim();
    lozengeFacetNameAndValue.facetValue = queryTerm.slice(i + 1, queryTerm.length).trim();
    return lozengeFacetNameAndValue;
  }

  lozengeFacetNameAndValue.facetValue = queryTerm;
  return lozengeFacetNameAndValue;
}

var updateHelper = {
  /**
   * compare two list arrays and decide if they have changed
   *
   * @param  {Array} listA
   * @param  {Array} listB
   * @returns {bool}       the result of comparing if the two
   *   arrays seem like they have changed. True if they have changed
   */
  listIsDifferent: function listIsDifferent(listA, listB) {
    if (!(Array.isArray(listA) && Array.isArray(listB))) {
      return true;
    }

    if (listA.length !== listB.length) {
      return true;
    }

    return !listA.every((item, index) => {
      return item === listB[index];
    });
  }
};

var ENTER = 13;
var UP = 38;
var DOWN = 40;
/**
 * Controller for adding autosuggest control to a piece of the page
 */

class AutosuggestDropdownController extends Controller {
  /*
   * @typedef {Object} ConfigOptions
   * @property {Function} renderListItem - called with every item in the list
   *   after the listFilter function is called. The return value will be the final
   *   html that is set in the list item DOM.
   * @property {Function} listFilter - called at initialization, focus of input,
   *   and input changes made by user. The function will receieve the full list
   *   and the current value of the input. This is meant to be an pure function
   *   that will return a filtered list based on the consumer's domain needs.
   * @property {Function} onSelect - called once the user has made a selection of an
   *   item in the autosuggest. It will receive the item selected as the only argument.
   * @property {Object} [classNames] - this is the enumerated list of class name
   *   overrides for consumers to customize the UI.
   *   Possible values: { container, list, item, activeItem, header }
   * @property {String} [header] - value of the header label at top of suggestions
   */

  /**
   * @param {HTMLInputElement} inputElement that we are responding to in order to provide
   *    suggestions. Note, we will add the suggestion container as a sibling to this
   *    element.
   * @param {ConfigOptions} configOptions are used to set the initial set of items and the header
   *    as well as providing the hooks for updates and callbacks
   *
   */
  constructor(inputElement, configOptions) {
    super(inputElement, configOptions);

    if (!configOptions.renderListItem) {
      throw new Error('Missing renderListItem callback in AutosuggestDropdownController constructor');
    }

    if (!configOptions.listFilter) {
      throw new Error('Missing listFilter function in AutosuggestDropdownController constructor');
    }

    if (!configOptions.onSelect) {
      throw new Error('Missing onSelect callback in AutosuggestDropdownController constructor');
    } // set up our element class attribute enum values
    // Note, we currently are not doing anything with the default
    // classes, but we have them if we wanted to give something for a default
    // styling.


    if (configOptions.classNames) {
      this.options.classNames.container = configOptions.classNames.container || 'autosuggest__container';
      this.options.classNames.list = configOptions.classNames.list || 'autosuggest__list';
      this.options.classNames.item = configOptions.classNames.item || 'autosuggest__list-item';
      this.options.classNames.activeItem = configOptions.classNames.activeItem || 'autosuggest__list-item--active';
      this.options.classNames.header = configOptions.classNames.header || 'autosuggest__header';
    } // renaming simply to make it more obvious what
    // the element is in other contexts of the controller


    this._input = this.element; // initial state values

    this.setState({
      visible: false,
      header: configOptions.header || '',
      // working list that are displayed to use
      list: [],
      // rootList is the original set that the filter
      // will receive to determine what should be shown
      rootList: []
    });

    this._setList(configOptions.list); // Public API


    this.setHeader = this._setHeader;
  }

  update(newState, prevState) {
    // if our prev state is empty then
    // we assume that this is the first update/render call
    if (!('visible' in prevState)) {
      // create the elements that make up the component
      this._renderContentContainers();

      this._addTopLevelEventListeners();
    }

    if (newState.visible !== prevState.visible) {
      // updates the dom to change the class which actually updates visibilty
      setElementState(this._suggestionContainer, {
        open: newState.visible
      });
    }

    if (newState.header !== prevState.header) {
      this._header.innerHTML = newState.header;
    }

    var listChanged = updateHelper.listIsDifferent(newState.list, prevState.list);

    if (listChanged) {
      this._renderListItems();
    } // list change detection is needed to persist the
    // currently active elements over to the new list


    if (newState.activeId !== prevState.activeId || listChanged) {
      var currentActive = this._getActiveListItemElement();

      if (prevState.activeId && currentActive) {
        currentActive.classList.remove(this.options.classNames.activeItem);
      }

      if (newState.activeId && newState.list.find(item => item.__suggestionId === newState.activeId)) {
        this._listContainer.querySelector("[data-suggestion-id=\"".concat(newState.activeId, "\"]")).classList.add(this.options.classNames.activeItem);
      }
    }
  }
  /**
   * sets what would be the top header html
   *  to give context of what the suggestions are for
   *
   * @param  {string} header Html to place in header. You can pass plain text
   *  as well.
   */


  _setHeader(header) {
    this.setState({
      header
    });
  }
  /**
   * update the current list
   *
   * @param  {Array} list The new list.
   */


  _setList(list) {
    if (!Array.isArray(list)) {
      throw new TypeError('setList requires an array first argument');
    }

    this.setState({
      rootList: list.map(item => {
        return Object.assign({}, item, {
          // create an id that lets us direction map
          // selection to arbitrary item in list.
          // This allows lists to pass more than just the required
          // `name` property to know more about what the list item is
          __suggestionId: Math.random().toString(36).substr(2, 5)
        });
      })
    });

    this._filterListFromInput();
  }
  /**
   * we will run the consumer's filter function
   *  that is expected to be a pure function that will receive the
   *  root list (the initial list or list made with setList) and
   *  the input's current value. that function will return the array items,
   *  filtered and sorted, that will be set the new working list state and
   *  be rerendered.
   */


  _filterListFromInput() {
    this.setState({
      list: this.options.listFilter(this.state.rootList, this._input.value) || []
    });
  }
  /**
   * hit the consumers filter function to determine
   *   if we still have list items that need to be shown to the user.
   */


  _filterAndToggleVisibility() {
    this._filterListFromInput();

    this._toggleSuggestionsVisibility(
    /*show*/
    this.state.list.length > 0);
  }
  /**
   * lookup the active element, get item from
   *  object from list that was passed in, and invoke the onSelect callback.
   *  This is process to actually make a selection
   */


  _selectCurrentActiveItem() {
    var currentActive = this._getActiveListItemElement();

    var suggestionId = currentActive && currentActive.getAttribute('data-suggestion-id');
    var selection = this.state.list.filter(item => {
      return item.__suggestionId === suggestionId;
    })[0];

    if (selection) {
      this.options.onSelect(selection);

      this._filterAndToggleVisibility();

      this.setState({
        activeId: null
      });
    }
  }
  /**
   * update the list item dom elements with
   *  their "active" state when the user is hovering.
   *
   * @param  {bool} hovering are we hovering on the current element
   * @param  {Event} event    event used to pull the list item being targeted
   */


  _toggleItemHoverState(hovering, event) {
    var currentActive = this._getActiveListItemElement();

    var target = event.currentTarget;

    if (hovering && currentActive && currentActive.contains(target)) {
      return;
    }

    this.setState({
      activeId: hovering ? target.getAttribute('data-suggestion-id') : null
    });
  }
  /**
   * this function piggy backs on the setElementState
   *  style of defining element state in its class. Used in combination with the
   *  this.options.classNames.container the consumer has easy access to what the visibility state
   *  of the container is.
   *
   * @param  {bool} show should we update the state to be visible or not
   */


  _toggleSuggestionsVisibility(show) {
    // keeps the internal state synced with visibility
    this.setState({
      visible: !!show
    });
  }
  /**
   * @returns {HTMLElement}  the active list item element
   */


  _getActiveListItemElement() {
    return this._listContainer.querySelector('.' + this.options.classNames.activeItem);
  }
  /**
   * navigate the list, toggling the active item,
   *  based on the users arrow directions
   *
   * @param  {bool} down is the user navigating down the list?
   */


  _keyboardSelectionChange(down) {
    var currentActive = this._getActiveListItemElement();

    var nextActive; // we have a starting point, navigate on siblings of current

    if (currentActive) {
      if (down) {
        nextActive = currentActive.nextSibling;
      } else {
        nextActive = currentActive.previousSibling;
      } // we have no starting point, let's navigate based on
      // the directional expectation of what the first item would be

    } else if (down) {
      nextActive = this._listContainer.firstChild;
    } else {
      nextActive = this._listContainer.lastChild;
    }

    this.setState({
      activeId: nextActive ? nextActive.getAttribute('data-suggestion-id') : null
    });
  }
  /**
   * build the DOM structure that makes up
   *  the suggestion box and content containers.
   */


  _renderContentContainers() {
    // container of all suggestion elements
    this._suggestionContainer = document.createElement('div');

    this._suggestionContainer.classList.add(this.options.classNames.container); // child elements that will be populated by consumer


    this._header = document.createElement('h4');

    this._header.classList.add(this.options.classNames.header);

    this._setHeader(this.state.header);

    this._suggestionContainer.appendChild(this._header);

    this._listContainer = document.createElement('ul');

    this._listContainer.setAttribute('role', 'listbox');

    this._listContainer.classList.add(this.options.classNames.list);

    this._suggestionContainer.appendChild(this._listContainer); // put the suggestions adjacent to the input element
    // firefox does not support insertAdjacentElement


    if (HTMLElement.prototype.insertAdjacentElement) {
      this._input.insertAdjacentElement('afterend', this._suggestionContainer);
    } else {
      this._input.parentNode.insertBefore(this._suggestionContainer, this._input.nextSibling);
    }
  }
  /**
   * updates the content of the list container and builds
   *  the new set of list items.
   */


  _renderListItems() {
    // Create the new list items, render their contents
    // and update the dom with the new elements.
    this._listContainer.innerHTML = '';
    this.state.list.forEach(listItem => {
      var li = document.createElement('li');
      li.setAttribute('role', 'option');
      li.classList.add(this.options.classNames.item);
      li.setAttribute('data-suggestion-id', listItem.__suggestionId); // this should use some sort of event delegation if
      // we find we want to expand this to lists with *a lot* of items in it
      // But for now this binding has no real affect on small list perf

      li.addEventListener('mouseenter', this._toggleItemHoverState.bind(this,
      /*hovering*/
      true));
      li.addEventListener('mouseleave', this._toggleItemHoverState.bind(this,
      /*hovering*/
      false));
      li.addEventListener('mousedown', event => {
        // for situations like mobile, hovering might not be
        // the first event to set the active state for an element
        // so we will mimic that on mouse down and let selection happen
        // at the top level event
        this._toggleItemHoverState(
        /*hovering*/
        true, event);

        this._selectCurrentActiveItem();
      });
      li.innerHTML = this.options.renderListItem(listItem);

      this._listContainer.appendChild(li);
    });
  }
  /**
   * The events that can be set on a "global" or top
   *  level scope, we are going to set them here.
   */


  _addTopLevelEventListeners() {
    // we need to use mousedown instead of click
    // so we can beat the blur event which can
    // change visibility/target of the active event
    document.addEventListener('mousedown', event => {
      var target = event.target; // when clicking the input itself or if we are
      // or a global click was made while we were not visible
      // do nothing

      if (!this.state.visible || target === this._input) {
        return;
      } // see if inside interaction areas


      if (this._suggestionContainer.contains(target)) {
        event.preventDefault();
        event.stopPropagation();
      } // not in an interaction area, so we assume they
      // want it to go away.


      this._toggleSuggestionsVisibility(
      /*show*/
      false);
    }); // Note, keydown needed here to properly prevent the default
    // nature of navigating keystrokes - like DOWN ARROW at the end of an
    // input takes the cursor to the beginning of the input value.

    this._input.addEventListener('keydown', event => {
      var key = event.keyCode; // only consume the ENTER event if
      // we have an active item

      if (key === ENTER && !this._getActiveListItemElement()) {
        return;
      } // these keys are going to be consumed and not propagated


      if ([ENTER, UP, DOWN].indexOf(key) > -1) {
        if (key === ENTER) {
          this._selectCurrentActiveItem();
        } else {
          this._keyboardSelectionChange(
          /*down*/
          key === DOWN);
        }

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
      } // capture phase needed to beat any other listener that could
      // stop propagation after inspecting input value

    },
    /*useCapturePhase*/
    true);

    this._input.addEventListener('keyup', event => {
      if ([ENTER, UP, DOWN].indexOf(event.keyCode) === -1) {
        this._filterAndToggleVisibility();
      } // capture phase needed to beat any other listener that could
      // stop propagation after inspecting input value

    },
    /*useCapturePhase*/
    true);

    this._input.addEventListener('focus', () => {
      this._filterAndToggleVisibility();
    });

    this._input.addEventListener('blur', () => {
      this._toggleSuggestionsVisibility(
      /*show*/
      false);
    });
  }

}

var FACET_TYPE = 'FACET';
var TAG_TYPE = 'TAG';
var GROUP_TYPE = 'GROUP';
var MAX_SUGGESTIONS = 5;
/**
 * Normalize a string for use in comparisons of user input with a suggestion.
 * This causes differences in unicode composition and combining characters/accents to be ignored.
 */

var normalizeStr = function normalizeStr(str) {
  return fold(normalize(str));
};
/**
 * Controller for the search bar.
 */


class SearchBarController extends Controller {
  constructor(element) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    super(element, options);

    if (!options.lozengeTemplate) {
      options.lozengeTemplate = document.querySelector('#lozenge-template');
    }

    this._input = this.refs.searchBarInput;
    this._lozengeContainer = this.refs.searchBarLozenges;
    /**
     * the suggestionsMap pulls in the available lists - either
     *  static or dynamic living in the dom - into one mapping
     *  lists of all suggestion values.
     */

    this._suggestionsMap = (() => {
      var explanationList = [// {
        //   matchOn: 'user',
        //   title: 'user:',
        //   explanation: 'search by username',
        // },
        // {
        //   matchOn: 'tag',
        //   title: 'tag:',
        //   explanation: 'search for annotations with a tag',
        // },
        // {
        //   matchOn: 'url',
        //   title: 'url:',
        //   explanation: `search by URL<br>for domain level search
        //     add trailing /* eg. example.com/*`,
        // },
        // {
        //   matchOn: 'group',
        //   title: 'group:',
        //   explanation: 'show annotations associated with a group',
        // },
      ].map(item => {
        return Object.assign(item, {
          type: FACET_TYPE
        });
      }); // tagSuggestions are made available by the scoped template data.
      // see search.html.jinja2 for definition

      var tagSuggestionJSON = document.querySelector('.js-tag-suggestions');
      var tagSuggestions = [];

      if (tagSuggestionJSON) {
        try {
          tagSuggestions = JSON.parse(tagSuggestionJSON.innerHTML.trim());
        } catch (e) {
          console.error('Could not parse .js-tag-suggestions JSON content', e);
        }
      }

      var tagsList = (tagSuggestions || []).map(item => {
        return Object.assign(item, {
          type: TAG_TYPE,
          title: item.tag,
          // make safe
          matchOn: normalizeStr(item.tag),
          usageCount: item.count || 0
        });
      }); // groupSuggestions are made available by the scoped template data.
      // see search.html.jinja2 for definition

      var groupSuggestionJSON = document.querySelector('.js-group-suggestions');
      var groupSuggestions = [];

      if (groupSuggestionJSON) {
        try {
          groupSuggestions = JSON.parse(groupSuggestionJSON.innerHTML.trim());
        } catch (e) {
          console.error('Could not parse .js-group-suggestions JSON content', e);
        }
      }

      var groupsList = (groupSuggestions || []).map(item => {
        return Object.assign(item, {
          type: GROUP_TYPE,
          title: item.name,
          // make safe
          matchOn: normalizeStr(item.name),
          pubid: item.pubid,
          name: item.name,
          relationship: item.relationship
        });
      });
      return explanationList.concat(tagsList, groupsList);
    })();

    var getTrimmedInputValue = () => {
      return this._input.value.trim();
    };
    /**
     * given a lozenge set for a group, like "group:value", match the value
     *  against our group suggestions list to find a match on either pubid
     *  or the group name. The result will be an object to identify what
     *  is the search input term to use and what value can be displayed
     *  to the user. If there is no match, the input and display will be
     *  the original input value.
     *
     *  @param {String} groupLoz - ex: "group:value"
     *  @returns {Object} represents the values to display and use for inputVal
     *    {
     *      display: {String}, // like group:"friendly name"
     *      input: {String}    // like group:pid1234
     *    }
     */


    var getInputAndDisplayValsForGroup = groupLoz => {
      var groupVal = groupLoz.substr(groupLoz.indexOf(':') + 1).trim();
      var inputVal = groupVal.trim();
      var displayVal = groupVal;

      var wrapQuotesIfNeeded = function wrapQuotesIfNeeded(str) {
        return str.indexOf(' ') > -1 ? "\"".concat(str, "\"") : str;
      }; // remove quotes from value


      if (groupVal[0] === '"' || groupVal[0] === "'") {
        groupVal = groupVal.substr(1);
      }

      if (groupVal[groupVal.length - 1] === '"' || groupVal[groupVal.length - 1] === "'") {
        groupVal = groupVal.slice(0, -1);
      }

      var matchVal = normalizeStr(groupVal).toLowerCase(); // NOTE: We are pushing a pubid to lowercase here. These ids are created by us
      // in a random generation case-sensistive style. Theoretically, that means
      // casting to lower could cause overlaps of values like 'Abc' and 'aBC' - making
      // them equal to us. Since that is very unlikely to occur for one user's group
      // set, the convenience of being defensive about bad input/urls is more valuable
      // than the risk of overlap.

      var matchByPubid = this._suggestionsMap.find(item => {
        return item.type === GROUP_TYPE && item.pubid.toLowerCase() === matchVal;
      });

      if (matchByPubid) {
        inputVal = matchByPubid.pubid;
        displayVal = wrapQuotesIfNeeded(matchByPubid.name);
      } else {
        var matchByName = this._suggestionsMap.find(item => {
          return item.type === GROUP_TYPE && item.matchOn.toLowerCase() === matchVal;
        });

        if (matchByName) {
          inputVal = matchByName.pubid;
          displayVal = wrapQuotesIfNeeded(matchByName.name);
        }
      }

      return {
        input: 'group:' + inputVal,
        display: 'group:' + displayVal
      };
    };
    /**
     * Insert a hidden <input> with an empty value into the search <form>.
     *
     * The name="q" attribute is moved from the visible <input> on to the
     * hidden <input> so that when the <form> is submitted it's the value of
     * the _hidden_ input, not the visible one, that is submitted as the
     * q parameter.
     *
     */


    var insertHiddenInput = () => {
      var hiddenInput = document.createElement('input');
      hiddenInput.type = 'hidden'; // When JavaScript isn't enabled this._input is submitted to the server
      // as the q param. With JavaScript we submit hiddenInput instead.

      hiddenInput.name = this._input.name;

      this._input.removeAttribute('name');

      this.refs.searchBarForm.appendChild(hiddenInput);
      return hiddenInput;
    };
    /** Return the controllers for all of the displayed lozenges. */


    var lozenges = () => {
      var lozElements = Array.from(this.element.querySelectorAll('.js-lozenge'));
      return lozElements.map(el => el.controllers[0]);
    };
    /**
     * Update the value of the hidden input.
     *
     * Update the value of the hidden input based on the contents of any
     * lozenges and any remaining text in the visible input.
     *
     * This should be called whenever a lozenge is added to or removed from
     * the DOM, and whenever the text in the visible input changes.
     *
     */


    var updateHiddenInput = () => {
      var newValue = '';
      lozenges().forEach(loz => {
        var inputValue = loz.inputValue();

        if (inputValue.indexOf('group:') === 0) {
          inputValue = getInputAndDisplayValsForGroup(inputValue).input;
        }

        newValue = newValue + inputValue + ' ';
      });
      this._hiddenInput.value = (newValue + getTrimmedInputValue()).trim();
    };
    /**
     * Creates a lozenge and sets the content string to the
     * content provided and executes the delete callback when
     * the lozenge is deleted.
     *
     * @param {string} content The search term
     */


    var addLozenge = content => {
      return;
    };
    /**
     * Create lozenges for the search query terms already in the input field on
     * page load and update lozenges that are already in the lozenges container
     * so they are hooked up with the proper event handling
     */


    var lozengifyInput = () => {
      var {
        lozengeValues,
        incompleteInputValue
      } = getLozengeValues(this._input.value);
      lozengeValues.forEach(addLozenge); // this._input.value = incompleteInputValue;

      this._input.style.visibility = 'visible';
      updateHiddenInput();
    };

    var onInputKeyDown = event => {
      //   const word = getTrimmedInputValue();
      //   if (shouldLozengify(word)) {
      //     event.preventDefault();
      //     addLozenge(word);
      //     this._input.value = '';
      //     updateHiddenInput();
      //   }
      // }
    };

    this._hiddenInput = insertHiddenInput(this.refs.searchBarForm);
    this._suggestionsHandler = new AutosuggestDropdownController(this._input, {
      list: this._suggestionsMap,
      header: 'Narrow your search:',
      classNames: {
        container: 'search-bar__dropdown-menu-container',
        header: 'search-bar__dropdown-menu-header',
        list: 'search-bar__dropdown-menu',
        item: 'search-bar__dropdown-menu-item',
        activeItem: 'js-search-bar-dropdown-menu-item--active'
      },
      renderListItem: listItem => {
        var itemContents = "<span class=\"search-bar__dropdown-menu-title\"> ".concat(escapeHtml_1(listItem.title), " </span>");

        if (listItem.type === GROUP_TYPE && listItem.relationship) {
          itemContents += "<span class=\"search-bar__dropdown-menu-relationship\"> ".concat(escapeHtml_1(listItem.relationship), " </span>");
        }

        if (listItem.explanation) {
          itemContents += "<span class=\"search-bar__dropdown-menu-explanation\"> ".concat(listItem.explanation, " </span>");
        }

        return itemContents;
      },
      listFilter: (list, currentInput) => {
        currentInput = (currentInput || '').trim();
        var typeFilter = FACET_TYPE;
        var inputLower = currentInput.toLowerCase();

        if (inputLower.indexOf('tag:') === 0) {
          typeFilter = TAG_TYPE;
        } else if (inputLower.indexOf('group:') === 0) {
          typeFilter = GROUP_TYPE;
        }

        var inputFilter = normalizeStr(currentInput);

        if (typeFilter === TAG_TYPE || typeFilter === GROUP_TYPE) {
          inputFilter = inputFilter.substr(inputFilter.indexOf(':') + 1); // remove the initial quote for comparisons if it exists

          if (inputFilter[0] === "'" || inputFilter[0] === '"') {
            inputFilter = inputFilter.substr(1);
          }
        }

        if (this.state.suggestionsType !== typeFilter) {
          this.setState({
            suggestionsType: typeFilter
          });
        }

        return list.filter(item => {
          return item.type === typeFilter && item.matchOn.toLowerCase().indexOf(inputFilter.toLowerCase()) >= 0;
        }).sort((a, b) => {
          // this sort functions intention is to
          // sort partial matches as lower index match
          // value first. Then let natural sort of the
          // original list take effect if they have equal
          // index values or there is no current input value
          if (inputFilter) {
            var aIndex = a.matchOn.indexOf(inputFilter);
            var bIndex = b.matchOn.indexOf(inputFilter); // match score

            if (aIndex > bIndex) {
              return 1;
            } else if (aIndex < bIndex) {
              return -1;
            }
          } // If we are filtering on tags, we need to arrange
          // by popularity


          if (typeFilter === TAG_TYPE) {
            if (a.usageCount > b.usageCount) {
              return -1;
            } else if (a.usageCount < b.usageCount) {
              return 1;
            }
          }

          return 0;
        }).slice(0, MAX_SUGGESTIONS);
      },
      onSelect: itemSelected => {
        if (itemSelected.type === TAG_TYPE || itemSelected.type === GROUP_TYPE) {
          itemSelected.type === TAG_TYPE ? 'tag:' : 'group:';
          var valSelection = itemSelected.title; // wrap multi word phrases with quotes to keep
          // autosuggestions consistent with what user needs to do

          if (valSelection.indexOf(' ') > -1) {
            valSelection = "\"".concat(valSelection, "\"");
          }
          this._input.value = '';
        } else {
          this._input.value = itemSelected.title;
          setTimeout(() => {
            this._input.focus();
          }, 0);
        }

        updateHiddenInput();
      }
    });

    this._input.addEventListener('keydown', onInputKeyDown);

    this._input.addEventListener('input', updateHiddenInput);

    lozengifyInput();
  }

  update(newState, prevState) {
    if (!this._suggestionsHandler) {
      return;
    }

    if (newState.suggestionsType !== prevState.suggestionsType) {
      if (newState.suggestionsType === TAG_TYPE) {
        this._suggestionsHandler.setHeader('Popular tags:');
      } else if (newState.suggestionsType === GROUP_TYPE) {
        this._suggestionsHandler.setHeader('Your groups:');
      } else {
        this._suggestionsHandler.setHeader('Narrow your search:');
      }
    }
  }

}

var COMPLETE = 'complete',
    CANCELED = 'canceled';

function raf(task){
    if('requestAnimationFrame' in window){
        return window.requestAnimationFrame(task);
    }

    setTimeout(task, 16);
}

function setElementScroll(element, x, y){

    if(element.self === element){
        element.scrollTo(x, y);
    }else {
        element.scrollLeft = x;
        element.scrollTop = y;
    }
}

function getTargetScrollLocation(scrollSettings, parent){
    var align = scrollSettings.align,
        target = scrollSettings.target,
        targetPosition = target.getBoundingClientRect(),
        parentPosition,
        x,
        y,
        differenceX,
        differenceY,
        targetWidth,
        targetHeight,
        leftAlign = align && align.left != null ? align.left : 0.5,
        topAlign = align && align.top != null ? align.top : 0.5,
        leftOffset = align && align.leftOffset != null ? align.leftOffset : 0,
        topOffset = align && align.topOffset != null ? align.topOffset : 0,
        leftScalar = leftAlign,
        topScalar = topAlign;

    if(scrollSettings.isWindow(parent)){
        targetWidth = Math.min(targetPosition.width, parent.innerWidth);
        targetHeight = Math.min(targetPosition.height, parent.innerHeight);
        x = targetPosition.left + parent.pageXOffset - parent.innerWidth * leftScalar + targetWidth * leftScalar;
        y = targetPosition.top + parent.pageYOffset - parent.innerHeight * topScalar + targetHeight * topScalar;
        x -= leftOffset;
        y -= topOffset;
        x = scrollSettings.align.lockX ? parent.pageXOffset : x;
        y = scrollSettings.align.lockY ? parent.pageYOffset : y;
        differenceX = x - parent.pageXOffset;
        differenceY = y - parent.pageYOffset;
    }else {
        targetWidth = targetPosition.width;
        targetHeight = targetPosition.height;
        parentPosition = parent.getBoundingClientRect();
        var offsetLeft = targetPosition.left - (parentPosition.left - parent.scrollLeft);
        var offsetTop = targetPosition.top - (parentPosition.top - parent.scrollTop);
        x = offsetLeft + (targetWidth * leftScalar) - parent.clientWidth * leftScalar;
        y = offsetTop + (targetHeight * topScalar) - parent.clientHeight * topScalar;
        x -= leftOffset;
        y -= topOffset;
        x = Math.max(Math.min(x, parent.scrollWidth - parent.clientWidth), 0);
        y = Math.max(Math.min(y, parent.scrollHeight - parent.clientHeight), 0);
        x = scrollSettings.align.lockX ? parent.scrollLeft : x;
        y = scrollSettings.align.lockY ? parent.scrollTop : y;
        differenceX = x - parent.scrollLeft;
        differenceY = y - parent.scrollTop;
    }

    return {
        x: x,
        y: y,
        differenceX: differenceX,
        differenceY: differenceY
    };
}

function animate(parent){
    var scrollSettings = parent._scrollSettings;

    if(!scrollSettings){
        return;
    }

    var maxSynchronousAlignments = scrollSettings.maxSynchronousAlignments;

    var location = getTargetScrollLocation(scrollSettings, parent),
        time = Date.now() - scrollSettings.startTime,
        timeValue = Math.min(1 / scrollSettings.time * time, 1);

    if(scrollSettings.endIterations >= maxSynchronousAlignments){
        setElementScroll(parent, location.x, location.y);
        parent._scrollSettings = null;
        return scrollSettings.end(COMPLETE);
    }

    var easeValue = 1 - scrollSettings.ease(timeValue);

    setElementScroll(parent,
        location.x - location.differenceX * easeValue,
        location.y - location.differenceY * easeValue
    );

    if(time >= scrollSettings.time){
        scrollSettings.endIterations++;
        // Align ancestor synchronously
        scrollSettings.scrollAncestor && animate(scrollSettings.scrollAncestor);
        animate(parent);
        return;
    }

    raf(animate.bind(null, parent));
}

function defaultIsWindow(target){
    return target.self === target
}

function transitionScrollTo(target, parent, settings, scrollAncestor, callback){
    var idle = !parent._scrollSettings,
        lastSettings = parent._scrollSettings,
        now = Date.now(),
        cancelHandler,
        passiveOptions = { passive: true };

    if(lastSettings){
        lastSettings.end(CANCELED);
    }

    function end(endType){
        parent._scrollSettings = null;

        if(parent.parentElement && parent.parentElement._scrollSettings){
            parent.parentElement._scrollSettings.end(endType);
        }

        if(settings.debug){
            console.log('Scrolling ended with type', endType, 'for', parent);
        }

        callback(endType);
        if(cancelHandler){
            parent.removeEventListener('touchstart', cancelHandler, passiveOptions);
            parent.removeEventListener('wheel', cancelHandler, passiveOptions);
        }
    }

    var maxSynchronousAlignments = settings.maxSynchronousAlignments;

    if(maxSynchronousAlignments == null){
        maxSynchronousAlignments = 3;
    }

    parent._scrollSettings = {
        startTime: now,
        endIterations: 0,
        target: target,
        time: settings.time,
        ease: settings.ease,
        align: settings.align,
        isWindow: settings.isWindow || defaultIsWindow,
        maxSynchronousAlignments: maxSynchronousAlignments,
        end: end,
        scrollAncestor
    };

    if(!('cancellable' in settings) || settings.cancellable){
        cancelHandler = end.bind(null, CANCELED);
        parent.addEventListener('touchstart', cancelHandler, passiveOptions);
        parent.addEventListener('wheel', cancelHandler, passiveOptions);
    }

    if(idle){
        animate(parent);
    }

    return cancelHandler
}

function defaultIsScrollable(element){
    return (
        'pageXOffset' in element ||
        (
            element.scrollHeight !== element.clientHeight ||
            element.scrollWidth !== element.clientWidth
        ) &&
        getComputedStyle(element).overflow !== 'hidden'
    );
}

function defaultValidTarget(){
    return true;
}

function findParentElement(el){
    if (el.assignedSlot) {
        return findParentElement(el.assignedSlot);
    }

    if (el.parentElement) {
        if(el.parentElement.tagName.toLowerCase() === 'body'){
            return el.parentElement.ownerDocument.defaultView || el.parentElement.ownerDocument.ownerWindow;
        }
        return el.parentElement;
    }

    if (el.getRootNode){
        var parent = el.getRootNode();
        if(parent.nodeType === 11) {
            return parent.host;
        }
    }
}

var scrollIntoView = function(target, settings, callback){
    if(!target){
        return;
    }

    if(typeof settings === 'function'){
        callback = settings;
        settings = null;
    }

    if(!settings){
        settings = {};
    }

    settings.time = isNaN(settings.time) ? 1000 : settings.time;
    settings.ease = settings.ease || function(v){return 1 - Math.pow(1 - v, v / 2);};
    settings.align = settings.align || {};

    var parent = findParentElement(target),
        parents = 1;

    function done(endType){
        parents--;
        if(!parents){
            callback && callback(endType);
        }
    }

    var validTarget = settings.validTarget || defaultValidTarget;
    var isScrollable = settings.isScrollable;

    if(settings.debug){
        console.log('About to scroll to', target);

        if(!parent){
            console.error('Target did not have a parent, is it mounted in the DOM?');
        }
    }

    var scrollingElements = [];

    while(parent){
        if(settings.debug){
            console.log('Scrolling parent node', parent);
        }

        if(validTarget(parent, parents) && (isScrollable ? isScrollable(parent, defaultIsScrollable) : defaultIsScrollable(parent))){
            parents++;
            scrollingElements.push(parent);
        }

        parent = findParentElement(parent);

        if(!parent){
            done(COMPLETE);
            break;
        }
    }

    return scrollingElements.reduce((cancel, parent, index) => transitionScrollTo(target, parent, settings, scrollingElements[index + 1], done), null);
};

/**
 * @typedef Options
 * @property {EnvironmentFlags} [envFlags] - Environment flags. Provided as a
 *           test seam.
 * @property {Function} [scrollTo] - A function that scrolls a given element
 *           into view. Provided as a test seam.
 */

/**
 * Controller for buckets of results in the search result list
 */

class SearchBucketController extends Controller {
  /**
   * @param {Element} element
   * @param {Options} options
   */
  constructor(element, options) {
    super(element, options);
    this.scrollTo = this.options.scrollTo || scrollIntoView;
    this.refs.header.addEventListener('click', event => {
      if (this.refs.domainLink.contains(event.target)) {
        return;
      }

      event.stopPropagation();
      event.preventDefault();
      this.setState({
        expanded: !this.state.expanded
      });
    });
    this.refs.title.addEventListener('click', event => {
      event.stopPropagation();
      event.preventDefault();
      this.setState({
        expanded: !this.state.expanded
      });
    });
    this.refs.collapseView.addEventListener('click', () => {
      this.setState({
        expanded: !this.state.expanded
      });
    });
    var envFlags = this.options.envFlags || window.envFlags;
    this.setState({
      expanded: !!envFlags.get('js-timeout')
    });
  }

  update(state, prevState) {
    setElementState(this.refs.content, {
      expanded: state.expanded
    });
    setElementState(this.element, {
      expanded: state.expanded
    });
    this.refs.title.setAttribute('aria-expanded', state.expanded.toString()); // Scroll to element when expanded, except on initial load

    if (typeof prevState.expanded !== 'undefined' && state.expanded) {
      this.scrollTo(this.element);
    }
  }

}

var CONFIG_ATTR = 'share-widget-config';
var TRIGGER_SELECTOR = "[".concat(CONFIG_ATTR, "]");
var WIDGET_SELECTOR = '.js-share-widget-owner';
var TARGET_HREF_ATTR = 'share-target-href';
var TARGET_HREF_SELECTOR = "[".concat(TARGET_HREF_ATTR, "]");
var CLIPBOARD_INPUT_SELECTOR = '.js-share-widget-clipboard';
var PRIVATE_MSG_SELECTOR = '.js-share-widget-msg-private';
var GROUP_MSG_SELECTOR = '.js-share-widget-msg-group';
var ARROW_PADDING_RIGHT = 16;
var ARROW_PADDING_BOTTOM = 5;
var shareWidgetAttached = false;

var getOffset = el => {
  el = el.getBoundingClientRect();
  return {
    // adjust for top left of the document
    left: el.left + window.pageXOffset,
    top: el.top + window.pageYOffset,
    width: el.width,
    height: el.height
  };
};

class ShareWidget {
  constructor(containerElement) {
    // we only attach one to the dom since it's a global listener
    if (shareWidgetAttached) {
      return;
    }

    shareWidgetAttached = true;
    this._currentTrigger = null;
    this._container = containerElement;
    this._widget = this._container.querySelector(WIDGET_SELECTOR);
    this._widgetVisible = false; // on initialize we need to reset container visibility

    this.hide();

    this._handler = event => {
      var target = event.target; // do nothing if we are clicking inside of the widget

      if (this._container.contains(target)) {
        return;
      }

      var trigger = target.closest(TRIGGER_SELECTOR);

      if (trigger) {
        var config = JSON.parse(trigger.getAttribute(CONFIG_ATTR)); // if we click the same trigger twice we expect
        // to close the current trigger. Otherwise, we need
        // to move to the new trigger and open

        if (trigger === this._currentTrigger && this._widgetVisible) {
          this.hide();
        } else {
          this.showForNode(trigger, config);
        }

        if (trigger !== this._currentTrigger) {
          this._currentTrigger = trigger;
        }

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        return;
      } // hide the widget if the click was not handled by
      // clicking on the triggers or widget itself


      if (this._widgetVisible) {
        this.hide();
      }
    };

    window.document.body.addEventListener('click', this._handler);
  }
  /**
   * @typedef {Object} ConfigOptions
   * @property {String} url - the url we are enabling to be shared
   * @property {Bool} [private] - is the card only visible to this user
   * @property {Bool} [group] - is the card posted in a group scope
   */

  /**
   * Update the template based on the config variables passed in
   *
   * @param  {ConfigOptions} config The details we need to apply update our template
   *   with the correct information per card.
   */


  _renderWidgetTemplate(config) {
    // copy to clipboard input
    this._widget.querySelector(CLIPBOARD_INPUT_SELECTOR).value = config.url; // social links

    Array.from(this._widget.querySelectorAll(TARGET_HREF_SELECTOR)).forEach(target => {
      target.href = target.getAttribute(TARGET_HREF_ATTR).replace('{href}', encodeURI(config.url));
    }); // scope access dialog

    var privateMessage = this._widget.querySelector(PRIVATE_MSG_SELECTOR);

    var groupMessage = this._widget.querySelector(GROUP_MSG_SELECTOR);

    privateMessage.style.display = 'none';
    groupMessage.style.display = 'none';

    if (config.private) {
      privateMessage.style.display = 'block';
    } else if (config.group) {
      groupMessage.style.display = 'block';
    }
  }
  /**
   * Given a node, update the template, repostion the widget properly,
   *  and make it visible.
   *
   * @param  {HTMLElement} node The trigger node that we will place the widget
   *   next to.
   * @param  {ConfigOptions} config Passed through to rendering/interpolation
   */


  showForNode(node, config) {
    if (!node || !config) {
      throw new Error('showForNode did not recieve both arguments');
    }

    this._renderWidgetTemplate(config); // offsets affecting height need to be updated after variable replacement


    var widgetOffsets = getOffset(this._widget);
    var nodeOffset = getOffset(node);
    this._widget.style.top = nodeOffset.top - widgetOffsets.height - ARROW_PADDING_BOTTOM + 'px';
    this._widget.style.left = ARROW_PADDING_RIGHT + nodeOffset.left + nodeOffset.width / 2 - widgetOffsets.width + 'px';
    this._container.style.visibility = 'visible';
    this._widgetVisible = true;
  }

  hide() {
    this._container.style.visibility = 'hidden';
    this._widgetVisible = false;
  }
  /**
   * Utility to clean up the listeners applied. Otherwise the subsequent
   * constructor will reset all other state. Primary use is meant for testing cleanup
   */


  detach() {
    window.document.body.removeEventListener('click', this._handler);
  }

}
/**
 * ShareWidgetController is the facade for the ShareWidget class that
 * does not mix the concerns of how our controller's lifecycle paradigm
 * in with the library code itself. Basically it maps what we define the
 * lifecycle of a controller to be into the appropriate method invocations on
 * the libraries api
 */


class ShareWidgetController extends Controller {
  constructor(element) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    super(element, options);

    if (!shareWidgetAttached) {
      shareWidgetAttached = new ShareWidget(element);
    }
  }

  beforeRemove() {
    if (shareWidgetAttached) {
      shareWidgetAttached.detach();
      shareWidgetAttached = null;
    }
  }

}

var appSettings = settings(document);

if (appSettings.raven) {
  init(appSettings.raven);
}

var controllers = Object.assign({
  '.js-authorize-form': AuthorizeFormController,
  '.js-create-group-form': CreateGroupFormController,
  '.js-search-bar': SearchBarController,
  '.js-search-bucket': SearchBucketController,
  '.js-share-widget': ShareWidgetController
}, sharedControllers);

if (window.envFlags && window.envFlags.get('js-capable')) {
  upgradeElements(document.body, controllers);
  window.envFlags.ready();
} else {
  // Environment flags not initialized. The header script may have been missed
  // in the page or may have failed to load.
  console.warn('EnvironmentFlags not initialized. Skipping element upgrades');
}
