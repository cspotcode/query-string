'use strict';
var strictUriEncode = require('strict-uri-encode');
var $ = require('jquery');

var $each = $.each;
var isArray = $.isArray;
var trim = $.trim;
var hop = Object.prototype.hasOwnProperty;
var keys = function(obj) {
	var ret = [];
	$each(obj, function(i, v) {
		ret.push(v);
	});
	return ret;
};

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
	return obj ? keys(obj).sort().map(function (key) {
		var val = obj[key];

		if (val === undefined) {
			return '';
		}

		if (val === null) {
			return key;
		}

		if (isArray(val)) {
			return val.slice().sort().map(function (val2) {
				return strictUriEncode(key) + '=' + strictUriEncode(val2);
			}).join('&');
		}

		return strictUriEncode(key) + '=' + strictUriEncode(val);
	}).filter(function (x) {
		return x.length > 0;
	}).join('&') : '';
};
