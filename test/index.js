var index = require('../lib/index');
var util = require('../lib/util');
var should = require('should');
var serverDomain = 'http://192.168.1.120:8120' || 'http://pay.kaolalicai.cn';
var cryptoConfig = {
	md5_key:'hhhiljahmjkcookf',//md5 key
	des_key:'gdlsmroisfhocawdivkktpuj',//des key,24个字符长度
	aes_key:'objfkjcdhkokgakg',//aes key,16个字符长度
	merchant_pri_key:'MIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBAIQ52ioNZvU3wSlQlrDS0Dodzw7GYjcXzJnTglbGBmZI6zu3FXOGJPJbmziKGmi7UIogjd0D1IaobDMPzXbgsS5oJEwEpfEsrrBlRDu/IZGf9CYa2FfC92b24yuvtLQx+OYT7xpcht01smZwadR2/yG95fzRXi4Yo7ppTi3lpePvAgMBAAECgYA6fExfZWYw+ORbneXJeLXZvu2jH2S58bDyKXfxYc3a2E4UL7sxShh1isdxjsR3psLNFfEp3VPX7A9P1qGO/3ve4q7DqH98MgJbncPCyxK/K4WyL6roYNtn/rsbXW0ifDVvPBdWeRVkm1BDEKUvZUf5Q2ZJlb17uDBoT8sRMYMA4QJBANMFuf9IXs76IMpYYGPrhJX1qWvHGTqQi3uAtWnsQevvZ5hepIK21i627/uYdK6tKpdJpUX0NboZpn9tk15ahYMCQQCgaKlXifgWtwT0H1IF7E7UU+xMdzoeiOcw5GducAdeTljrNCs9pGLdrgJn4wA99TcGHZ9lM1hMEDPGYZoHYYglAkAWBVf2it/R64o2c2iDpNUuLPekFp/MW78igTjtN8ldTJtb7Cxws5HASDjc4XjzrYBvTzEfDq/4nqqgS5gAVaPvAkAjvC09mzbxmIQ5/mA/gY1uL+QMhOMlukoG0ltYdwytLbcRbuXTLbP4vrM6gY+kPeSsMB06Zl3dVB60qzmtO0UhAkA8bzh4fdtX0ZJj4shuxsy0zxsC7t6+RNqY/FA85jEPI5JFhVrm27eunf0lQaPewvpTcjGkhCMzqZRYq+EmuUgM',//rsa pri key
	npay_pub_key:'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCEOdoqDWb1N8EpUJaw0tA6Hc8OxmI3F8yZ04JWxgZmSOs7txVzhiTyW5s4ihpou1CKII3dA9SGqGwzD8124LEuaCRMBKXxLK6wZUQ7vyGRn/QmGthXwvdm9uMrr7S0MfjmE+8aXIbdNbJmcGnUdv8hveX80V4uGKO6aU4t5aXj7wIDAQAB',//rsa pub  key
};
describe('index',function(){
	describe('init',function(){
		it('it should be ok.',function(){
			try{
				var nPay = new index({
					appid:'test_123',
					appkey:'abcd',
					serverDomain:serverDomain,
					cryptoConfig:cryptoConfig
				});
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
			var nPay = new index({
				appid:'test_123',
				appkey:'abcd',
				serverDomain:serverDomain,
				cryptoConfig:cryptoConfig
			});
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
			var nPay = new index({
				appid:'test_123',
				appkey:'abcd',
				serverDomain:serverDomain,
				cryptoConfig:cryptoConfig
			});
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
			var nPay = new index({
				appid:'test_123',
				appkey:'abcd',
				serverDomain:serverDomain,
				cryptoConfig:cryptoConfig
			});
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
			var nPay = new index({
				appid:'test_123',
				appkey:'abcd',
				serverDomain:serverDomain,
				cryptoConfig:cryptoConfig
			});
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
			var nPay = new index({
				appid:'test_123',
				appkey:'abcd',
				serverDomain:serverDomain,
				cryptoConfig:cryptoConfig
			});
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
			var nPay = new index({
				appid:'test_123',
				appkey:'abcd',
				serverDomain:serverDomain,
				cryptoConfig:cryptoConfig
			});
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
			var nPay = new index({
				appid:'test_123',
				appkey:'abcd',
				serverDomain:serverDomain,
				cryptoConfig:cryptoConfig
			});
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
			var nPay = new index({
				appid:'test_123',
				appkey:'abcd',
				serverDomain:serverDomain,
				cryptoConfig:cryptoConfig
			});
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
			var nPay = new index({
				appid:'test_123',
				appkey:'abcd',
				serverDomain:serverDomain,
				cryptoConfig:cryptoConfig
			});
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
			var nPay = new index({
				appid:'test_123',
				appkey:'abcd',
				serverDomain:serverDomain,
				cryptoConfig:cryptoConfig
			});
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
	describe('getPayment',function(){
		it('it should be ok.',function(done){
			var nPay = new index({
				appid:'test_123',
				appkey:'abcd',
				serverDomain:serverDomain,
				cryptoConfig:cryptoConfig
			});
			nPay.getPayment(
				'RSA',
				function(err,data){
					data.should.have.properties({code:-1,msg:'appid或者appkey不正确。'});
					done(err);
				}
			)
		});			
	});
	//#################################//
})