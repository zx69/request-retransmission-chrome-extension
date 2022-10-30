/**
 * code in inject.js
 * added "web_accessible_resources": ["myXHRScript.js"] to manifest.json
 * inject "myXHRScript.js" to content document for replacing AJAX default methods;
 */
var s = document.createElement('script');
s.src = chrome.extension.getURL('myXHRScript.js');
s.onload = function() {
  this.remove();
}; 

(document.head || document.documentElement).appendChild(s);
