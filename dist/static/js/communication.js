/*
 *
 * @客户端通信
 *
 * @params requesttype
 * {
 *   0 : 客户端首页调用c++回调获取token,
 *   2 : 进入房间,
 *   5 : 房间内调用c++回调获取token,
 *   8 : 打开课件
 *   9 : 学习力测评,
 *   10: 退出登录,
 *   11: 设备测试,
 *   12: 调用C++上传课件
 *   13: 打开默认浏览器
 *   14: 重新登录
 *   15: 获取课件列表
 *   16: 意见反馈
 *   17: 技术支持接入
 *   18: 远程协助
 *   19: 学生待评价
 *   20: 学生查看评价
 *   21: 学生正式课查看老师反馈
 *   22: 老师填写反馈
 *   23: 老师查看反馈
 *   24: 关于我们
 *   25: 上传图片（mac）
 *   26: 进入我的课件（mac）
 *   27: 离开我的课件（mac）
 *   28: 返回登录
 *   29: 打开下载列表
 *   30: 关闭下载列表
 *   31: 下载 （Mac）
 *   32: 404获取URL
 *   33: 跳转404页面
 *   34: 头像url通知
 *   35: 课件预加载
 *
 * }
 *
 * */


  // 调用QC客户端

  var device = sessionStorage.getItem('device');

  function sendData(command) {
    if(device == 'mac') {
      window.webkit.messageHandlers.sendData.postMessage(command);
    } else {
      if (typeof(QCefClient) == 'undefined') {
        return;
      } else {
        QCefClient.invokeMethod("callClientFun",command);
        QCefClient.addEventListener("uploadCallback", uploadCallback);
        QCefClient.addEventListener("refreshCallback", refreshCallback);
        QCefClient.addEventListener("enterCallback", enterCallback);
        QCefClient.addEventListener("downloadNum", downloadNum);
        QCefClient.addEventListener("navSelected", navSelected);
        QCefClient.addEventListener("help", help);
        QCefClient.addEventListener("tipNull", tipNull);
      }
    }
  };

  if(device != 'mac') {
    sendData();
  }



  // 客户端调用上传过程回调
  function uploadCallback(res){
    return window._client_user_web_methods_.uploadProgess(res);
  }

  // 客户端调用进入教室回调
  function enterCallback(res){
    return window._client_user_web_methods_.enterProgess(res);
  }


  // 客户端调用刷新回调
  function refreshCallback(res){
    return window._client_user_web_methods_.refresh(res);
  }


  // 复制
  function copyText () {
    return window._client_user_web_methods_.copyText();
  }


  // 跳转课件
  function goCourseware () {
    return window._client_user_web_methods_.goCourseware();
  }

  // 上传图片
  function uploadImg (type,imgUrl,fileName) {
    return window._client_user_web_methods_.uploadImg(type,imgUrl,fileName);
  }

  // 获取课件列表
  function getCourseware () {
    return window._client_user_web_methods_.getCourseware();
  }

  // 下载数量
  function downloadNum (res) {
    return window._client_user_web_methods_.downloadNum(res);
  }

  // 导航选中
  function navSelected () {
    return window._client_user_web_methods_.navSelected();
  }

  // 禁止导航
  function navBan (res) {
    return window._client_user_web_methods_.navBan(res);
  }

  // 用户帮助
  function help (res) {
    return window._client_user_web_methods_.help(res);
  }

  // 敬请期待
  function tipNull () {
    return window._client_user_web_methods_.tipNull();
  }



