# request-retransmission-chrome-extensions
Chrome浏览器的扩展程序，用于甄别网站发出的请求，并将符合条件的请求响应通过ajax转发到另一个特定地址。

本项目为公司业务需要而开发，实际使用场景为：公司开发的系统需要使用菜鸟物流的实时订单数据，而又没有菜鸟物流的登录权限，因此采用变通方案，在有此权限的客户电脑上加载该插件，之后当该客户访问菜鸟系统时，可直接甄别出获取订单的请求，并将其响应结果转发到我司的系统上。

### 主要技术要点：
1. 出于安全的要求，chrome的onRequest拦截器拦截到的内容只有响应头，而不包含response-body。查了很多资料后，采用一个比较巧妙的方法——重写ajax。用inject_script重写ajax方法并注入到页面中，覆盖浏览器原本的ajax方法，从而获取到response-body.
2. 根据需求，初始化未配置时，以及转发成功后，需要弹框提醒。因个人最近在用[ElementUI](https://github.com/ElemeFE/element)，比较熟悉，所以自己用原生JS重写了[Element-Notice](https://element.eleme.cn/2.6/#/zh-CN/component/notification)(不依赖Vue).


