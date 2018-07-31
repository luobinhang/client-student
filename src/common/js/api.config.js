
/**
 * Created by Binhang Luo on 2018/4/10.
 * API接口地址
 */

import store from '../../store/store';


/*
 *
 * @公共API
 *
 * API    客户端接口地址
 * webAPI websocket地址
 *
 * */

export default function apiBase(type) {
  let host = window.location.host,
    API = 'http://clienttest.haiketang.net',
    webAPI = "clienttest.haiketang.net";
  if(host === 'clstudent.onlyhi.cn') {  //正式环境
    API = 'http://client.onlyhi.cn';
    webAPI = "client.onlyhi.cn";
  } else if(host === 'localhost:8085') {//本地测试环境
    // API = 'http://192.168.0.15:20003';
    API = 'http://clienttest.haiketang.net';
    webAPI = "clienttest.haiketang.net";
  } else if (host === 'localhost:8086') {//本地测试环境
    // API = 'http://192.168.0.15:20003';
    API = 'http://clienttest.haiketang.net';
    webAPI = "clienttest.haiketang.net";
  } else if (host === 'localhost:8087') {//本地测试环境
    // API = 'http://192.168.0.15:20003';
    API = 'http://clienttest.haiketang.net';
    webAPI = "clienttest.haiketang.net";
  }

  let API_BASE_URL = type == 'webAPI'? webAPI : API;

  return API_BASE_URL;
}



//webSocket
store.state.socket = 'ws://'+ apiBase('webAPI') +':20027/ws'; //上传课件长连接
store.state.socket2 = 'ws://'+ apiBase('webAPI') +':20035/ws'; //上传课件长连接

//公共API
store.state.timestamp = '/common/serverTime'; //获取服务器时间戳
store.state.getCourseRoom = '/client/course/iosGetCourseRoom'; //进入房间
store.state.getUserPhone = '/client/user/getUserPhone'; //获取用户手机
store.state.getAuthCode = '/client/user/sendAuthCode'; //获取验证码
store.state.resetpsd = '/client/user/resetpsdByJson'; //重置密码
store.state.getAllProvince = '/common/getAllProvince'; //获取省
store.state.getCity = '/common/getCitysByProvinceCode'; //获取市
store.state.getArea = '/common/getDistrictsByCityCode'; //获取区
store.state.getSubject = '/common/getAllSubject'; //获取年级偏好


//新教师端API
store.state.viewTeacherAppraise = '/teacher/viewTeacherAppraise'; //查看反馈


//学生端API
store.state.baseInfo = '/student/baseInfo'; //学生个人信息
store.state.classTime = '/student/classTime'; //课时信息
store.state.courseCalendar = '/student/courseCalendar'; //课程日历
store.state.findCourseListByDate = '/student/findCourseListByDate'; //根据日期查看课程
store.state.sign = '/student/sign'; //根据日期查看课程
store.state.todayNoEndCourseList = '/student/todayNoEndCourseList'; //课程提醒
store.state.getNoEndCourseList = '/student/getNoEndCourseList'; //待上课程
store.state.getCourseRecordList = '/student/getCourseRecordList'; //课程记录
store.state.studentViewAppraise = '/client/course/viewAppraise'; //查看评价
store.state.courseSchedule = '/student/courseSchedule'; //课表
store.state.info = '/student/info';

