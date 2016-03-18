'use strict';
var $ = require('jquery');
// When running tests in node, create a fake `window` for jQuery
if (!$.fn) {
	$ = $(require('domino').createWindow());
}

var $param = $.param;
var $each = $.each;
var isArray = $.isArray;
var trim = $.trim;
var hop = Object.prototype.hasOwnProperty;

exports.extract = function (str) {
	return str.split('?')[1] || '';
};

exports.parse = function (str) {
	if (typeof str !== 'string') {
		return {};
	}

	str = trim(str).replace(/^(\?|#|&)/, '');

	if (!str) {
		return {};
	}

	var ret = {};
	$each(str.split('&'), function (i, param) {
		var parts = param.replace(/\+/g, ' ').split('=');
		// Firefox (pre 40) decodes `%3D` to `=`
		// https://github.com/sindresorhus/query-string/pull/37
		var key = parts.shift();
		var val = parts.length > 0 ? parts.join('=') : undefined;

		key = decodeURIComponent(key);

		// missing `=` should be `null`:
		// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
		val = val === undefined ? null : decodeURIComponent(val);

		if (!hop.call(ret, key)) {
			ret[key] = val;
		} else if (isArray(ret[key])) {
			ret[key].push(val);
		} else {
			ret[key] = [ret[key], val];
		}
	});
	return ret;
};

exports.stringify = function (obj) {
	return $param(obj, true);
};
