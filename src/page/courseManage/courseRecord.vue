<template>
  <div class="crContainer">
    <div class="crHeader">
      <div class="crHeader-main">
        <span>科目：</span>
        <Select v-model="formData.subject" @on-change="selectSubject" class="classSubject"
                style="width:70px;margin-right: 28px;">
          <Option v-for="item in subjectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <span>时间：</span>
        <DatePicker placement="bottom-end" type="daterange" placeholder="选择日期" @on-change="selectDate"
                    style="width: 200px"></DatePicker>
      </div>
    </div>
    <div class="crHeader2">
      <div class="crHeader2-main">
        <p>{{dateTime}}</p>
      </div>
    </div>
    <div class="crBody" v-if="courseRecord.length" @scroll="changeDate($event)">
      <div class="crItem" v-for="(cr,$index) in courseRecord">
        <p class="crTitle" ref="courseDate" v-show="$index">{{cr.list[0].courseDate}}</p>
        <ul class="courseList" :style="{width:courseListWidth}">
          <li class="courseCard" v-for="item in cr.list"
              :class="{ 'evaluation': item.courseType==0, 'debug': item.courseType==2}">
            <div class="courseMain">
              <div class="courseVideo">
                <div v-if="item.recordStatus === 1">
                  <img src="../../assets/images/cBg.png" alt="课程封面图">
                  <p class="playVideo" @click="start(item.courseUuid)">
                    <img src="../../assets/images/play.png" alt="播放">
                  </p>
                </div>
                <div class="courseListNoVideo" v-else-if="item.recordStatus === 2">
                  <img src="../../assets/teacher/emoji-null.png">
                  <span>检测不到回顾视频</span>
                </div>
                <div class="courseListNoVideo" v-else-if="item.recordStatus === 3">
                  <img src="../../assets/teacher/emoji-null.png">
                  <span>视频转换中，次日方可查看</span>
                </div>
              </div>
              <div class="courseBody">
                <div>
                  <p style="margin-right: 12px;">{{item.subject}}</p>
                  <p :title="item.name" style="max-width:5em;overflow: hidden;text-overflow:ellipsis;white-space: nowrap">{{item.name}}</p>
                  <p>老师</p>
                </div>
                <div :class="subjectClass(item.subject)">
                  <p>{{item.startTime}}- {{item.endTime}}</p>
                </div>
              </div>
            </div>
            <div class="courseBtn">
              <span class="writeComment"  @click="comment(item.courseUuid,item.name)" v-if="!item.classAppraiseUuid">评价老师</span>
              <span class="readComment" @click="readComment(item.classAppraiseUuid)" v-else>已评价</span>
              <span class="nullFeedback" v-if="!item.classTeacherAppraiseUuid">查看反馈</span>
              <span class="readFeedback" v-else @click="readFeedback(item.classTeacherAppraiseUuid)">查看反馈</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="courseListNull tip-null" v-else>
      <img src="../../assets/teacher/ai.png" alt="null">
      <span class="tip-null-text" style="font-size: 16px;color: #8d8d8d;">没有课程记录哦~</span>
    </div>
    <!--观看课程视频-->
    <div class="videoWarp" v-if="videoWarpper">
      <div class="videoContain" ref="videoContain">
        <div class="videoHead" ref="videohead">
          <img src="../../assets/images/close2.png" @click="videoWarpper=false" alt="关闭视频">
        </div>
        <div class="videoBody">
          <div class="videoMain" v-html="iframe"></div>
        </div>
      </div>
    </div>
    <!--老师反馈-->
    <Modal v-model="feedbackShow" width="430" class-name="vertical-center-modal">
      <p slot="header">
        <span>老师反馈</span>
      </p>
      <p slot="close">
        <Icon type="close-round"></Icon>
      </p>
      <div style="padding: 14px 14px 0;font-size: 14px;">
        <p style="font-size: 12px;margin-bottom: 10px;">{{ teacherCommentInfo.createTime }}</p>
        <p style="word-wrap: break-word;">{{ teacherCommentInfo.appraiseContent }}</p>
      </div>
      <div slot="footer">
        <Button type="warning" size="large" style="width: 125px;" @click="feedbackShow=false">确定</Button>
      </div>
    </Modal>
    <!-- 学生评价 -->
    <Modal class="commentWindow" v-model="commentShow" width="430" class-name="vertical-center-modal">
      <p slot="header">
        <span>查看评价</span>
      </p>
      <p slot="close">
        <Icon type="close-round"></Icon>
      </p>
      <div class="commentMain">
        <div class="commentName">非常感谢给 <b>{{commentInfo.teacherName}}</b> 老师本节课的评价</div>
        <div class="commentStar">
          <div class="commentStarBg clear">
            <i></i>
            <i></i>
            <i></i>
            <i></i>
            <i></i>
          </div>
          <div class="commentStarG">
            <i v-show="commentInfo.star>0"></i>
            <i v-show="commentInfo.star>1"></i>
            <i v-show="commentInfo.star>2"></i>
            <i v-show="commentInfo.star>3"></i>
            <i v-show="commentInfo.star>4"></i>
          </div>
        </div>
      </div>
      <div class="commentBottom">
        <h3 v-if="commentInfo.star == 1">非常差！</h3>
        <h3 v-else-if="commentInfo.star == 2">较差！</h3>
        <h3 v-else-if="commentInfo.star == 3">一般！</h3>
        <h3 v-else-if="commentInfo.star == 4">满意！</h3>
        <h3 v-else-if="commentInfo.star == 5">非常满意！</h3>
        <ul>
          <li v-for="item in commentInfo.list">{{ item }}</li>
        </ul>
        <p style="word-wrap: break-word;margin-bottom: 12px;">留言： {{ commentInfo.remark || '无' }}</p>
      </div>
      <div slot="footer">
        <Button type="warning" size="large" style="width: 125px;" @click="commentShow=false">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<style lang="less">
  @import '../../style/courseRecord.less';
