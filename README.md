<h1 align="center">request-retransmission-chrome-extensions</h1>
一个Chrome浏览器的扩展程序(chrome extension)，用于甄别网站发出的请求，将符合条件的请求响应，通过ajax转发到另一个特定地址。技术要点在于使用猴子补丁的方法改写XMLHttpRequest，从而实现在扩展程序中获取请求的responseBody的逻辑。

## Documentation

系列文章：
- [通过chrome扩展程序获取responseBody的更优方案——改写XHR（背景原理篇）](https://juejin.cn/post/7160249728137969700)
- [通过chrome扩展程序获取responseBody的更优方案——改写XHR（使用示例篇）](https://juejin.cn/post/7160249966793850910)

## Display gif (douban.com)

![display-douban.gif](https://raw.githubusercontent.com/zx69/front-end-articles/main/request-retransmission-chrome-extension/images/display-douban.gif)

## Install 插件安装

1. 从[github仓库](https://github.com/zx69/request-retransmission-chrome-extension)下载代码到本地并解压。

2. 启动Chrome浏览器，在新标签页的地址栏中输入“`chrome://extensions`”, 回车确人，进入【Chrome扩展程序】界面：

3. 因为本插件不是从Chrome应用商店下载的，所以必须以【开发者模式】加载。打开页面右上角的【开发者模式】开关：

![install-step-1.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d07c5a2f73b14803910d77a1e4958ec9~tplv-k3u1fbpfcp-watermark.image?)

此时标题栏下面出现加载选项栏：

4. 点击【加载解压的扩展程序】，弹出选择文件夹对话框.选择步骤一解压的文件夹，如`E:\github\request-retransmission-chrome-extension`, 然后点击【确定】。

5. 此时在【扩展程序】界面，可以看得插件已加载到Chrome，且浏览器地址栏右侧将出现插件图标：

![install-step-2.jpg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7cd04772c83644e5947f31007a683516~tplv-k3u1fbpfcp-watermark.image?)

插件安装完毕。

## Configuration 插件配置
1. 点击地址栏右侧的扩展程序图标，进入页面配置页。

![display-video-3.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a7990b59ecd34d4198df099f11717ddc~tplv-k3u1fbpfcp-watermark.image?)

2. 配置表单包含4个配置项，4项均为必填：
  - 【监听域名】：指插件要监听的目标网站的域名（扩展名和具体路径可省略）。配置后，请求拦截脚本将在访问该域名时注入。
  - 【监听URL】：指插件要监听的请求的URL路径（不含域名）。配置后，插件在监听到该请求发出并返回响应时，截取响应内容。
  - 【发送URL】和【请求类型】：指插件获取到目标响应后，要将该响应内容发送的目标请求的Ajax-url和method。

3. 配置后点击保存。至此配置完成。此时当执行相应操作，触发的请求中包含配置的【监听域名】和【监听URL】时，插件将截取响应内容，通过AJAX以【请求类型】发送到【发送URL】配置的请求路径上。

## Example 示例：监听WY严选的用户订单列表

1. 登录【严选官网】-【我的订单】，通过Chrome Devtools，识别出严选的订单列表接口为：`https://you.163.com/xhr/order/getList.json?xx=xx`

2. 在本地开启一个node服务器（或使用`http-server`等开箱即用的服务器包）。这里简单写一下接收逻辑如下：

```javascript
// receive-server/index.js
const http = require('http');
const fs = require('fs');

http.createServer(function(req, res) {
  let bodyStr = '';
  req.on('data', chunk => {
    bodyStr = bodyStr + chunk.toString();
  });
  req.on('end', () => {
    // 数据保存到本地
    fs.writeFileSync(`res-${Date.now()}.json`, bodyStr, 'utf-8');
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify({code:200, message: 'receive sucessfully'}));
  })
}).listen(3001);
```
3. 命令行输入`node index.js`启动node服务器监听，接受路径为`http://localhost:3001`;

4. 安装本Chrome扩展程序，步骤如上述【插件安装】和【插件配置】。在配置框输入如下：
  - 【监听域名】: `you.163.com`
  - 【监听URL】: `/xhr/order/getList.json`
  - 【发送URL】: `http://localhost:3001`
  - 【请求类型】: `POST`(大数据量，取POST)

  配置结果如下：

![example-you163-1.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f04183c592f04a6eb7adeafb7956b81d~tplv-k3u1fbpfcp-watermark.image?)

5. 重新进入【我的订单】页面，插件会拦截严选的订单接口，并将监听的特定接口的返回值转发到本地的node服务器。转发后页面右上角会出现 “receive successfully” 的预期提示.

![example-you163-2.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e45734913416418f9250b77c768e226d~tplv-k3u1fbpfcp-watermark.image?)

6. 本地的node服务器路径下会出现一个新的写入JSON文件，打开并格式化，可见就是我们原本预期的订单列表数据：

![example-you163-3.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4e7bcbf7219649f581be8c860f6fa567~tplv-k3u1fbpfcp-watermark.image?)

## Tip 要点

1. 由于采用的是改写XMMHttpReques请求，所以只适用于走Ajax方式获取的请求，也就是说后端渲染的页面（前后端未分离、SSR等）无法通过这种方法拦截。上面的例子使用WY严选来作为示范，也是出于这个原因——因为阿里、京东等老牌电商都是后端渲染的，不好拿...

2. 这是个几年前的项目了（大概19年的样子），最近写这篇文章的时候试了一下功能还是正常的，但最近的浏览器兼容性不敢保证。听说最近chrome扩展程序的manifest已经升级到V3了，因为时间有限，没有去做新版迁移，有兴趣的同学可以自己尝试。

3. 最近发现这种需求现在貌似可以借助"油猴(tempermonkey)"来注入脚本实现,不需要专门开发一个扩展程序.当时为啥没用油猴脚本呢？一个是当时好像还没有油猴扩展程序(或者名气还不显,我没听说)，二是商业合作用油猴脚本会给人一直不专业的感觉,还是开发一个扩展程序逼格高.另外扩展程序上可以设置在特定拦截页面高亮, 这样也专业点。

4. 本扩展程序因产品要求，在触发转发时右侧会给出MessageBox进行提醒，以便告知用户我们正在转发他的数据，免得他们担心我们会监听额外的请求。那个弹框写的比较糙，不需要的可以去掉。
