'use strict';
var $ = require('jquery');
// When running tests in node, jQuery must be explicitly instantiated by passing it a `window`.
if (!$.fn) {
	$ = $(global.window);
}

var $param = $.param;
var $each = $.each;
var isArray = $.isArray;
var trim = $.trim;
var hop = Object.prototype.hasOwnProperty;
// IE 8 can't defineProperty on plain objects.
// However, IE 8 also doesn't seem to give any special meaning to the __proto__ property so we should
// (famous last words) be ok.
var supportsDefineProperty = false;
try {
	Object.defineProperty({}, 'x', {});
	supportsDefineProperty = true;
} catch (e) {}
/**
 * Safely set a property on a dictionary object.
 */
var setProp =
	supportsDefineProperty ?
	function (obj, key, value) {
		if (key in obj) {
			Object.defineProperty(obj, key, {
				value: value,
				writable: true,
				configurable: true,
				enumerable: true
			});
		} else {
			obj[key] = value;
		}
		return value;
	} :
	function (obj, key, value) {
		obj[key] = value;
		return value;
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
			setProp(ret, key, val);
		} else if (isArray(ret[key])) {
			ret[key].push(val);
		} else {
			setProp(ret, key, [ret[key], val]);
		}
	});
	return ret;
};

exports.stringify = function (obj) {
	return $param(obj || {}, true);
};
