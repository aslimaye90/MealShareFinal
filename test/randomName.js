var expect = require('chai').expect;
var assert = require('assert');

describe('random file - test test', function(){
	it('should also pass', function(){
		expect('hello '+'world').to.equal('hello world');
	});
});

describe('random file - array test', function(){
	it('should return -1 for an element not present in it', function(){
		assert.equal(-1, [1,2,3].indexOf(7));
		assert.equal(-1, [1,2,3,4,5].indexOf(-2));
	});

	it('should return the correct array index', function(){
		assert.equal(1,[1,2,3].indexOf(2));
		expect([2,4,5,6,3].indexOf(6)).to.equal(3);
	});

	it('should do something in the future', function(){
		assert.equal(5+5,10);
	});
});

describe('random file - dynamic tests', function(){
	function add() {
		return Array.prototype.slice.call(arguments).reduce(function(prev, curr) {
			return prev + curr;
		}, 0);
	}

	var tests = [
		{args: [1, 2],       expected: 3},
		{args: [1, 2, 3],    expected: 6},
		{args: [1, 2, 3, 4], expected: 10}
	];

	tests.forEach(function(test) {
		it('correctly adds ' + test.args.length + ' args', function() {
			var res = add.apply(null, test.args);
			assert.equal(res, test.expected);
		});
	});
});