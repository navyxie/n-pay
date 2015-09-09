var index = require('../lib/index');
var util = require('../lib/util');
var should = require('should');
describe('index',function(){
	describe('init',function(){
		it('it should be ok.',function(){
			try{
				var nPay = new index({appid:'test_123',appkey:'abcd',serverDomain:'http://pay.kaolalicai.cn'});
			}catch(e){
				should.exist(e);
			}
		});
		it('it should not be ok.',function(){
			try{
				var nPay = new index();
			}catch(e){
				should.exist(e);
			}
		});	
		it('it should not be ok.',function(){
			try{
				var nPay = new index(123);
			}catch(e){
				should.exist(e);
			}
		});	
		it('it should not be ok.',function(){
			try{
				var nPay = new index({appid:'test_123',appkey:'abcd'});
			}catch(e){
				should.exist(e);
			}
		});
		it('it should not be ok.',function(){
			try{
				var nPay = new index({appid:123,appkey:'abcd'});
			}catch(e){
				should.exist(e);
			}
		});							
	});
	describe('pay',function(){
		it('it should be ok.',function(done){
			var nPay = new index({appid:'test_123',appkey:'abcd',serverDomain:'http://pay.kaolalicai.cn'});
			nPay.pay(
				{channel:'yeepay',merchant_account:'test_yeepay'},
				{
					'order_id':"abc_test",
					'user_id':"abc_user",
					'amount':0.01,
					'trans_time':Date.now(),
					'reg_time':Date.now(),
					'return_url':"http://www.kaolalicai.cn",
					'notify_url':"http://www.kaolalicai.cn",
					'order_desc':"test pay"
				},
				function(err,data){
					data.should.have.properties({code:-1,msg:'appid或者appkey不正确。'});
					done(err);
				}
			)
		});
		it('it should be not ok.',function(done){
			var nPay = new index({appid:'test_123',appkey:'abcd',serverDomain:'http://pay.kaolalicai.cn'});
			nPay.pay(
				{channel:'yeepay',merchant_account:'test_yeepay'},
				{
					'order_id':"abc_test",
					'user_id':"abc_user",
					'amount':0.01,
					'trans_time':Date.now(),
					'reg_time':Date.now(),
					'return_url':"http://www.kaolalicai.cn",
					// 'notify_url':"http://www.kaolalicai.cn",
					'order_desc':"test pay"
				},
				function(err,data){
					var keys = util.getOrderKey();
					var keysTip = 'orderInfo must be have key '+keys.join(',')+'.';
					err.should.be.equal(keysTip);
					done(null);
				}
			)
		});
		it('it should be not ok.',function(done){
			var nPay = new index({appid:'test_123',appkey:'abcd',serverDomain:'http://pay.kaolalicai.cn'});
			nPay.pay(
				{channel:'',merchant_account:'test_yeepay'},
				{
					'order_id':"abc_test",
					'user_id':"abc_user",
					'amount':0.01,
					'trans_time':Date.now(),
					'reg_time':Date.now(),
					'return_url':"http://www.kaolalicai.cn",
					// 'notify_url':"http://www.kaolalicai.cn",
					'order_desc':"test pay"
				},
				function(err,data){
					err.should.be.equal('paymentConfig must be have key channel and merchant_account.');
					done(null);
				}
			)
		});	
		it('it should be not ok.',function(done){
			var nPay = new index({appid:'test_123',appkey:'abcd',serverDomain:'http://pay.kaolalicai.cn'});
			nPay.pay(
				'string',
				{
					'order_id':"abc_test",
					'user_id':"abc_user",
					'amount':0.01,
					'trans_time':Date.now(),
					'reg_time':Date.now(),
					'return_url':"http://www.kaolalicai.cn",
					// 'notify_url':"http://www.kaolalicai.cn",
					'order_desc':"test pay"
				},
				function(err,data){
					err.should.be.equal('paymentConfig must be Object.');
					done(null);
				}
			)
		});	
		it('it should be not ok.',function(done){
			var nPay = new index({appid:'test_123',appkey:'abcd',serverDomain:'http://pay.kaolalicai.cn'});
			nPay.pay(
				{channel:'yeepay',merchant_account:'test_yeepay'},
				'string',
				function(err,data){
					err.should.be.equal('orderInfo must be Object.');
					done(null);
				}
			)
		});				
	});
	describe('query',function(){
		it('it should be ok.',function(done){
			var nPay = new index({appid:'test_123',appkey:'abcd',serverDomain:'http://pay.kaolalicai.cn'});
			nPay.query(
				{channel:'yeepay',merchant_account:'test_yeepay'},
				{
					'order_id':"abc_test"
				},
				function(err,data){
					data.should.have.properties({code:-1,msg:'appid或者appkey不正确。'});
					done(err);
				}
			)
		});	
		it('it should be not ok.',function(done){
			var nPay = new index({appid:'test_123',appkey:'abcd',serverDomain:'http://pay.kaolalicai.cn'});
			nPay.query(
				{channel:'yeepay',merchant_account:'test_yeepay'},
				{
					'a':"abc_test"
				},
				function(err,data){
					err.should.be.equal('queryInfo must be have key order_id.');
					done(null);
				}
			)
		});	
		it('it should be not ok.',function(done){
			var nPay = new index({appid:'test_123',appkey:'abcd',serverDomain:'http://pay.kaolalicai.cn'});
			nPay.query(
				{channel:'yeepay',merchant_account:'test_yeepay'},
				'string',
				function(err,data){
					err.should.be.equal('queryInfo must be Object.');
					done(null);
				}
			)
		});	
		it('it should be not ok.',function(done){
			var nPay = new index({appid:'test_123',appkey:'abcd',serverDomain:'http://pay.kaolalicai.cn'});
			nPay.query(
				{channel:'yeepay',merchant_account:''},
				{
					'order_id':"abc_test"
				},
				function(err,data){
					err.should.be.equal('paymentConfig must be have key channel and merchant_account.');
					done(null);
				}
			)
		});
		it('it should be not ok.',function(done){
			var nPay = new index({appid:'test_123',appkey:'abcd',serverDomain:'http://pay.kaolalicai.cn'});
			nPay.query(
				'string',
				{
					'order_id':"abc_test"
				},
				function(err,data){
					err.should.be.equal('paymentConfig must be Object.');
					done(null);
				}
			)
		});			
	});
})