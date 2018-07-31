<template>
  <div class="home-class-tip">
    <div class="home-class-tip-main">
      <h2>课程提醒</h2>
      <div class="home-class-tip-table">
        <div class="home-class-tip-list" v-if="todayClassTip.length">
          <div class="home-class-tip-item"
               v-for="(item,$index) in todayClassTip"
               :class="subjectClass(item.subject)">
            <div class="home-class-tip-subject">{{ item.subject }}</div>
            <div class="home-class-tip-detail">
              <p>老师：{{ item.teacherName }}</p>
              <p>
                <span style="margin-right: 14px">{{ item.courseDate.replace(/-/g,'/') }}</span>
                <span>{{ item.startTime }} - {{ item.endTime }}</span>
              </p>
            </div>
            <div class="home-class-tip-btn">
              <Button type="warning" v-if="item.enter" @click="start($index,item.courseUuid,item)">进入教室</Button>
            </div>
          </div>
        </div>
        <div class="classTipNull tip-null" v-else>
          <img src="../assets/teacher/null.png" alt="null">
          <span class="tip-null-text">暂无课程提醒哦~</span>
        </div>
      </div>
    </div>

    <Modal v-model="enterWindow" width="320" class="enterWindow">
      <p slot="header">
        <span>进入教室</span>
      </p>
      <p slot="close">
        <Icon type="close-round"></Icon>
      </p>
      <div class="enterWindowImg" v-if="enterType === 0">
        <img src="../assets/teacher/loadingMain.gif"/>
      </div>
      <div class="enterWindowText" v-else-if="enterType === 1">
        <Icon type="checkmark-circled"></Icon>进入教室成功！
      </div>
      <div class="enterWindowError" v-else-if="enterType === 2">
        <p>进入教室失败！</p>
        <Button type="primary" @click="start(startIndex,startUuid,startItem)">重新进入</Button>
        <div>若长时间不能进入教室，请检查网络或者联系班主任
        </div>
      </div>
      <p slot="footer"></p>
    </Modal>
  </div>
</template>

<script>
  import { timestamp } from '@/common/js/common';
  let interval = new Array(); //定时器集合
  export default {
    data () {
      return {
        todayClassTip:[], //今天课程提醒
        todayNoEndCourseList:this.$store.state.todayNoEndCourseList, //今天课程提醒接口
        enterWindow:false,  //进入教室弹窗
        enterType:null, //进入状态
        startIndex:null, //进入下标
        startUuid:null, //进入教室ID
        startItem:null, //进入教室数据
      }
    },
    mounted () {
      timestamp().then(({timestamp}) => {
        this.getClassTip(timestamp);
      });

      let methods =  window._client_user_web_methods_;
      Object.assign(methods, {
        enterProgess : res => {
          let as = JSON.parse(res["args"]).state;
          this.enterWindow = true;
          this.enterType = as;
        }
      });

    },
    methods: {
      getClassTip(timestamp) { //课程提醒
        this.$axios.get(this.todayNoEndCourseList)
          .then(({data}) => {
            this.todayClassTip = data.data;
            if( this.todayClassTip.length ) {
              for(let i = 0,length = this.todayClassTip.length;i < length;i++) {
                let list = this.todayClassTip[i];
                Object.assign(list, { enter: false });
                let ISOtime = `${list.courseDate.replace(/-/g,'/')} ${list.startTime}`;
                let second = (new Date(ISOtime).getTime() - timestamp)/1000;
                if(second <= 1200) { //小于20分钟可以进入教室
                  Object.assign(list, { enter: true });
                } else {
                  interval[i] = setInterval(()=>{
                    second--;
                    if(second <= 1200){
                      clearInterval(interval[i]);
                      Object.assign(list, { enter: true });
                    }
                  },1000)
                }
              }
            }
          })
      },
      start($index, uuid, item) {  //进入房间
        this.startIndex = $index;
        this.startUuid = uuid;
        this.startItem = item;
        this.$axios({
          method: "post",
          url: this.$store.state.getCourseRoom,
          data: {
            'courseUuid': uuid,
          },
        }).then( res => {
          let data = res.data.data;
          let args = `{
            "requesttype": 2,
            "messageid": ${$index},
            "jscallback": "coursewareClassback",
            "data": {
              "commchannelid": "${data.commChannelId}",
              "signallingchannelid": "${data.signallingChannelId}",
              "recordId": "${data.recordId}",
              "courseType": "${data.courseType}",
              "courseUuid": "${uuid}",
              "tabId": ${this.startIndex},
              "value": ${JSON.stringify(item)}
            }
          }`
          sendData(args);
        })
      },
      subjectClass (subject) {
        if(subject == '数学') {
          return 'sx'
        } else if(subject == '英语') {
          return 'yy'
        } else if(subject == '生物') {
          return 'sw'
        } else if(subject == '地理') {
          return 'dl'
        } else if(subject == '政治') {
          return 'zz'
        } else if(subject == '物理') {
          return 'wl'
        } else if(subject == '化学') {
          return 'hx'
        } else if(subject == '历史') {
          return 'ls'
        } else if(subject == '科学') {
          return 'kx'
        } else {
          return 'yw'
        }
      },
    },
    destroyed () {
      for(let i of interval){
        clearInterval(i);
      }
    }
  }
</script>

