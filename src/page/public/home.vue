<template>
  <div class="home-content">
    <div class="home-top">
      <div class="home-top-main card">
        <div class="home-top-left">
          <div class="home-header">
            <div class="home-header-img">
              <div class="home-header-user"
                   :style="headerBackground"
                   v-if="info.photo">
              </div>
            </div>
          </div>
          <div class="home-detail">
            <p class="home-detail-main">
              <span class="home-name">{{ interval }}好，{{ info.name }}！</span>
              <span class="home-sign-on" v-if="!info.isSign" @click="sign">
              签到 <i class="icon iconfont icon-jibiji"></i></span>
              <span class="home-sign-off" v-else>已签到</span>

            </p>
            <p class="home-detail-text">
              本月共上<i> {{ info.hour }} 小时</i>，超过了{{ info.surpassRatio }}的学生，有{{ info.noJoinClassCount }}节课未参加，
              出勤率为<i> {{ info.attendanceRate }}</i>。
            </p>
          </div>
        </div>
        <div class="home-top-right">
          <span class="home-top-right-title">剩余课时</span>
          <div class="home-pie">
            <div class="home-pie-main">
              <canvas id="canvas1" width="164" height="164"></canvas>
            </div>
            <div class="home-pie-main">
              <canvas id="canvas2" width="164" height="164"></canvas>
            </div>
            <div class="home-pie-main">
              <canvas id="canvas3" width="164" height="164"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="home-bottom">
      <div class="home-bottom-left card">
        <div class="home-date-main">
          <div class="home-date-select">
            <div class="home-class-date-btn">
              <div @click="datePrev()">
                <Icon type="chevron-left"></Icon>
              </div>
              <h2>{{ year }}年{{ month }}月</h2>
              <div @click="dateNext()">
                <Icon type="chevron-right"></Icon>
              </div>
            </div>
            <div class="home-class-date-num">共{{classDateNum}}节课</div>
          </div>
          <div class="home-date-picker" :class="{flexCalendar}">
            <h3>
              <span>M</span>
              <span>T</span>
              <span>W</span>
              <span>T</span>
              <span>F</span>
              <span>S</span>
              <span>S</span>
            </h3>
            <p v-for="(item,$index) in dateList"
               :key="$index"
               v-show="calendarShow($index)">
              <span
                :class="dateStyle(day,month+'-'+day.dateDay)"
                v-for="(day,index) in item"
                :key="$index+'-'+index"
                @click="datePick(day,month+'-'+day.dateDay,$index,index)"
              >{{ day.isToday?'今':day.dateDay }}</span>
            </p>
          </div>
          <div class="home-date-course" v-show="closeCalendar">
            <div class="home-date-course-close" @click="closeCourseList">
              <Icon type="close-round"></Icon>
            </div>
            <div class="home-date-course-main" v-if="classList.length !== 0">
              <div class="home-date-course-date">
                <h3>{{day}}</h3>
                <span>{{dayNumText}}</span>
              </div>
              <div class="home-date-course-list">
                <div class="home-date-course-item" v-for="(item,index) in classList" :key="index">
                  <span class="home-date-course-time">{{ item.startTime }} - {{ item.endTime }}</span>
                  <span class="home-date-course-subject">{{ item.subject }}</span>
                  <span class="home-date-course-name">老师：{{ item.teacherName }}</span>
                </div>
              </div>
              <Spin fix id="loadAPP" v-if="homeClassListShow">
                <div class="loader">
                  <svg class="circular" viewBox="25 25 50 50">
                    <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"></circle>
                  </svg>
                </div>
              </Spin>
            </div>
            <div class="classTipNull tip-null" v-else>
              <img src="../../assets/teacher/null.png" alt="null">
              <span class="tip-null-text">选中日历显示课程~</span>
            </div>
          </div>
        </div>
      </div>
      <div class="home-bottom-right card">
        <classTipSection></classTipSection>
      </div>
    </div>
    <p class="tel">客服电话400-876-3300 （ 周一至周日 10:00～21:00 ）</p>
    <div class="sign-window" v-if="signWindow">
      <div class="sign-wrap">
        <div class="sign-close" @click="closeSignWindow">
          <Icon type="close-round"></Icon>
        </div>
        <div class="sign-content">
          <img src="../../assets/student/signTitle.png" class="sign-img-title">
          <img src="../../assets/student/signExpression.png" class="sign-img-emoji">
          <img src="../../assets/student/signIcon.png" class="sign-img-icon">
          <p class="sign-integral">+{{signData.currentIntegral}}积分</p>
          <p class="sign-day">已连续签到<span>{{signData.contDays}}</span>天,
            <br>连续签到5天可额外得3个积分
          </p>
          <p class="sign-day" style="font-size: 12px">明天签到<span>{{signData.tomorrowIntegral}}</span>积分</p>
          <p class="sign-tip">积分兑换系统敬请期待！</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
  @import '../../style/home.less';