</style>
<script>
  import {timestamp} from '@/common/js/common';
  const token = sessionStorage.getItem('token')
  export default {
    data() {
      return {
        subjectList: [  //学科列表
          {value: '', label: '全部'},
          {value: '语文', label: '语文'},
          {value: '数学', label: '数学'},
          {value: '英语', label: '英语'},
          {value: '物理', label: '物理'},
          {value: '化学', label: '化学'},
          {value: '生物', label: '生物'},
          {value: '政治', label: '政治'},
          {value: '历史', label: '历史'},
          {value: '地理', label: '地理'},
          {value: '科学', label: '科学'},
        ],
        dateTime: "",  //标题展示日期
        formData: {  //请求数据
          subject: '',
          startDate: "",
          endDate: "",
          courseType: "",
          pageNo: 1,
          pageSize: 10000,
        },
        courseRecord:[], //课程记录列表
        videoWarpper: false,  //播放器显示
        iframe: "", //iframe DOM
        feedbackShow:false, //老师反馈
        teacherCommentInfo:'', //老师反馈内容
        commentShow:false, //学生评价
        commentInfo:'', //学生评价内容
        courseListWidth:'100%', //课程记录宽度
        viewTeacherAppraise:this.$store.state.viewTeacherAppraise,
        viewAppraiseUrl:this.$store.state.studentViewAppraise,
      }
    },
    mounted() {
      this.courseRecordList();
    },
    updated() {
      if(this.courseRecord.length) {
        let crBody = document.querySelector('.crBody');
        // crBody - (padding 60 - margin 35 = 25);
        this.courseListWidth = crBody.clientWidth - 25 + 'px';
        window.onresize = ()=> {
          this.courseListWidth = crBody.clientWidth - 25 + 'px';
        }
      }
    },
    methods: {
      selectSubject(value) { // 科目选择
        this.formData.subject = value;
        this.courseRecordList()
      },
      selectDate(date) {  //日期时间选择
        [this.formData.startDate,this.formData.endDate] = date;
        this.courseRecordList();
      },
      subjectClass(subject){ //科目class
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
        } else {
          return 'yw'
        }
      },
      courseRecordList() {  //查询课程记录列表
        this.$axios.get(this.$store.state.getCourseRecordList, {
          params: this.formData
        }).then(({data}) => {
          this.courseRecord = data.data;
          if (this.courseRecord.length) {
            this.dateTime = this.courseRecord[0].courseDate;
          }
          else {
            this.dateTime = this.formData.startDate;
            this.$Message.error("没有课程记录哦！");
          }
        })
      },
      start(uuid) {  //查看回放
        this.videoWarpper = true;
        this.iframe = `<iframe src="../../static/play2.html?token=${token}&uuid=${uuid}"
                               id="iframe"
                               width="100%"
                               height="100%"
                               frameborder="no"
                               marginwidth="0"
                               marginheight="0"
                               scrolling="no"
                               allowtransparency="yes"
                               allowfullscreen="true"></iframe>`;
      },
      changeDate(e) { //日期切换
        let crItem = document.getElementsByClassName("crItem");
        let scrollTop = e.target.scrollTop;
        for (let i = 0, length = crItem.length; i < length; i++) {
          if (scrollTop >= crItem[i].offsetTop) {
            this.dateTime = crItem[i].children[0].innerHTML;
          }
        }
      },
      comment(courseUuid,teacherName){ //评价老师
        let args = `{
          "requesttype": 19,
          "courseUuid": "${courseUuid}",
          "teacherName": "${teacherName}",
          "callback": "refreshStudentRecord"
        }`;
        sendData(args);
      },
      readComment(classAppraiseUuid){ //查看评价
        this.$axios.get(this.viewAppraiseUrl,{
          params:{
            classAppraiseUuid:classAppraiseUuid,
          }
        }).then( res => {
          this.commentInfo = res.data.data
          this.commentShow = true;
        })
      },
      readFeedback(classTeacherAppraiseUuid){  //查看老师反馈
        this.$axios.get(this.viewTeacherAppraise,{
          params:{
            classTeacherAppraiseUuid:classTeacherAppraiseUuid,
          }
        }).then( res => {
          this.teacherCommentInfo = res.data.data
          this.feedbackShow = true;
        })
      },
    },
    destroyed () {
      window.onresize = null;
    },
  }
</script>
