# 支付服务

## 安装

    npm install n-pay
    
## 初始化

    var n-pay = require('n-pay');
    var nPay = new n-pay({appid:'your appid',appkey:'your appkey',serverDomain:'server url'})

## API

[`pay`](#pay)

[`query`](#query)

<a name="pay" />
### pay(paymentConfig,orderInfo,cb)
- paymentConfig(object):支付渠道配置，配置channel和merchant_account，
- orderInfo(object)：订单信息，必须包含字段:'order_id','user_id','amount','trans_time','reg_time','return_url','notify_url','order_desc',
- cb(function):回调函数：err,data.data为objec,code为0时表示成功获取支付内容，data:支付内容，notify_url：服务异步回调地址(native app需要用到)

```js
nPay.pay(
    {
		channel:'pay channel ,such as yeepay',
		merchant_account:'your pay channel account'
    },
    {
		'order_id':"abc_test",//订单id
		'user_id':"abc_user",//用户在商户系统中的id
		'amount':0.01,//支付金额，元为单位
		'trans_time':Date.now(),//交易时间（时间戳）
		'reg_time':Date.now(),//用户在商户系统中的注册时间（时间戳）
		'return_url':"http://www.kaolalicai.cn",//支付结果跳转页（同步）
		'notify_url':"http://www.kaolalicai.cn",//支付结果通知地址（异步），只有支付成功才会像这个地址post数据
		'order_desc':"test pay"//订单描述
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
### query(paymentConfig,queryInfo,cb)
- paymentConfig(object):支付渠道配置，配置channel和merchant_account，
- queryInfo(object)：订单信息，必须包含字段:'order_id',
- cb(function):回调函数：err,data.data为objec,code为0时表示订单支付成功。

需要注意的是，pp钱包目前没有查询订单的接口，当code为-2时，需要去pp钱包后台确认订单最终支付情况。 

```js
nPay.query(
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
