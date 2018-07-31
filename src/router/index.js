import Vue from 'vue';
import Router from 'vue-router';


/*
 *
 * 公共组件
 *
 * */
import Home from '@/page/public/Home'; //首页


/*
 *
 * 课程管理
 *
 * */
import courseWait from '@/page/courseManage/courseWait'; //待上课程
import mySchedule from '@/page/courseManage/mySchedule'; //我的课表
import courseRecord from '@/page/courseManage/courseRecord'; //课程记录


/*
*
* 个人中心
*
* */
import info from '@/page/personal/info'; //个人信息
import changePassword from '@/page/personal/changePassword'; //个人信息


export default new Router({
  mode:'hash',
  routes: [
    // ----------------------公共路由
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      name: '首页',
      component: Home,
    },
    // ----------------------课程管理
    {
      path: '/courseManage/courseWait',
      name: '待上课程',
      component: courseWait,
    },
    {
      path: '/courseManage/mySchedule',
      name: '我的课表',
      component: mySchedule,
    },
    {
      path: '/courseManage/courseRecord',
      name: '课程记录',
      component: courseRecord,
    },
    // ----------------------个人中心
    {
      path: '/personal/info',
      name: '个人信息',
      component: info,
    },
    {
      path: '/personal/changePassword',
      name: '重置密码',
      component: changePassword,
    },
  ]
});

Vue.use(Router);
