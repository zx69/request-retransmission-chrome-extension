/**
 * Content script currently only used to communicate extension state on off message to myXHRScript.js
 * Sends back response to extension (popup.js) after sending message to myXHRScript.js
 */

let targetUrl = '';
let targetOrigin = '';


$(function(){
  chrome.storage.sync.get(['targetUrl','targetOrigin', 'requestUrl'], function(data) {
    // 初始化时检查配置选项是否已配置，没有则弹框提醒
    if(!data.targetOrigin){
      setTimeout(() => {
        createContentMsgNotice('warning', '请求捕获插件的配置项【监听域名】为空，请完善！');
      },1000);
      return;
    }
    if(!data.targetUrl){
      setTimeout(() => {
        createContentMsgNotice('warning', '请求捕获插件的配置项【监听URL】为空，请完善！');
      },1000);
      return;
    }
    if(!data.requestUrl){
      setTimeout(() => {
        createContentMsgNotice('warning', '请求捕获插件的配置项【发送URL】为空，请完善！');
      },1000);
      return;
    }

    targetUrl = data.targetUrl;
    targetOrigin = data.targetOrigin;

    // content_script与inject_script的消息通知通过postMessage进行
    // 监听inject_script发出的消息
    window.addEventListener("message", (e) => {
      if(!e.data || Object.keys(e.data).length === 0 ){
        return;
      }
      // 检查收到的message是否是要监听的
      if(!targetOrigin
        || e.origin.indexOf(targetOrigin) === -1
        || !targetUrl
        || !e.data.url
        || e.data.url.indexOf(targetUrl) === -1
      ){
        return;
      }
      let responseDataList = null;
      // 使用try-catch兼容接收到的message格式不是对象的异常情况
      try{
        responseDataList = JSON.parse(e.data.response);
        // 发消息给background.js，并接收其回复
        chrome.runtime.sendMessage({data: responseDataList}, {}, function(res){
          // 收到回复后在页面弹出提醒
          createContentMsgNotice(res.type, res.message);
        })
      }catch(e){
        alert('获取的数据有误，请联系管理员！');
      }

    }, false);
  });
});

