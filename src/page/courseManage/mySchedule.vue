<template>
  <div class="schedule-content">
    <div class="schedule-title">
      <ul>
        <li v-for="(item,$index) in scheduleType"
            @click="scheduleTypeChange($index)"
            :class="{ active : $index == scheduleTypeIndex }">{{ item.title }}</li>
      </ul>
    </div>
    <div class="schedule-main">
      <transition :name="transitionName">
        <weekSchedule v-if="!scheduleTypeIndex"></weekSchedule>
        <monthSchedule v-else></monthSchedule>
      </transition>
    </div>
  </div>
</template>

<style lang="less">
  @import '../../style/schedule.less';
</style>

<script>
  import weekSchedule from '@/page/courseManage/schedule/week'; //周课表
  import monthSchedule from '@/page/courseManage/schedule/month'; //月课表


  export default {
    data () {
      return {
        scheduleType:[
          { title : '周课表' , type : 'week'},
          { title : '月课表' , type : 'month'},
        ],
        scheduleTypeIndex:0,
        transitionName:'vux-pop-in'
      }
    },
    methods: {
      scheduleTypeChange($index){ //改变课表类型
        this.scheduleTypeIndex = $index;
        if($index == 0) {
          this.transitionName = 'vux-pop-in';
        } else {
          this.transitionName = 'vux-pop-out';
        }

      },
    },
    components:{
      monthSchedule,
      weekSchedule
    }
  }
</script>


