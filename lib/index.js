var util = require('./util');
var request = require('request');
var payPathname = '/payservice/pay';
var queryPathname = '/payservice/query';
function _post(url,data,cb){
	request.post({url:url,body:JSON.stringify(data)},cb);
}
function _cb(url,data,cb){
	_post(url,data,function(error, response, body){
		if(!error && response.statusCode === 200){
			try{
				body = JSON.parse(body);
				cb(null,body);
			}catch(e){
				cb(body);
			}			
		}else{
			cb(error);
		}	
	});
}
function NPAY(config){
	//appid,appkey,serverDomain,paymentConfig
	if(!util.isObject(config)){
		throw new Error('config must be Object.');
	}
	if(!util.isString(config.appid) || !util.isString(config.appkey)){
		throw new Error('key appid and appkey must be String.');
	}
	if(!util.checkDomain(config.serverDomain)){
		throw new Error('key serverDomain must be a correct domain.');
	}
	this.config = {
		appid:config.appid,
		appkey:config.appkey,
		serverDomain:config.serverDomain
	};
}
NPAY.prototype.pay = function(paymentConfig,orderInfo,cb){
	var checkPaymentConfigResult = util.checkPaymentConfig(paymentConfig);	
	if(!checkPaymentConfigResult.pass){
		return cb(checkPaymentConfigResult.msg);
	}
	var checkOrderInfoResult = util.checkOrderInfo(orderInfo);
	if(!checkOrderInfoResult.pass){
		return cb(checkOrderInfoResult.msg);
	}
	var config = this.config;
	var reqData = {
		appid:config.appid,
		appkey:config.appkey,
		paymentConfig:{
			channel:paymentConfig.channel,
			merchant_account:paymentConfig.merchant_account,
			action:'pay'
		},
		params:orderInfo
	}
	_cb(config.serverDomain+payPathname,reqData,cb);
}
NPAY.prototype.query = function(paymentConfig,queryInfo,cb){
	var checkPaymentConfigResult = util.checkPaymentConfig(paymentConfig);	
	if(!checkPaymentConfigResult.pass){
		return cb(checkPaymentConfigResult.msg);
	}
	var checkQueryInfoResult = util.checkQueryInfo(queryInfo);
	if(!checkQueryInfoResult.pass){
		return cb(checkQueryInfoResult.msg);
	}
	var config = this.config;
	var reqData = {
		appid:config.appid,
		appkey:config.appkey,
		paymentConfig:{
			channel:paymentConfig.channel,
			merchant_account:paymentConfig.merchant_account,
			action:'query'
		},
		params:queryInfo
	}
	_cb(config.serverDomain+queryPathname,reqData,cb);
}
module.exports = NPAY