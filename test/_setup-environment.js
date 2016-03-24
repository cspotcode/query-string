// Required by ava to set up the testing environment.
// Does not contain test cases.
if (typeof global.window === 'undefined') {
	global.window = require('domino').createWindow();
}
