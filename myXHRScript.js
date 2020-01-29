/**
 * 重写ajax方法，以便在请求结束后通知content_script
 * inject_script无法直接与background通信，所以先传到content_script，再通过他传到background
 */
(function(xhr) {

  var XHR = XMLHttpRequest.prototype;

  var open = XHR.open;
  var send = XHR.send;
  var setRequestHeader = XHR.setRequestHeader;

  XHR.open = function(method, url) {
    this._method = method;
    this._url = url;
    this._requestHeaders = {};
    this._startTime = (new Date()).toISOString();

    return open.apply(this, arguments);
  };

  XHR.setRequestHeader = function(header, value) {
    this._requestHeaders[header] = value;
    return setRequestHeader.apply(this, arguments);
  };

  XHR.send = function(postData) {

    this.addEventListener('load', function() {
      var endTime = (new Date()).toISOString();

      var myUrl = this._url ? this._url.toLowerCase() : this._url;
      if(myUrl) {

        if (postData) {
          if (typeof postData === 'string') {
            try {
              // here you get the REQUEST HEADERS, in JSON format, so you can also use JSON.parse
              this._requestHeaders = postData;
            } catch(err) {
              console.log('Request Header JSON decode failed, transfer_encoding field could be base64');
              console.log(err);
            }
          } else if (typeof postData === 'object' || typeof postData === 'array' || typeof postData === 'number' || typeof postData === 'boolean') {
            // do something if you need
          }
        }

        // here you get the RESPONSE HEADERS
        var responseHeaders = this.getAllResponseHeaders();

        if ( this.responseType != 'blob' && this.responseText) {
          // responseText is string or null
          try {

            // here you get RESPONSE TEXT (BODY), in JSON format, so you can use JSON.parse
            var arr = this.responseText;

            // printing url, request headers, response headers, response body,  to console
            // console.log(this._url);
            // console.log(this);
            // console.log(JSON.parse(this.response));
            // console.log(responseHeaders);

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
