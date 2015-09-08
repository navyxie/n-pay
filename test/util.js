var util = require('../lib/util');
var should = require('should');
describe('util',function(){
	it('#isFunction()',function(){
		util.isFunction(function(){}).should.be.equal(true);
	})
})