</style>

<script>
  import { timestamp } from '@/common/js/common';
  import classTipSection from '@/components/classTip';

  export default {
    data () {
      return {
        year:0,
        month:0,
        day:0,
        time:0,
        dayIndex:0,
        signWindow:false,//签到窗口
        interval:'', //上午下午晚上
        dayNumText:'', //日历选中日期显示
        signData:'', //签到信息
        flexCalendar:true, //日历自适应显示
        closeCalendar:false, //合并日历
        classDateNum:0, //日历课程数
        date:'', //日期 （YYYY-MM）
        info:'', //学生信息
        pickIndex:'', //日期选中下标
        pickItem:'', //日期选中json
        pickWeekIndex: 0,//日期选中周下标
        classList:[], //日历课程列表
        dateList:[], //日历列表
        courseCalendarUrl:this.$store.state.courseCalendar, //获取日历接口
        findCourseListByDateUrl:this.$store.state.findCourseListByDate, //获取日历课程接口
        baseInfoUrl:this.$store.state.baseInfo , //获取学生信息接口
        classTimeUrl:this.$store.state.classTime , //获取剩余课程接口
        signUrl:this.$store.state.sign , //获取剩余课程接口
        homeClassListShow: false, //课程列表loading
        chartConfig1: {
          canvasId: 'canvas1', //id
          total: 0,  //总数
          arcColor:'rgb(135, 168, 248)', //圆弧颜色
          shadowColor:'rgba(135, 168, 248,0.35)', //阴影颜色
          spend: 0, //消耗数量
          speed: 1, //运动速度
          courseType: '普通', //课程类型,
        },
        chartConfig2: {
          canvasId: 'canvas2',
          total: 0,
          arcColor:'rgb(243, 182, 86)',
          shadowColor:'rgba(243, 182, 86, 0.35)',
          spend: 0,
          speed: 1,
          courseType: '精品',
        },
        chartConfig3: {
          canvasId: 'canvas3',
          total: 0,
          arcColor:'rgb(230, 119, 115)',
          shadowColor:'rgba(230, 119, 115, 0.35)',
          spend: 0,
          speed: 1,
          courseType: '清北',
        },
      }
    },
    mounted () {
      this.timeSet();
      this.getInfo();
      this.getClassTime();


      let calendarStyle = () => {
        if(window.innerHeight < 700) {
          if(this.closeCalendar) {
            this.flexCalendar = false;
          } else {
            this.flexCalendar = true;
          }
        } else {
          this.flexCalendar = false;
        }
      }
      calendarStyle();
      window.onresize = () => {
        calendarStyle();
//        if(this.pickItem == '') {
//          this.timeSet();
//        }
      }
    },
    computed: {
      headerBackground () {
        return this.info.photo?`background:#fff url(${this.info.photo}) center / cover no-repeat;`:'';
      },
    },
    methods: {
      timeSet () {  //获取服务器时间
        timestamp().then( data =>{
          this.year = data.year;
          this.month = data.month;
          this.day = data.day;
          this.dateGet();  //首次获取

          if(data.hour>17 || data.hour<5){
            this.interval = '晚上';
          } else if (data.hour>12) {
            this.interval = '下午';
          } else if (data.hour>=5) {
            this.interval = '上午';
          }
        })
      },
      getInfo() {  //获取学生信息
        this.$axios.get(this.baseInfoUrl)
          .then( ({data}) => {
            this.info = data.data;
            let args = `{
              "requesttype":34,
              "data" : {
                "url" : "${data.data.photo}"
              }
            }`
            sendData(args);
          })
      },
      getClassTime() {  //剩余课时
        this.$axios.get(this.classTimeUrl)
          .then( ({data}) => {
            let Data = data.data;
            this.chartConfig1.spend = Data.ordinaryTotalTime - Data.ordinarySurplusTime;
            this.chartConfig1.total = Data.ordinaryTotalTime;
            this.chartConfig2.spend = Data.qualityTotalTime - Data.qualitySurplusTime;
            this.chartConfig2.total = Data.qualityTotalTime;
            this.chartConfig3.spend = Data.qbTotalTime - Data.qbSurplusTime;
            this.chartConfig3.total = Data.qbTotalTime;

            this.chart(this.chartConfig1);
            this.chart(this.chartConfig2);
            this.chart(this.chartConfig3);
          })
      },
      sign() {  //签到
        this.$axios.get(this.signUrl).then( ({data}) => {
          this.signData = data.data;
          this.signWindow = true;
          this.getInfo();
        })
      },
      closeSignWindow() { //关闭签到窗口
        this.signWindow = false;
      },
      datePrev () {  //上月
        this.month--;
        if(this.month < 1) {
          this.year--;
          this.month = 12;
        }
        this.dateGet ();
      },
      dateNext () {  //下月
        this.month++;
        if(this.month > 12) {
          this.year++;
          this.month = 1;
        }
        this.dateGet ();
      },
      dateGet (first) { // 获取日历（按月）
        if(window.innerHeight < 700) {
          this.closeCourseList();
        }

        let year = this.year;
        let month = this.month < 10? '0' + this.month : this.month;
        this.date = year + '-' + month;
        this.$axios.get(this.courseCalendarUrl,{
          params : {
            dateTime : this.date,
          },
          loading: false,
        }).then( res => {
          this.dateList = res.data.data;
          if(first){  //页面初始化 默认选中当天
//           if(!this.flexCalendar){
             for(let [weekIndex,j] of this.dateList.entries()) {
               for (let [dayIndex,i] of j.entries()) {
                 if(i.isToday) {
                   let pick = this.month + '-' + this.day;
                   this.datePick (i,pick,weekIndex,dayIndex)
                 }
               }
             }
//           }
          }
        })
      },
      dateStyle (day,pick) { //日历天数样式
        let style = '';
        if(day.dateStatus == 0) {
          style = 'un';
        } else {
          if (day.dateStatus == 1){
            style = 'no';
          } else if(pick == this.pickIndex){
            style = 'picked';
          }
        }

        if(day.isToday) {
          style+= ' today'
        }
        return style;
      },
      datePick (day,pick,weekIndex,dayIndex) {  //日历选中
        if(day.dateStatus == 2) {
          if(this.flexCalendar) this.flexCalendar = false;
          this.closeCalendar = true;
          this.pickWeekIndex = weekIndex;
          this.pickItem = day;
          this.dayIndex = dayIndex;
          this.homeClassListShow = true;
          this.day = day.dateDay;
          this.pickIndex = pick;
          let dateDay = this.day < 10? '0'+this.day:this.day;
          let ymd = this.date + '-' + dateDay;
          this.$axios.get(this.findCourseListByDateUrl,{
            params:{
              'courseDate' : ymd,
            },
            loading: false,
          }).then( res => {
            this.classList = res.data.data.list;
            this.homeClassListShow = false;
            this.classDateNum = res.data.data.total;
            let st = [1,21,31];
            let nd = [2,22];
            let rd = [3,23];
            if(st.includes(this.day)) {
              this.dayNumText = 'ST';
            } else if(nd.includes(this.day)) {
              this.dayNumText = 'ND';
            } else if(rd.includes(this.day)) {
              this.dayNumText = 'RD';
            } else {
              this.dayNumText = 'TH';
            }
          }).catch( error => {
            this.homeClassListShow = false;
          })
        }
      },
      closeCourseList(){ //关闭日历课程列表
        this.flexCalendar = true;
        this.closeCalendar = false;
      },
      tip(){ //提示
        this.$Message.info("敬请期待")
      },
      calendarShow(index) { //显示所选周
        if(this.closeCalendar) {
          if(index === this.pickWeekIndex){
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      },
      chart(config) {
        let canvas = document.getElementById(config.canvasId)
        let context = canvas.getContext('2d');
        let centerX = canvas.width/2;   //x轴坐标
        let centerY = canvas.height/2;  //y轴坐标
        let rad = Math.PI*2/config.total; //将360度分成xx份
        let temp = 0; //起始

        //绘制15像素宽的运动外圈
        function blueCircle(n){
          context.save();
          context.strokeStyle = config.arcColor; //设置描边样式
          context.lineWidth = 15; //设置线宽
          context.lineCap = 'round';
          context.shadowOffsetX = 3; // 阴影Y轴偏移
          context.shadowOffsetY = 3; // 阴影X轴偏移
          context.shadowBlur = 7; // 模糊尺寸
          context.shadowColor = config.shadowColor; // 阴影颜色
          context.beginPath(); //路径开始
          context.arc(centerX, centerY, 60 , -0.5*Math.PI, 1.5*Math.PI + n*rad, true); //用于绘制圆弧context.arc(x坐标，y坐标，半径，起始角度，终止角度，顺时针/逆时针)
          context.stroke(); //绘制
          context.closePath(); //路径结束
          context.restore();
        }
        //绘制白色外圈
        function whiteCircle(){
          context.save();
          context.beginPath();
          context.strokeStyle = "#ededed";
          context.lineWidth = 15; //设置线宽
          context.arc(centerX, centerY, 60 , 0, Math.PI*2, false);
          context.stroke();
          context.closePath();
          context.restore();
        }
        //百分比文字绘制
        function text(n){
          let textPosition = `${config.total - parseInt(n)}`.length * 6 + 12;
          context.save(); //save和restore可以保证样式属性只运用于该段canvas元素
          context.fillStyle = config.arcColor; //设置描边样式
          context.font = "24px Microsoft YaHei"; //设置字体大小和字体
          //绘制字体，并且指定位置
          context.fillText(`${config.total - parseInt(n)}节`, centerX - textPosition, centerY + 26);
          //context.stroke(); //执行绘制
          context.restore();
        }

        function type(){
          context.save(); //save和restore可以保证样式属性只运用于该段canvas元素
          context.fillStyle = '#4c4245'; //设置描边样式
          context.font = "24px Microsoft YaHei"; //设置字体大小和字体
          //绘制字体，并且指定位置
          context.fillText(`${config.courseType}`, centerX-24, centerY-5);
          //context.stroke(); //执行绘制
          context.restore();
        }

        //动画循环
        window.requestAnimationFrame = window.requestAnimationFrame
          || window.mozRequestAnimationFrame
          || window.webkitRequestAnimationFrame
          || window.msRequestAnimationFrame;

        (function drawFrame(time){
          let animate = requestAnimationFrame(drawFrame);
          context.clearRect(0, 0, canvas.width, canvas.height);
          temp += config.speed;
          if(temp >= config.spend) {
            temp = config.spend;
            window.cancelAnimationFrame(animate)
          }
          text(temp);
          type();
          whiteCircle();
          blueCircle(temp);
        })();
      },
    },
    components:{
      classTipSection,
    },
    destroyed () {
      window.onresize = null;
    }
  }
</script>

