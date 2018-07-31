<template>
  <div class="changePassword">
    <div class="title">修改密码</div>
    <div class="cps-main">
      <div class="form" v-show="!successShow">
        <input type="text" id="phone" style="opacity: 0;position: absolute;top:-9999px;">
        <input type="text" id="code" style="opacity: 0;position: absolute;top:-9999px;">
        <input type="password" id="password1" style="opacity: 0;position: absolute;top:-9999px;">
        <input type="password" id="password2" style="opacity: 0;position: absolute;top:-9999px">
        <div class="item phone">
          <input type="text"
                 maxlength="11"
                 :class="phoneClass"
                 placeholder="请输入您的手机号"
                 v-model="formCustom.phone"
                 @keyup="phoneTest">
          <i class="icon iconfont icon-shouji"></i>
          <span class="error" v-show="phoneError">手机号码无效</span>
        </div>
        <div class="item code">
          <input type="text"
                 maxlength="4"
                 :class="codeClass"
                 v-model="formCustom.code"
                 placeholder="请输入您的手机验证码"
                 @keyup="codeTest">
          <i class="icon iconfont icon-zhucedengluyanzhengma"></i>
          <span class="error" v-show="codeError">验证码错误</span>
          <Button type="warning" class="codeBtn" :disabled="!codeBtnShow" @click="handleCode()">{{ codeState }}</Button>
        </div>
        <div class="item password1">
          <input :type="inputType"
                 maxlength="20"
                 :class="pwdClass1"
                 v-model="formCustom.passwd"
                 placeholder="请输入6-20位的密码，包含字母和数字"
                 @keyup="pwdTest1">
          <i class="icon iconfont icon-mima"></i>
          <span class="error" v-show="pwdError1">6-20位包含字母和数字</span>
          <em :class="eyes" @click="openPassword"></em>
        </div>
        <div class="item password2">
          <input :type="inputType"
                 maxlength="20"
                 :class="pwdClass2"
                 v-model="formCustom.passwdCheck"
                 placeholder="请再次输入密码"
                 @keyup="pwdTest2">
          <i class="icon iconfont icon-mima"></i>
          <span class="error" v-show="pwdError2">两次输入密码不一致</span>
        </div>
        <Button type="warning" class="submit" :disabled="!submitBtnShow" @click="submit">确定</Button>
      </div>
      <div class="successMain" v-show="successShow">
        <div class="successContent">
          <h2>恭喜您密码重置成功</h2>
          <p>请使用新密码登录嗨课堂客户端!</p>
        </div>
        <span>{{successSecond}}s后退出</span>
      </div>
    </div>
  </div>
</template>

<style lang="less">
  @import '../../style/changePassword.less';
</style>

<script>
  import sha512 from '../../../static/js/sha512'
  const phoneReg= /^1\d{10}$/;
  const pwdReg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/;
  const codeReg = /^\d{4}$/;
  export default {
    data () {
      return {
        inputType:'password',
        eyes: 'eyes1',
        successShow:false,
        phoneClass:'icon1',
        phoneError:false,
        codeClass:'icon1',
        codeError:false,
        pwdClass1:'icon1',
        pwdError1:false,
        pwdClass2:'icon1',
        pwdError2:false,
        codeBtnShow:false,
        submitBtnShow:false,
        formCustom: {
          phone:'',
          passwd: '',
          passwdCheck: '',
          code: '',
        },
        codeState:'获取验证码',
        successSecond:3,
      }
    },
    watch:{
      codeState(curVal,oldVal){  //监听倒计时
        this.codeState = curVal;
      },
      successSecond(curVal,oldVal){  //监听倒计时
        this.successSecond = curVal;
      },
    },
    mounted () {
      this.getPhone();
    },
    methods: {
      phoneTest() { //电话号验证
        if(phoneReg.test(this.formCustom.phone)) {
          this.phoneClass = 'icon2';
          this.phoneError = false;
          if(this.codeState == '获取验证码') {
            this.codeBtnShow = true;
          }
        } else {
          this.phoneClass = 'icon1';
          this.phoneError = true;
          this.codeBtnShow = false;
        }
        this.formText();
      },
      codeTest() { //验证码验证
        if(codeReg.test(this.formCustom.code)) {
          this.codeClass = 'icon2';
          this.codeError = false;
        } else {
          this.codeClass = 'icon1';
          this.codeError = true;
        }
        this.formText();
      },
      pwdTest1() { //密码验证
        if(pwdReg.test(this.formCustom.passwd)) {
          this.pwdClass1 = 'icon2';
          this.pwdError1 = false;
          if( this.formCustom.passwdCheck!= '' ) { //二次验证
            if( this.formCustom.passwd != this.formCustom.passwdCheck ) {
              this.pwdClass2 = 'icon1';
              this.pwdError2 = true;
            }
          }
        } else {
          this.pwdClass1 = 'icon1';
          this.pwdError1 = true;
        }
        this.formText();
      },
      pwdTest2() {  //重复密码验证
        if(this.formCustom.passwd == this.formCustom.passwdCheck) {
          this.pwdClass2 = 'icon2';
          this.pwdError2 = false;
        } else {
          this.pwdClass2 = 'icon1';
          this.pwdError2 = true;
        }
        this.formText();
      },
      formText() { //表单验证
        if(this.phoneClass == 'icon2'
          && this.codeClass =='icon2'
          && this.pwdClass1 =='icon2'
          && this.pwdClass2 =='icon2') {
          this.submitBtnShow = true;
        } else {
          this.submitBtnShow = false;
        }
      },
      handleCode () {  //发送验证码
        this.$axios({
          method:"post",
          url: this.$store.state.getAuthCode,
          data:{
            'phone' : this.formCustom.phone,
          }
        })
          .then( res => {
            let temp = 60;
            this.codeBtnShow = false;
            this.codeState = temp + "秒后重试";
            let secondDown = setInterval(() => {
              temp--;
              this.codeState = temp + "秒后重试";
              if(temp<=0){
                this.codeState = '获取验证码' ;
                this.codeBtnShow = true;
                clearInterval(secondDown)
              }
            },1000)
          })
      },
      submit() {
        let newPassword = sha512(this.formCustom.phone + "&" + this.formCustom.passwd + ":onlyhi");
        this.$axios({
          method:"post",
          url: this.$store.state.resetpsd,
          data: {
            'phone' : this.formCustom.phone,
            'authCode' : this.formCustom.code,
            'password' : newPassword,
          },
        }).then( res => {
          this.successShow = true;
          let closeClient = setInterval(()=>{
            this.successSecond--;
            if(this.successSecond<=0) {
              clearInterval(closeClient);
              let args = `{
                "requesttype": 14,
                "messageid": 0,
                "jscallback": "signOut",
                "data": {
                  "msgbox":true
                }
              }`;
              sendData(args);
            }
          },1000);
        })
      },
      getPhone () {  //获取用户手机号
        this.$axios.get(this.$store.state.getUserPhone)
          .then(({data}) => {
            this.formCustom.phone = data.data;
            this.phoneTest();
          })
      },
      openPassword() {
        this.inputType = this.inputType === 'password' ? 'text' : 'password';
        this.eyes = this.eyes === 'eyes1' ? 'eyes2' : 'eyes1';
      },
    },
  }
</script>

