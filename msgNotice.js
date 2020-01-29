// 元素实例集合
let contentMsgNoticeInstances = [];
// 用于定义ID时保存当前值，避免重复
let seed = 1;

/**
 * @desc 元素构造函数
 * @param {*} type 类型 success/error
 * @param {*} content 文本提示内容
 */
let ContentMsgNotice = function(type, content) {
  this.id = seed ++;
  this.top = 14;
  this.calcTop();
  this.$node = $(this.buildTemplate(type, content));
  // this.removeTimer = null;
  this.$closeBtn = this.$node.find('.ext__msgNotice__close');
  this.init();
};
// 构建元素HTML
ContentMsgNotice.prototype.buildTemplate = function(type, content) {
  return (`
    <div class="ext__msgNotice ${type}" style="top: ${this.top ? `${this.top}px` : 'auto'}">
       <svg class="ext__msgNotice__icon" t="1542883595740" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1928" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24">
        <path d="M512 0c282.765641 0 512 229.221757 512 512S794.765641 1024 512 1024 0 794.765641 0 512 229.221757 0 512 0z m0 687.375437A77.537189 77.537189 0 1 0 589.537189 764.912626a77.537189 77.537189 0 0 0-77.537189-77.537189z m-2.23047-60.61334a66.788088 66.788088 0 0 0 66.788088-66.788088V248.325671a66.788088 66.788088 0 0 0-133.576176 0v311.66094a66.788088 66.788088 0 0 0 66.788088 66.788087z" p-id="1929"></path>
       </svg>
      <div class="ext__msgNotice__content">
        ${content}
      </div>
      <div class="ext__msgNotice__close">
        &times;
      </div>
    </div>
  `)
};

/**
 * @desc 计算元素高度，避开当前已有的元素，放到下面，避免覆盖
 */
ContentMsgNotice.prototype.calcTop = function() {
  let topDist = this.top;
  for (let i = 0, len = contentMsgNoticeInstances.length; i < len; i++) {
    // 元素间距14
    topDist += contentMsgNoticeInstances[i].$node[0].offsetHeight + 14;
  }
  this.top = topDist;
};

/**
 * @desc 元素初始化
 */
ContentMsgNotice.prototype.init = function() {
  this.$closeBtn.on('click', () => this.removeNode());
  $(document.body).append(this.$node);
  setTimeout(() => {
    this.$node.addClass('show');
    // 4秒后元素触发
    setTimeout(() => this.removeNode(), 400000)
  }, 100);
};

/**
 * @desc 移除元素
 */
ContentMsgNotice.prototype.removeNode = function(){
  this.$node.removeClass('show');
  // 重点：使用transitionend监听动画停止
  this.$node.bind('transitionend', () => {
    this.$node.remove();
  });
  let index;
  let removedHeight; // 移除元素的高度
  let len = contentMsgNoticeInstances.length;
  for (let i = 0; i < len; i++) {
    if (this.id === contentMsgNoticeInstances[i].id) {
      index = i;
      removedHeight = contentMsgNoticeInstances[i].$node[0].offsetHeight;
      contentMsgNoticeInstances.splice(i, 1);
      break;
    }
  }
  // 现有元素的定位减去removedHeight，整体上移效果
  if (len > 1) {
    for (i = index; i < len - 1 ; i++) {
      contentMsgNoticeInstances[i].$node[0].style.top = parseInt(contentMsgNoticeInstances[i].$node[0].style.top, 10) - removedHeight - 14 + 'px';
    }
  }
};

/**
 * @desc 新建元素
 * @param {*} type
 * @param {*} content
 */
let createContentMsgNotice = (type, content) => {
  let instance = new ContentMsgNotice(type, content);
  contentMsgNoticeInstances.push(instance);
  return instance;
}


