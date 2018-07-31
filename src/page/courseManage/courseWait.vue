<template>
  <div class="cwContainer">
    <div class="cwBody" v-if="cwList.length">
      <div class="courseList" v-for="(cw,$index) in cwList">
        <p class="cwDate">
          <span>{{ courseDate(cw.courseDate) }}（共{{cw.list.length}}节）</span>
        </p>
        <ul>
          <li class="card" v-for="(item,index) in cw.list">
          <div class="courseMain" :class="subjectClass(item.subject)">
            <div class="courseIcon">
              <i class="icon"></i>
            </div>
            <div class="courseDetail">
              <h3>
                <span>{{ item.subject }}</span>
                <em>{{ item.startTime }} - {{ item.endTime }}</em>
              </h3>
              <div class="courseInfo">
                <div class="courseInfoMain">
                  <p :title="item.teacherName">老师: {{ item.teacherName }}</p>
                  <div class="enterRoom">
                    <Button disabled class="enterClass" v-if="!item.startClass">进入教室</Button>
                    <Button
                      type="warning"
                      class="enterClass" v-else-if="item.startClass"
                      @click="start(index,item.courseUuid,item)">进入教室</Button>
                  </div>
                </div>
                <div style="height: 21px">
                  <p class="lateTime" v-show="item.lateShow">迟到{{realLateTime[index]}}</p>
                  <p class="rangeTime" v-show="item.rangeShow">距离上课剩余{{realLateTime[index]}}</p>
                </div>
              </div>
            </div>
          </div>
          <div v-if="item.courseType==0" class="triangleMain cp">
            <p class="triangleTop"></p>
            <p class="testSign">测</p>
          </div>
          <div v-else-if="item.courseType==2" class="triangleMain ts">
            <p class="triangleTop"></p>
            <p class="testSign">调</p>
          </div>
        </li>
        </ul>
      </div>
    </div>
    <div class="courseListNull tip-null" v-else>
      <img src="../../assets/teacher/ai.png" alt="null">
      <span class="tip-null-text" style="font-size: 16px;color: #8d8d8d;">没有课程哦~</span>
    </div>

    <Modal v-model="enterWindow" width="320" class="enterWindow">
      <p slot="header">
        <span>进入教室</span>
      </p>
      <p slot="close">
        <Icon type="close-round"></Icon>
      </p>
      <div class="enterWindowImg" v-if="enterType === 0">
        <img src="../../assets/teacher/loadingMain.gif"/>
      </div>
      <div class="enterWindowText" v-else-if="enterType === 1"><Icon type="checkmark-circled"></Icon>进入教室成功！</div>
      <div class="enterWindowError" v-else-if="enterType === 2">
        <p>进入教室失败！</p>
        <Button type="warning" @click="start(startIndex,startUuid,startItem)">重新进入</Button>
        <div>若长时间不能进入教室，请检查网络或者联系班主任
          <!--<a href="javascript:;" @click="support">请求技术支持</a>-->
        </div>
      </div>
      <p slot="footer"></p>
    </Modal>
  </div>
</template>
<style lang="less">
  @import '../../style/courseWait.less';
