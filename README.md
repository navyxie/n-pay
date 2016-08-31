# 支付服务

[![Build Status via Travis CI](https://travis-ci.org/navyxie/n-pay.svg?branch=master)](https://travis-ci.org/navyxie/n-pay) [![Coverage Status](https://coveralls.io/repos/github/navyxie/n-pay/badge.svg?branch=master)](https://coveralls.io/github/navyxie/n-pay?branch=master)

*目前支持连连支付、易宝支付、pp钱支付、闪豆支付、汇付托管支付。类似ping++*

## [注意发布logs,新增汇付支付,函数传参有所不同](#publish_log)


## 安装

    npm install n-pay
    
## 初始化

    var nPay = require('n-pay');
    var PAY = nPay({
    	appid:'your appid',
    	appkey:'your appkey',
    	serverDomain:'http://pay.kaolalicai.cn',
    	npay_version:'1.0',
    	npay_sign_type:'RSA',
    	cryptoConfig:{
			'md5_key':'',//md5 key
			'des_key':'',//des key,24个字符长度
			'aes_key':'',//aes key,16个字符长度
			'merchant_pri_key':'',
			'npay_pub_key':''
    	}
	})
    //appid,appkey请向广州财略金融信息科技有限公司申请

## API

[`pay`](#pay)

[`query`](#query)

[`getPayment`](#getPayment)

[`paySuccess`](#paySuccess)

[`getStopNotifyData`](#getStopNotifyData)

<a name="pay" />

##获取支付内容（html或者url）

### pay(paymentConfig,orderInfo,cb)
- paymentConfig(object):支付渠道配置，配置channel和merchant_account，
- orderInfo(object)：订单信息，必须包含字段:'order_id','user_id','amount','trans_time','reg_time','return_url','notify_url','order_desc';idcard,card_no,acct_name为可选
- cb(function):回调函数：err,data;data为objec,code为0时表示成功获取支付内容，data:支付内容，notify_url：服务异步回调地址(native app需要用到)

```js
PAY.pay(
    {
		channel:'pay channel ,such as yeepay',
		merchant_account:'your pay channel account'
    },
    {
		'order_id':"abc_test",//订单id,长度必须小于等于32位
		'user_id':"abc_user",//用户在商户系统中的id
		'amount':0.01,//支付金额，元为单位
		'trans_time':Date.now(),//交易时间（时间戳）
		'reg_time':Date.now(),//用户在商户系统中的注册时间（时间戳）
		'return_url':"http://www.kaolalicai.cn",//支付结果跳转页（同步）
		'notify_url':"http://www.kaolalicai.cn",//支付结果通知地址（异步），只有支付成功才会像这个地址post数据
		'order_desc':"test pay",//订单描述
		'idcard':'',
		'card_no':'',
		'acct_name':'',
		'reg_phone':'user register phone'//用户在商户系统中注册的手机号（channel为ppwallet时必传）
    },
    function(err,data){
        if(!err && data.code === 0){
			//todo,这里为支付的内容(url或一段html的form表单)
			//web段使用例子：
			//var data = data.data;
			// if(/^http/.test(data)){
			// 	window.location.href = data;
			// }else{
			// 	document.getElementsByTagName('body')[0].innerHTML = data;
			// 	document.forms[0].submit();
			// }
        }else{
			//todo,请求失败
        }
    }
)
```

<a name="query" />

## 查询订单是否支付成功

### query(paymentConfig,queryInfo,cb)
- paymentConfig(object):支付渠道配置，配置channel和merchant_account，
- queryInfo(object)：订单信息，必须包含字段:'order_id',
- cb(function):回调函数：err,data;data为objec,code为0时表示订单支付成功。

**需要注意的是，pp钱包目前没有查询订单的接口，当code为-2时，需要去pp钱包后台确认订单最终支付情况。** 

```js
PAY.query(
    {
		channel:'pay channel ,such as yeepay',
		merchant_account:'your pay channel account'
    },
    {
		'order_id':"abc_test"
    },
    function(err,data){
        if(!err){
			if(data.code === 0){
				//todo,支付成功，商户可以进行订单更新或者发货了。
			}else if(data.code === -2){
				//todo,支付成功，但是需要去第三方支付平台确认最终支付情况。
			}else{
				//todo.支付不成功。
			}
        }else{
			//todo,请求失败
        }
    }
)
```

<a name="getPayment" />

## 获取系统中支持的支付渠道

### getPayment(cb)
- 返回结果为json格式数据
- 返回json包含字段code,data，code 为0表示获取成功，其他则为失败。data为string

```js
PAY.getPayment(
	function(err,data){
		if(!err){
			if(data.code){
				console.log(data.data);//string ,'yeepay,llpay,ppwallet'
			}
		}
	}
)
```


<a name="paySuccess" />

## 回调处理（格式为json,包涵sign和ciphertext字段）

### 异步回调(post请求,带有参数sign,ciphertext)

### 同步回调(get请求,带有参数sign,ciphertext)

**解密后的数据plaintext:plaintext.pay_result为字符串0表示支付成功**

```js
var parseData = PAY.paySuccess(sign,ciphertext,npay_sign_type);
if(parseData.success){
	//todo,可以发货了
	//订单详细信息,parseData.plaintext
	//res.send(PAY.getStopNotifyData())
}

```

<a name="getStopNotifyData" />

## 终止回调


```js
res.send(PAY.getStopNotifyData())
```

**当商户接收回调后，返回一段非空字符串，比如success将会终止回调**


<a name="publish_log" />
## 发布logs

- npay_version:2.0

  > 2.0以上版本支持汇付支付,`npay_version`传值2.0
  >
  > 获取终止异步回调的字符串需传入第三方返回的原始数据,即接口:`getStopNotifyData`
  >
  > 汇付支付的时候需要传用户在汇付开户的用户客户号,即`third_user_id`字段,对应汇付原始字段`UsrCustId`
  >
  > 为适配汇付订单查询,查询接口新增字段queryTransType,充值订单为`SAVE`,提现订单为`CASH`
