<template>
  <div class="info-content">
    <div class="info-basic info-item">
      <div class="info-title">基本信息</div>
      <div class="info-detail">
        <div class="info-img">
          <div class="info-header">
            <div class="info-header-user"
                 :style="headerBackground"
                 v-if="info.photo!==''">
            </div>
          </div>
        </div>
        <div class="info-data">
          <div class="item">
            <p>姓名：{{ info.name || "无" }}</p>
            <p>年级：{{ info.grade || "无" }}</p>
          </div>
          <div class="item">
            <p>性别：{{ info.sex | sexComplate }}</p>
            <p>补习科目：{{ info.subject || "无" }}</p>
          </div>
          <div class="item">
            <p>电话：{{ info.phone || "无" }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="info-education info-item">
      <div class="info-title">教育背景</div>
      <div class="info-detail">
        <div class="info-img">
          <img src="../../assets/student/education.png" class="info-icon">
        </div>
        <div class="info-data">
          <div class="item">
            <p>地址：{{ info.address || "无" }}</p>
            <p>学校级别：{{ info.schoolLevel || "无" }}</p>
          </div>
          <div class="item">
            <p>所在学校：{{ info.school || "无" }}</p>
            <p>年级排名：{{ info.gradeRank || "无" }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
  @import '../../style/info.less';
</style>

<script>

  export default {
    data () {
      return {
        infoUrl: this.$store.state.info,
        info:'',
        open: false,
        startValue: '',
        startShowValue: '',
      }
    },
    filters: {
      sexComplate(value) {
        let sex = '无';
        if(value === 0) {
          sex = '男';
        } else if(value === 1){
          sex = '女'
        }
        return sex;
      }
    },
    mounted () {
      this.getInfo()
    },
    computed: {
      headerBackground () {
        return this.info.photo?`background:#fff url(${this.info.photo}) center / cover no-repeat;`:'';
      },
    },
    methods: {
      getInfo() {
        this.$axios.get(this.infoUrl).then( ({ data }) =>{
          this.info = data.data;
        })
      },
    },

  }
</script>


