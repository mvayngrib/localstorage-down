'use strict';

var d64 = require('d64');

// ArrayBuffer/Uint8Array are old formats that date back to before we
// had a proper browserified buffer type. they may be removed later
var arrayBuffPrefix = 'ArrayBuffer:';
// var arrayBuffRegex = new RegExp('^' + arrayBuffPrefix);
var uintPrefix = 'Uint8Array:';
// var uintRegex = new RegExp('^' + uintPrefix);
// this is the new encoding format used going forward
var bufferPrefix = 'Buff:';
// var bufferRegex = new RegExp('^' + bufferPrefix);


// taken from rvagg/memdown commit 2078b40
exports.sortedIndexOf = function(arr, item) {
  var low = 0;
  var high = arr.length;
  var mid;
  while (low < high) {
    mid = (low + high) >>> 1;
    if (arr[mid] < item) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  return low;
};


exports.encode = function encode (vals) {
  return Array.isArray(vals) ? vals.map(encodeOne) : encodeOne(vals);
};

exports.decode = function decode (strings) {
  return Array.isArray(strings) ? strings.map(decodeOne) : decodeOne(strings);
};

function encodeOne (val) {
  return Buffer.isBuffer(val) ? bufferPrefix + d64.encode(val) : val;
}


function decodeOne (str) {
  if (str.slice(0, bufferPrefix.length) === bufferPrefix) {
    return d64.decode(str.slice(bufferPrefix.length));
  } else if (str.slice(0, uintPrefix.length) === uintPrefix) {
    str = str.slice(uintPrefix.length);
    return new Uint8Array(atob(str).split('').map(function (c) {
      return c.charCodeAt(0);
    }));
  } else if (str.slice(0, arrayBuffPrefix.length) === arrayBuffPrefix) {
    str = str.slice(arrayBuffPrefix.length);
    return new ArrayBuffer(atob(str).split('').map(function (c) {
      return c.charCodeAt(0);
    }));
  }

  return str;
}
