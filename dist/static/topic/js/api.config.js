
var host = window.location.host,
  API = 'https://getaway.onlyeduhi.cn/crm/courseware';
if(host === 'clteacher.onlyhi.cn' || host === 'clstudent.onlyhi.cn') {  //正式环境
  API = 'https://hkt.onlyhi.cn/crm/courseware';
} else if(host === 'localhost:8085' || host === 'localhost:8086') {  //正式环境
  // API = 'http://clienttest.haiketang.net';
  API = 'http://172.16.20.96:8115';
} else {
  API = 'https://getaway.onlyeduhi.cn/crm/courseware';
  // API = 'http://172.16.20.96:8115';

}


function goPAGE() {
  if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {

  } else {
    if(location.pathname.indexOf('result.html') === -1) {
      window.location.href = "./web/index.html";
    } else {
      window.location.href = "./web/result.html" + location.search;
    }
  }
}

goPAGE();
