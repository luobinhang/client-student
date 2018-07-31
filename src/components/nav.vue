<template>
  <div class="nav-left">
    <div class="nav-left-main">
      <div class="nav-menu-submenu"
           v-for="(menu,$index) in navList"
           :class="{ selected:openName == menu.name && menu.grade === 1, active:activeName == menu.title && menu.grade === 0 }">
        <p :class="`nav-${menu.name}`" @click="navChange(menu)">
          <router-link v-if="menu.link" :to="menu.link">
            {{menu.title}}
          </router-link>
          <a href="javascript:;" v-else-if="menu.grade === 1">
            {{menu.title}}
            <i class="nav-menu-arrow"></i>
          </a>
          <a href="javascript:;" v-else-if="menu.click" @click="menu.click">
            {{menu.title}}
          </a>
        </p>
        <ul v-if="menu.grade === 1" :style="openHeight(menu.name,menu.item.length)">
          <li class="nav-menu-item"
              v-for="item in menu.item"
              @click="navItemChange(item)"
              :class="{ active:activeName == item.title }">
            <router-link v-if="item.link && !item.click" :to="item.link">{{ item.title }}</router-link>
            <a href="javascript:;" v-else @click="item.click">{{ item.title }}</a>
          </li>
        </ul>
      </div>

    </div>
    <!-- 用户帮助 -->
    <Modal v-model="helpShow"
           width="570" class="helpWindow"
           class-name="vertical-center-modal"
           :transition-names="['none','none']"
           :mask-closable="false">
      <p slot="header">
        <span>用户帮助</span>
      </p>
      <p slot="close">
        <Icon type="close-round"></Icon>
      </p>
      <div class="helpWindowContent">
        <div class="help-content">
          <div class="help-main">
            <div class="help-question scrollHide">
              <ul>
                <li v-for="(item,$index) in helpMain"
                    @click="helpSelect($index)"
                    :class="{ active : helpIndex == $index }">
                  {{ item.qusetion }}</li>
              </ul>
            </div>
            <div class="help-answer">
              <ul>
                <li v-for="(item,$index) in helpMain" v-show="helpIndex == $index">
                  <span>答：</span>
                  <p v-for="(answer,index) in item.answer" class="pl">
                    {{ answer }}
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Modal>
    <!-- 退出 -->
    <Modal v-model="tipWindow" width="320" class="sign-out" @on-visible-change="tipWindowChange">
      <p slot="header">
        <span>退出提醒</span>
      </p>
      <p slot="close">
        <Icon type="close-round"></Icon>
      </p>
      <div class="tipWindow">
        <p>确定退出登录吗？</p>
      </div>
      <div slot="footer">
        <Button type="warning" @click="tipWindow = false">取消</Button>
        <Button type="warning" @click="signOutBtn">确认</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  const token = sessionStorage.getItem('token');
  export default {
    data () {
      return {
        activeName:'', //导航选择状态
        openName:'', //导航展开状态
        deviceNum:0, //设备测试点击次数
        helpMain:this.$store.state.helpMainStudent, //用户帮助内容
        helpIndex:0, //用户帮助选中下标
        helpShow:false, //用户帮助显示状态
        tipWindow: false, //提出提醒
        navList: [  //导航数据
          {
            title: '首页',
            name: 'home',
            link: '/home',
            grade: 0,
          },
          {
            title: '我的课程',
            name: 'courseManage',
            link: '',
            grade:1,
            item: [
              {title: '待上课程',link:'/courseManage/courseWait'},
              {title: '课程记录',link:'/courseManage/courseRecord'},
              {title: '我的课表',link:'/courseManage/mySchedule'},
            ],
          },
          {
            title: '个人中心',
            name: 'personal',
            link: '',
            grade:1,
            item: [
              {title: '个人信息',link:'/personal/info'},
              {title: '重置密码',link:'/personal/changePassword'},
            ],
          },
          {
            title: '设备测试',
            name: 'device',
            link: '',
            grade: 0,
            click: this.device,
          },
//          {
//            title: '设置',
//            name: 'setting',
//            link: '',
//            grade:1,
//            click: '',
//            item: [
//              {title: '意见反馈',link:'',click:this.feedback},
//              {title: '关于我们',link:'',click:this.aboutus},
//              {title: '退出登录',link:'',click:this.signOut},
//            ],
//          },
        ],
      }
    },
    beforeMount () {
      this.routerStart();
    },
    mounted () {

      let methods =  window._client_user_web_methods_;
      Object.assign(methods, {
        navSelected : () => { //c++调用导航状态
          this.routerStart();
        },
        help : () => {  //c++调用用户帮助
          this.help();
        },

      });

    },
    methods: {
      navChange(menu) { //导航切换
        if(menu.grade == 1) {
          let defaultItem = menu.item[0];
          this.openName = menu.name;
          this.activeName = defaultItem.title;
          this.$router.push(defaultItem.link);
          if(defaultItem.click) defaultItem.click();
        } else {
          this.activeName = menu.title;
          this.openName = '';
        }
      },
      navItemChange(menu) { //二级导航选中
        this.activeName = menu.title;
      },
      device () {  //设备测试
        this.deviceNum++;
        let args = `{
          "requesttype": 11,
          "messageid": ${this.deviceNum},
          "jscallback": "callbackDevice",
          "data": {
            "reserve" :""
          }
        }`
        sendData(args);
      },
      routerStart () {  //刷新页面后保持菜单栏状态
        this.activeName = this.$route.name;
        this.openName = this.$route.path.split('/')[1];
      },
      help () { //用户帮助
        this.helpShow = true;
      },
      helpSelect (index){ //用户帮助选择状态
        this.helpIndex = index;
      },
      bulletinBoardShow () { //打开公告板
        this.$store.commit("BULLETIN_BOARD","true");
      },
      feedback(){ //意见反馈
        let args = `{
          "requesttype": 16,
          "messageid": 0,
          "jscallback": "feedback"
        }`;
        sendData(args);
      },
      aboutus () { //关于我们
        let args = `{
          "requesttype": 24,
          "messageid": 0,
          "jscallback": "feedback"
        }`;
        sendData(args);
      },
      changePsw(){ //修改密码
        this.$store.commit("CHANGE_PASSWORD","true");
      },
      signOut () { //退出登录
        this.tipWindow = true;
      },
      signOutBtn () {  //确定退出
        if(device !== 'web') {
          let args = `{
            "requesttype": 14,
            "messageid": 0,
            "jscallback": "signOut",
            "data": {
              "msgbox": true
            }
          }`;
          sendData(args);
        } else {
          window.location.href = '../static/login.html';
        }
      },
      tip(){  //敬请期待
        this.$Message.info("敬请期待");
      },
      openHeight(openName,length) {  //导航展开高度计算
        if( this.openName == openName ) {
          return {
            height: length*40 + 'px',
          }
        }
      },
      tipWindowChange(res) {  //关闭退出提示窗
        if (!res) {
          this.routerStart()
        }
      }
    },
  }
</script>
<style lang="less">
  .sign-out{
    .tipWindow{
      padding: 20px 0;
      text-align: center;
    }
    button{
      margin: 0 15px !important;
      width: 100px !important;
    }
  }
</style>

