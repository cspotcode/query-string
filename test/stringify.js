import test from 'ava';
import fn from '../';

test('stringify', t => {
	t.same(fn.stringify({foo: 'bar'}), 'foo=bar');
	t.same(fn.stringify({foo: 'bar', bar: 'baz'}), 'foo=bar&bar=baz');
});

test('different types', t => {
	t.same(fn.stringify(), '');
	t.same(fn.stringify(0), '');
});

test('URI encode', t => {
	// jquery.param encodes spaces as + and does not encode a few other characters that strict-uri-encode does.
	t.same(fn.stringify({'foo bar': 'baz faz'}), 'foo+bar=baz+faz');
	t.same(fn.stringify({'foo bar': 'baz\'faz'}), 'foo+bar=baz\'faz');
});

test('handle array value', t => {
	t.same(fn.stringify({abc: 'abc', foo: ['bar', 'baz']}), 'abc=abc&foo=bar&foo=baz');
	// jquery.param encodes null and undefined as empty strings
	t.same(fn.stringify({abc: 'abc', foo: [null, 'baz']}), 'abc=abc&foo=&foo=baz');
});

test('handle empty array value', t => {
	t.same(fn.stringify({abc: 'abc', foo: []}), 'abc=abc');
});

test('should encode undefined and null values as empty string', t => {
	t.same(fn.stringify({abc: undefined, foo: 'bar'}), 'abc=&foo=bar');
	t.same(fn.stringify({abc: null, foo: 'bar'}), 'abc=&foo=bar');
});