</style>
<script>
  import { timestamp,forMatTime } from '@/common/js/common';
  let interval = new Array();
  export default {
    data() {
      return {
        cwList: [], //待上课程列表
        lateTime:"", //迟到时间
        realLateTime:new Array(), //距离开始时间
        enterWindow:false, //进入教室弹窗
        enterType:null,  //进入教室状态
        startIndex:null, //进入教室下标
        startUuid:null, //教室uuid
        startItem:null, //教室数据
      }
    },
    mounted() {
      this.getTime();

      let methods =  window._client_user_web_methods_;
      Object.assign(methods, {
        enterProgess : res => {
          let as = JSON.parse(res["args"]).state;
          this.enterWindow = true;
          this.enterType = as;
        }
      });

    },
    watch : {
      lateTime (newValue, oldValue) {
        let newValueArray = newValue.split(",");
        this.realLateTime = newValueArray;
      },
    },
    methods: {
      getTime() {
        timestamp().then(({timestamp}) => {
          this.Today = this.moment(timestamp).format("YYYY-MM-DD");
          this.timestamp = timestamp;
          this.getCWList();
        });
      },
      subjectClass(subject){
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
      courseDate(date) {
        let Today = this.Today
        let Tomorrow = this.moment(Today).add(1, 'days').format("YYYY-MM-DD");
        let afterTomorrow = this.moment(Today).add(2, 'days').format("YYYY-MM-DD");
        if(date == Today) {
          return '今天';
        } else if (date == Tomorrow) {
          return '明天';
        } else if (date == afterTomorrow) {
          return '后天';
        } else {
          return date;
        }
      },
// 获取待上课程列表
      getCWList() {
        this.$axios.get(this.$store.state.getNoEndCourseList).then(({data}) => {
          this.cwList = data.data;
          if( this.cwList.length ) {
            if (this.cwList[0].courseDate == this.Today) { //判断最近的课程是否为今天
              let lateList = [];
              for(let i=0;i<this.cwList[0].list.length;i++){
                let list = this.cwList[0].list[i];
                let ISOtime = `${list.courseDate.replace(/-/g,'/')} ${list.startTime}`;
                let second = (new Date(ISOtime).getTime() - this.timestamp) / 1000;
                if(!list.studentClassStatus) {
                  this.countDown(i,second,lateList);
                } else {
                  Object.assign(list, { startClass: true });
                  Object.assign(list, { lateShow: false });
                  Object.assign(list, { rangeShow: false });
                }
              }
            }
          }

        })
      },
//      倒计时
      countDown(i,second,lateList){
        let list = this.cwList[0].list[i];
        interval[i] = setInterval(() => {
          second--;
          let second2 = Math.abs(second),
            startTime = `${list.courseDate.replace(/-/g,'/')} ${list.startTime}`,
            endTime = `${list.courseDate.replace(/-/g,'/')} ${list.endTime}`,
            classTime = (new Date(endTime).getTime() -new Date(startTime).getTime()) / 1000;
          if (second >= 0 && second <= 1200) {
            Object.assign(list, { startClass: true });
            Object.assign(list, { lateShow: false });
            Object.assign(list, { rangeShow: true });
            lateList[i] = forMatTime(second);
            this.lateTime =  lateList.toString();
          }
          else if (second < 0) {
            Object.assign(list, { startClass: true });
            Object.assign(list, { lateShow: true });
            Object.assign(list, { rangeShow: false });
            if(second2>=classTime){
              second2 = classTime
              clearInterval(interval[i]);
            }
            lateList[i] = forMatTime(second2)
            this.lateTime = lateList.toString();
          }
          else {
            Object.assign(list, { lateShow: false });
            Object.assign(list, { startClass: false });
            Object.assign(list, { rangeShow: false });
          }
        }, 1000);
      },
//      开始上课
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
        }).then(res => {
            let data = res.data.data;
            let args = `{
              "requesttype": 2,
              "messageid": ${this.startIndex},
              "jscallback": "coursewareClassback",
              "data": {
                "commchannelid": "${data.commChannelId}",
                "signallingchannelid": "${data.signallingchannelid}",
                "recordId": "${data.recordId}",
                "courseType": "${data.courseType}",
                "courseUuid": "${this.startUuid}",
                "tabId": "${this.i}",
                "value": ${JSON.stringify(this.startItem)}
              }
            }`;
            sendData(args);
            this.getTime();
          })
      },
      target() {
        let args = `{
          "requesttype": 13,
          "url": "www.onlyhi.cn"
        }`;
        sendData(args);
      },
      support() { //技术支持
        let args = `{
          "requesttype": 18
        }`;
        sendData(args);
      },
    },
    destroyed () {
      for(let i of interval){
        clearInterval(i);
      }
    }
  }
</script>

