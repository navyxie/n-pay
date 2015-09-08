var index = require('../lib/index');
var should = require('should');
describe('index',function(){
	describe('init',function(){
		it('it should not be ok.',function(){
			try{
				var nPay = new index();
			}catch(e){
				should.exist(e);
			}
		})		
	});
	// describe('#pay()',function(){
	// 	it('it should not be ok.',function(){
			
	// 	});
	// })
})