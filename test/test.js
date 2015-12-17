var expect = require('chai').expect;
var request = require('request');
var http = require('http');
var assert = require('assert');

describe('A basic test', function(){
	it('should always pass', function(){
		expect(5+3).to.equal(8);
	});
});

describe('HTTP requests', function(){
	//doesn't work without the 'done' argument
	it('should return a 404', function(done){
		request('http://localhost:8080/ha/ha/fake/url', function(err, res, body){
			expect(res.statusCode).to.equal(404);
			//expect(err).to.equal(undefined);
			//expect(body && true).to.equal(false);
			expect(err || false).to.equal(false);
			done();
		});
	});

	it('should return a 200', function(done){
		http.get('http://localhost:8080/', function(err, res, body){
			expect(err.statusCode).to.equal(200);
			expect(res || false).to.equal(false);
			expect(body || false).to.equal(false);
			done();
		});
	});

	it('should return correct firstName and lastName', function(done){
		request(
			'http://localhost:8080/api/persons/55ecd480537b331517aa332d',
			function(err, res, body){
				expect(err || false).to.equal(false);
				assert.equal(res.statusCode, 200);
				body = JSON.parse(body);
				expect(body.firstName).to.equal('Bruce');
				assert.equal(body.lastName, 'Wayne');
				done();
			}
		);
	});

	it('should never be 404', function(done){
		request(
			'http://localhost:8080',
			function(err, res, body){
				expect(res.statusCode).to.not.equal(404);
				done();
			}
		);
	});
});