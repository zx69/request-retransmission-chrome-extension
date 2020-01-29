$(() => {
  let $btnAddURL = $('#btnAddURL');
  let $formContent = $('#formContent');
  let $targetOriginInput = $('#targetOriginInput')
  let $targetUrlInput = $('#targetUrlInput')
  let $requestUrlInput = $('#requestUrlInput')
  let $btnSubmit = $('#btnSubmit')
  let $requestMethodSet = $('input[name=requestmethod]');

  

  // 打开配置页时，将表单项赋值
  chrome.storage.sync.get(['targetUrl','targetOrigin', 'requestUrl', 'requestMethod'], function(data) {
    $targetUrlInput.val(data.targetUrl);
    $targetOriginInput.val(data.targetOrigin);
    $requestUrlInput.val(data.requestUrl);
    $requestMethodSet.filter(`[value="${data.requestMethod || 'POST'}"]`).attr('checked', true);
  });

  // 提交
  $btnSubmit.on('click', (event) => {
    // console.log({
    //   targetUrl: $targetUrlInput.val(),
    //   targetOrigin: $targetOriginInput.val(),
    //   requestUrl: $requestUrlInput.val(),
    //   requestMethod: $requestMethodSelect.val(),
    // });
    chrome.storage.sync.set({
      targetUrl: $targetUrlInput.val(),
      targetOrigin: $targetOriginInput.val(),
      requestUrl: $requestUrlInput.val(),
      requestMethod: $requestMethodSet.filter(':checked').val(),
    }, function () {
      // 提交后重载页面，使配置生效
      chrome.runtime.reload();
    })
  })
});

