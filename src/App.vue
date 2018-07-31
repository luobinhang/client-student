<template>
  <div id="app">
    <div class="warpper">
      <headerTop v-if="device === 'web'"></headerTop>
      <div class="container">
        <navBar></navBar>
        <div class="section">
          <div class="content">
            <transition :name="transitionName">
              <router-view></router-view>
            </transition>
            <loading v-if="fetchLoading == 'true'"></loading>
            <!--<error v-if="fetchError == 'true'"></error>-->
          </div>
        </div>
      </div>
    </div>
    <!--<changePsw v-if="fetchChangePsw == 'true'" class="changePswMain"></changePsw>-->
    <!--<bulletinBoard v-if="fetchBulletinBoard == 'true'" class="bulletinBoard"></bulletinBoard>-->
  </div>

</template>


<script>
  import { mapGetters } from 'vuex';
  import headerTop from './components/header';
  import navBar from './components/nav';
  import loading from './components/loading';
//  import changePsw from './components/changePassword';
//  import bulletinBoard from './components/bulletinBoard';

  const device = sessionStorage.getItem('device');
  export default {
  name: 'app',
  data () {
    return {
      routerName:'',
      transitionName: 'vux-pop-in',
      position:false,
      name:'',
      device:device,
    }
  },
  watch: {
    '$route' (to, from) {
      this.routerName = to.path.split('/')[1];
      this.name = to.name;
      const toDepth = to.path.split('/').length;
      const fromDepth = from.path.split('/').length;
      this.transitionName = toDepth < fromDepth ? 'vux-pop-out' : 'vux-pop-in';
    },
  },
  mounted () {
//    this.uploadShow();
    this.headerNav();
    this.isFirst();

    let methods =  window._client_user_web_methods_;
    Object.assign(methods, {
      goCourseware : () => {
//        this.$router.push('/coursewareManage/myCourseware');
      }
    });

    document.body.ondragstart=function(){window.event.returnValue=false;}
  },
  computed:{
    ...mapGetters([
      'fetchLoading',
//      'fetchChangePsw',
//      'fetchBulletinBoard',
    ]),
  },
  methods : {
    headerNav () {
      this.routerName = this.$route.path.split('/')[1];
    },
    isFirst () {
      const isFirst = sessionStorage.getItem('isFirst');
      if(isFirst == "true") {
//        this.$store.commit("CHANGE_PASSWORD","true");
        this.$router.push('/personal/changePassword');
        navSelected();

      }
    },
  },
  components:{
    headerTop,
    navBar,
    loading,
//    changePsw,
//    bulletinBoard,
  },
}
</script>

<style lang="less">
  @import './style/common.less';
</style>
