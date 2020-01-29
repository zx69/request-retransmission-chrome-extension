
// 要监听的ajax请求的url
let targetUrl = '';
// 要监听的网站的域名
let targetOrigin = '';
// 拦截的响应的发送地址
let requestUrl = '';


// 初始化时获取storage保存的配置信息，保存到全局变量中
chrome.storage.sync.get(['targetUrl','targetOrigin', 'requestUrl', 'requestMethod'], function(data) {
  targetUrl = data.targetUrl;
  targetOrigin = data.targetOrigin;
  requestUrl = data.requestUrl;
  requestMethod = data.requestMethod;
});

// 通用写法：url适配时亮显page_action
// When the extension is installed or upgraded ...
chrome.runtime.onInstalled.addListener(function() {
  // Replace all rules ...
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    // With a new rule ...
    chrome.declarativeContent.onPageChanged.addRules([
      {
        // That fires when a page's URL contains a 'g' ...
        conditions: [
          // 监听域名匹配
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: targetOrigin },
          })
        ],
        // And shows the extension's page action.
        actions: [ new chrome.declarativeContent.ShowPageAction() ]
      }
    ]);
  });
});

// 修改配置项后，storage变化，触发全局变量的更新
chrome.storage.onChanged.addListener((changes) => {
  // console.log(changes);
  for(let key in changes){
    // console.log(key);
    let val = changes[key];
    window[key] = val.newValue;
  }
});

// 接收到拦截的响应，将器发送到requestUrl变量配置的地址上
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  $.ajax({
    url: requestUrl,
    type: requestMethod || 'POST',
    contentType: "application/json",
    data: JSON.stringify(request.data),
    success: (msg) => {
      console.log(msg);
      // 使用sendResponse向消息源回传响应消息
      sendResponse({
        type: Number(msg.code) === 200 ? 'success' : 'danger',
        message: msg.message
      });
    },
    error: (xhr, errorType, error) => {
      sendResponse({
        type: 'danger',
        message: `${errorType}: ${error}`,
      });
    }
  });
  // 异步响应sendMessage的写法：
  // 异步接收要求返回turn，从而使sendMessage可以异步接收回应消息
  return true;
});


chrome.pageAction.onClicked.addListener(function(tab){
  chrome.runtime.openOptionsPage(() => {
  })
})

