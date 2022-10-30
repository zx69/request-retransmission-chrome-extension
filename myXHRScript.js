/**
 * 重写ajax方法，以便在请求结束后通知content_script
 * inject_script无法直接与background通信，所以先传到content_script，再通过他传到background
 */
(function(xhr) {
  var XHR = xhr.prototype;
  var open = XHR.open;
  var send = XHR.send;

  // 对open进行patch 获取url和method
  XHR.open = function(method, url) {
    this._method = method;
    this._url = url;
    return open.apply(this, arguments);
  };
  // 同send进行patch 获取responseData.
  XHR.send = function(postData) {
    this.addEventListener('load', function() {
      var myUrl = this._url ? this._url.toLowerCase() : this._url;
      if(myUrl) {
        if ( this.responseType != 'blob' && this.responseText) {
          // responseText is string or null
          try {
            var arr = this.responseText;

            // 因为inject_script不能直接向background传递消息, 所以先传递消息到content_script
            window.postMessage({'url': this._url, "response": arr}, '*');
          } catch(err) {
            console.log(err);
            console.log("Error in responseType try catch");
          }
        }
      }
    });
    return send.apply(this, arguments);
  };
})(XMLHttpRequest);
