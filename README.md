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
- cb(function):回调函数：er,data.data为objec,code为0时表示成功获取支付内容，data:支付内容，notify_url：服务异步回调地址(native app需要用到)

```js
nPay.pay(
    {
        channel:'pay channel ,such as yeepay',
        merchant_account:'your pay channel account'
    },
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
        if(!err && data.code === 0){
            //todo,这里为支付的内容(url或一段html的form表单)
            //web段使用例子：
            //var data = data.data;
            //if(/^http/.test(data)){
			//	window.location.href = data;
			//}else{
			//	document.getElementsByTagName('body')[0].innerHTML = data;
			//	document.forms[0].submit();
			//}
        }
    }
)
```

<a name="query" />
### query
