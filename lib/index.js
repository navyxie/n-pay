var request = require('request');
var NCRYPTO = require('n-crypto');
var util = require('./util');
var payPathname = '/payservice/pay';
var queryPathname = '/payservice/query';
var getpaymentPathname = '/payservice/getpayment';
function _post(url,data,cb){
	request.post({url:url,body:JSON.stringify(data)},cb);
}
function _postCb(url,data,cb){
	_post(url,data,function(error, response, body){		
		var err = null;	
		if(!error && response.statusCode === 200){
			try{
				body = JSON.parse(body);									
			}catch(e){
				err = body;						
			}
			cb(err,body);					
		}else{
			cb(error);
		}	
	});
}
function _get(url,data,cb){
	request.get({url:url,qs:data,json:true},cb);
}
function _getCb(url,data,cb){
	_get(url,data,function(error, response, body){
		if(!error && response.statusCode === 200){
			cb(null,body);		
		}else{
			cb(error);
		}	
	});
}
function _joinEncryptSign(encrypt,sign){
	return encrypt+';'+sign;
}
function NPAY(config){
	//appid,appkey,serverDomain,paymentConfig
	if(!util.isObject(config)){
		throw new Error('config must be Object.');
	}
	if(!util.isObject(config.cryptoConfig)){
		throw new Error('config key cryptoConfig must be Object.');
	}
	if(!util.isString(config.appid) || !util.isString(config.appkey)){
		throw new Error('key appid and appkey must be String.');
	}
	if(!util.checkDomain(config.serverDomain)){
		throw new Error('key serverDomain must be a correct domain.');
	}
	this.config = config;
	this.config.cryptoInstance = new NCRYPTO(this.config.cryptoConfig);
}
NPAY.prototype.pay = function(paymentConfig,orderInfo,cb){
	var _this = this;
	this._fillParam(orderInfo,this.config);
	var checkPaymentConfigResult = util.checkPaymentConfig(paymentConfig);	
	if(!checkPaymentConfigResult.pass){
		return cb(checkPaymentConfigResult.msg);
	}
	var checkOrderInfoResult = util.checkOrderInfo(orderInfo);
	if(!checkOrderInfoResult.pass){
		return cb(checkOrderInfoResult.msg);
	}
	var config = this.config;
	paymentConfig.action = 'pay';
	orderInfo.return_url = encodeURIComponent(return_url);
	orderInfo.notify_url = encodeURIComponent(notify_url);
	var reqData =  this._bindRequest(paymentConfig,orderInfo);
	_postCb(config.serverDomain+payPathname,reqData,function(err,signData){
		var resData = {};
		if(err || (util.isObject(signData) && !signData.sign && !signData.ciphertext)){
			return cb(err || JSON.stringify(signData));				
		}	
		var plaintext = _this.parse(signData.sign,signData.ciphertext,orderInfo.npay_sign_type);
		resData = plaintext.plaintext;
		resData.data = signData.data;
		if(!plaintext.verify){
			return cb('验签失败',resData);
		}	
		cb(err,resData);
	});
}
NPAY.prototype.query = function(paymentConfig,queryInfo,cb){
	var _this = this;
	this._fillParam(queryInfo,this.config);
	var checkPaymentConfigResult = util.checkPaymentConfig(paymentConfig);	
	if(!checkPaymentConfigResult.pass){
		return cb(checkPaymentConfigResult.msg);
	}
	var checkQueryInfoResult = util.checkQueryInfo(queryInfo);
	if(!checkQueryInfoResult.pass){
		return cb(checkQueryInfoResult.msg);
	}
	var config = this.config;
	paymentConfig.action = 'query'; 
	var reqData = this._bindRequest(paymentConfig,queryInfo);
	_postCb(config.serverDomain+queryPathname,reqData,function(err,signData){
		var resData = {};
		if(err || (util.isObject(signData) && !signData.sign && !signData.ciphertext)){
			return cb(err || JSON.stringify(signData));				
		}	
		var plaintext = _this.parse(signData.sign,signData.ciphertext,queryInfo.npay_sign_type);
		resData = plaintext.plaintext;
		if(!plaintext.verify){
			return cb('验签失败',resData);
		}	
		cb(err,resData);
	});
}
NPAY.prototype.parse = function(sign,ciphertext,npay_sign_type){
	sign = decodeURIComponent(sign);
	ciphertext = decodeURIComponent(ciphertext);
	var cryptoInstance = this.config.cryptoInstance;
	var plaintext =  cryptoInstance.decrypt(ciphertext,'AES',true);
	var verify = cryptoInstance.verify(plaintext,sign,npay_sign_type);
	return {
		verify:verify,
		plaintext:plaintext
	}
}
NPAY.prototype.getPayment = function(paramConfig,cb){
	if(util.isFunction(paramConfig)){
		cb = paramConfig;
		paramConfig = {};
	}
	var _this = this;
	this._fillParam(paramConfig,this.config);
	var config = this.config;
	var reqData = this._bindRequest({action:'getpayment'},paramConfig);
	_getCb(config.serverDomain+getpaymentPathname,reqData,function(err,signData){
		var resData = {};
		if(err || (util.isObject(signData) && !signData.sign && !signData.ciphertext)){
			return cb(err || JSON.stringify(signData));				
		}
		var plaintext = _this.parse(signData.sign,signData.ciphertext,paramConfig.npay_sign_type);
		resData = plaintext.plaintext;
		if(!plaintext.verify){
			return cb('验签失败',resData);
		}		
		cb(err,resData);
	});
}
NPAY.prototype.paySuccess = function(sign,ciphertext,npay_sign_type){
	var success = false;
	if(!sign || !ciphertext || !npay_sign_type){
		return {
			success:success,
			plaintext:{}
		}
	}
	var parseData = this.parse(sign,ciphertext,npay_sign_type);
	if(parseData.verify && parseData.plaintext.pay_result === '0'){
		success = true;
	}
	return {
		success:success,
		plaintext:parseData.plaintext
	}
}
NPAY.prototype.getStopNotifyData = function(){
	return 'success';
}
NPAY.prototype._fillParam = function(target,config){
	if(!util.isObject(target) || !util.isObject(config)){
		return;
	}
	target.npay_version = target.npay_version || config.npay_version;
	target.npay_sign_type = target.npay_sign_type || config.npay_sign_type;
}
NPAY.prototype._bindRequest = function(paymentConfig,params,signKeys){
	var data_signtype = 'AES';
	if(!util.isObject(params)){
		throw new Error('_bindRequest params must be object');
	}
	if(!util.isObject(paymentConfig)){
		throw new Error('paymentConfig params must be object');
	}
	var signParams = util.clone(params);
	if(util.isArray(signKeys) && signKeys.length){
		signParams = {};
		for(var i = 0 , len = signKeys.length ; i < len ; i++){
			signParams[signKeys[i]] = params[signKeys[i]];
		}
	}
	var sign_type = params.npay_sign_type;
	var config = this.config;
	var cryptoInstance = config.cryptoInstance;
	var appConfig = {appid:config.appid,appkey:config.appkey};
	var appid_appkey_data = cryptoInstance.encrypt(appConfig,data_signtype);
	var appid_appkey_sign = cryptoInstance.sign(appConfig,sign_type);
	var paymentconfig_data = cryptoInstance.encrypt(paymentConfig,data_signtype);
	var paymentconfig_sign = cryptoInstance.sign(paymentConfig,sign_type);
	var params_data = cryptoInstance.encrypt(params,data_signtype);
	var params_sign = cryptoInstance.sign(signParams,sign_type);
	return {
		appid:config.appid,
		encrypt_appconfig:_joinEncryptSign(appid_appkey_data,appid_appkey_sign),
		encrypt_paymentconfig:_joinEncryptSign(paymentconfig_data,paymentconfig_sign),
		encrypt_params:_joinEncryptSign(params_data,params_sign)
	}
}
module.exports = NPAY