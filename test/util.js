var util = require('../lib/util');
var should = require('should');
describe('util',function(){
	it('#isFunction()',function(){
		util.isFunction(function(){}).should.be.equal(true);
	});
	it('#isObject()',function(){
		util.isObject({}).should.be.equal(true);
	});
	it('#isObject()',function(){
		util.isObject(null).should.be.equal(false);
	});
	it('#isObject()',function(){
		util.isObject(undefined).should.be.equal(false);
	});
	it('#isArray()',function(){
		util.isArray([]).should.be.equal(true);
	});
	it('#isType()',function(){
		util.isType([],'Array').should.be.equal(true);
	});
	it('#extend()',function(){
		util.extend({a:1},{b:2}).should.have.properties({a:1,b:2});
	});
	it('#extend()',function(){
		var destination = {a:1};
		var source = {b:2,c:{c:3}};
		util.extend(destination,source,true);
		destination.should.have.properties({a:1,b:2,c:{c:3}});
		destination.c.c = 4;
		source.c.c.should.be.equal(3);
	});
	it('#extend()',function(){
		var destination = {a:1};
		var source = {b:2,c:{c:3}};
		util.extend(destination,source,false);
		destination.should.have.properties({a:1,b:2,c:{c:3}});
		destination.c.c = 4;
		source.c.c.should.be.equal(4);
	});
	it('#clone()',function(){
		util.clone({a:1}).should.have.properties({a:1});
	});
	it('#makeArray()',function(){
		var testFn = function(){
			util.isArray(arguments).should.be.equal(false);
			var arr = util.makeArray(arguments);
			util.isArray(arr).should.be.equal(true);
		}
		testFn(1,2,3);
	});
	it('#mixture()',function(){
		var a = {a:1};
		var b = {b:2};
		util.mixture(a,b);
		a.should.have.properties({a:1,b:2});
	});
	it('#checkPaymentConfig()',function(){
		util.checkPaymentConfig(1).should.have.properties({pass:false,msg:'paymentConfig must be Object.'});
		util.checkPaymentConfig({a:1}).should.have.properties({pass:false,msg:'paymentConfig must be have key channel and merchant_account.'});
		util.checkPaymentConfig({channel:1}).should.have.properties({pass:false,msg:'paymentConfig must be have key channel and merchant_account.'});
		util.checkPaymentConfig({channel:'yeepay',merchant_account:'test_abc_123'}).should.have.properties({pass:true,msg:'ok'});
	});
	it('#checkOrderInfo()',function(){
		util.checkOrderInfo(1).should.have.properties({pass:false,msg:'orderInfo must be Object.'});
		var keys = util.getOrderKey();
		var keysTip = 'orderInfo must be have key '+keys.join(',')+'.';
		util.checkOrderInfo({a:1}).should.have.properties({pass:false,msg:keysTip});
		util.checkOrderInfo({
			order_id:'yeepay',
			user_id:'test_abc_123',
			amount:1,
			trans_time:Date.now(),
			reg_time:Date.now(),
			return_url:'http://www.kaolalicai.cn',
			notify_url:'http://www.kaolalicai.cn',
			order_desc:'test'
		}).should.have.properties({pass:true,msg:'ok'});
	});
	it('#checkQueryInfo()',function(){
		util.checkQueryInfo(1).should.have.properties({pass:false,msg:'queryInfo must be Object.'});
		util.checkQueryInfo({a:1}).should.have.properties({pass:false,msg:'queryInfo must be have key order_id.'});
		util.checkQueryInfo({
			order_id:'yeepay',
		}).should.have.properties({pass:true,msg:'ok'});
	});
	it('#checkDomain()',function(){
		util.checkDomain('http://www.kaolalicai.cn/').should.be.equal(false);
		util.checkDomain('http://www.kaolalicai.cn').should.be.equal(true);
	});
	it('#getOrderKey()',function(){
		util.getOrderKey().should.containDeep(['order_id','user_id','amount','trans_time','reg_time','return_url','notify_url','order_desc']);
	});
});