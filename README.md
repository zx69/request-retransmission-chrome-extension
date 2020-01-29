# request-retransmission-chrome-extensions
chrome响应拦截器，拦截指定的ajax请求的响应内容，将其发送到我方系统中使用。用于叉车系统拦截菜鸟WMS数据

# 要点：
1. 拦截器的目标网址等信息做成可配置的，方便后面的移植。
2. 出于安全的要求，chrome的onRequest拦截器拦截到的内容只有响应头，而不包含response-body。为了实现获取response-body, 采用改写ajax的方式，用inject_script重写ajax方法并注入到页面中，覆盖浏览器原本的ajax方法。
3. inject_script拦截后发送到content_script， content_script再发送到backgrond, 有background发出请求。
4. 自写msgNotice，用于在页面中弹出提醒


