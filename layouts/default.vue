<template>
  <div>
    <div :style="'top:' + tabTop + 'px;'" :class="action == true ? 'head_view' : 'head_view headBackgroud'">
      <div class="head_view_content" >
        <router-link tag="span" to="/home"><h4 class="head_content_log">Pezihan</h4></router-link>
        <div class="head_content_search">
          <input @keydown.enter="searchClick" type="text" v-model="searchContent" placeholder="请输入要搜索的内容">
            <button @click="searchClick">搜索</button>
        </div>
        <div class="head_content_button">
          <div @click="openMyHomeClick(1)">
            <span class="iconfont icon-touxiang"></span>
            <span>我的主页</span>
          </div>
          <div @click="openMyHomeClick(2)">
            <span class="iconfont icon-shoucang"></span>
            <span>我的收藏</span>
          </div>
          <div>
            <span class="iconfont icon-shangchuan"></span>
            <span>上传作品</span>
          </div>
        </div>
        <div v-show="userImage!=''" @mouseenter="escBtnShow = true" class="head_content_image">
            <img :src="userImage" alt="">
            <div v-show="escBtnShow" @mouseout="escBtnShow = false" class="ecsBtn" @click="exitLogin">注销</div>
          </div>
        <span class="user_name_text">{{ userName }}</span>
      </div>
    </div>
    <div v-show="loginViewShow" class="login_content">
      <div class="login_content_view">
        <div class="login_view_header">
          <h2>登录</h2>
          <span @click="closeLoginClick" class="iconfont icon-tubiaozhizuomoban-"></span>
        </div>
        <div class="login_view">
          <div v-if="status" class="login_view_left">
            <div>
              <span>账号：</span>
              <input type="text" v-model="infoData.phone" placeholder="请输入账号或手机号">
            </div>
            <div>
              <span>密码：</span>
              <input type="password" v-model="infoData.password" placeholder="请输入密码">
            </div>
            <p v-show="viewText != ''">{{ viewText }}</p>
            <button @click="loginClick">登录</button>
            <div>
              <span>忘记密码?</span>
              <span @click="status = false">还没注册? 立即注册</span>
            </div>
          </div>
          <div v-else class="regis_view_left">
            <div>
              <div><input type="number" v-model="infoData.phone" placeholder="请输入手机号码"></div>
              <div class="verfNm">
                <input type="number"  v-model="infoData.verification" placeholder="请输入验证码">
                <button :class="timeSene != 0 ? 'action':''" :disabled="timeSene != 0 ? true:false"  @click="sendVerification">{{ VerifText }}</button>
              </div>
              <div><input type="password" v-model="infoData.password" placeholder="请输入密码"></div>
              <div><input type="password" v-model="infoData.verifiPassword" placeholder="再次输入密码"></div>
              <p v-show="viewText != ''">{{ viewText }}</p>
              <button @click="regisClick" class="regis_button">注册</button>
            </div>
          </div>
          <div class="login_view_rigth">
            <img src="../assets/images/qr_code.png" alt="">
            <span>扫一扫下载手机客户端浏览体验更佳</span>
          </div>
        </div>
      </div>
    </div>
    <div @click="scrollClick" class="scrool_top_button">
      <span class="iconfont icon-icon-arrow-top4"></span>
    </div>
    <div class="placeholder"></div>
    <nuxt-child class="router"></nuxt-child>
    <!-- 路由容器 -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      searchContent: '',
      headBckgroud: 'rgba(0, 0, 0, .2)',
      action: true,
      // 上次滚动值
      scrollTop: 0,
      tabTop:0,
      // 用户头像
      userImage: '',
      // 用户名
      userName: '',
      // 登录组件显示隐藏
      loginViewShow: false,
      // 标识目前数注册还是登录
      status: true,
      // 注册页面提示文字
      viewText: '',
      // 发送验证码按钮文字
      VerifText: '发送验证码',
      // 重发验证码秒数
      timeSene: 0,
      // 登录注册的数据列表
      infoData: {
        phone: '',
        password: '',
        verification: '',
        verifiPassword: ''
      },
      // 资源访问路径
      path: "",
      // 退出登录按钮显示
      escBtnShow: false
    }
  },
  created () {
    if (this.$route.path === '/home' || this.$route.path === '/home/') {
      this.action = true
    } else {
      this.action = false
    }
    if (this.$route.path === '/search' || this.$route.path === '/search/') {
      this.searchContent = this.$route.query.query == undefined || this.$route.query.query == null ? "" : this.$route.query.query
    }
  },
  mounted () {
    this.path = this.$cookies.get('path')
    window.addEventListener('scroll', this.scrollMenu)
    const userMsg = window.sessionStorage.getItem('userMsg') || ""
    if (userMsg) {
      this.userImage = this.path.user_images + JSON.parse(userMsg).user_image
      this.userName = JSON.parse(userMsg).user_name
    }
  },
  methods: {
    // 退出登录
    exitLogin () {
      this.$cookies.remove('token')
      window.sessionStorage.clear()
      location.reload()
    },
    // 搜索
    searchClick () {
      let type = this.$route.query.type === undefined ? 3 : this.$route.query.type
      location.replace(`/search?type=${type}&query=${this.searchContent}`)
    },
    // 页面滚动事件
    scrollMenu() {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      if (this.$route.fullPath === '/home') {
        this.action = scrollTop >= (600 - 80) ? false : true
      }
      if (scrollTop > this.scrollTop + 200) {
        this.tabTop = -80
        this.scrollTop = scrollTop
      } else if (scrollTop < this.scrollTop - 200) {
        this.tabTop = 0
        this.scrollTop = scrollTop
      }
    },
    // 跳转到主页
    openMyHomeClick (type) {
      const token = this.$cookies.get('token')
      if (!token) {
        this.loginViewShow = true
      }
    },
    // 关闭登录页面
    closeLoginClick () {
      this.loginViewShow = false
      this.status = true
    },
    // 滚动到顶部
    scrollClick () {
      const timer = setInterval(() => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        if (scrollTop > 0) {
          document.documentElement.scrollTop = scrollTop - 200
        } else {
          clearInterval(timer)
          document.documentElement.scrollTop = 0
        }
      },10)
    },
    // 发送验证码
    async sendVerification () {
      if (this.infoData.phone === '') return this.viewText = '请输入手机号'
      const { data: res } = await this.$axios.put('/verify?phone=' + this.infoData.phone)
      if (res.meta.status !== 200) return this.viewText = res.meta.msg
      this.viewText = ''
      this.timeSene = 60
      this.VerifText = `重新发送(${this.timeSene}s)`
      alert('发送成功')
      const timer = setInterval(() => {
        if (this.timeSene <= 0) {
            clearInterval(timer)
            this.VerifText = `重新发送`
            return
        }
        this.timeSene--
        this.VerifText = `重新发送(${this.timeSene}s)`
      },1000)
    },
    // 注册
    async regisClick () {
      if (this.infoData.phone === '' || this.infoData.password === '' || this.infoData.verifiPassword == '') {
        this.viewText = '账号或密码填写不完整'
        return
      } else if (this.infoData.verification === '') {
        this.viewText = '请输入验证码'
        return
      } else if (this.infoData.verifiPassword !== this.infoData.password) {
        this.viewText = '两次密码填写不完整'
        return
      }
      const data = {
        phone: this.infoData.phone,
        verification: this.infoData.verification,
        password: this.$md5(this.infoData.password)
      }
      // 发送请求
      const { data: res } = await this.$axios.post('/sign', data)
      if (res.meta.status !== 201) return this.viewText = res.meta.msg
      this.viewText = '发送验证码'
      this.status = true
      this.viewText = ''
    },
    // 登录
    async loginClick () {
      if (this.infoData.phone === '') {
        this.viewText = '请填写账号'
        return
      } else if (this.infoData.password === '') {
        this.viewText = '请输入密码'
        return
      }
      const data = {
        phone: this.infoData.phone,
        password: this.$md5(this.infoData.password)
      }
      this.VerifText = '发送验证码'
      this.viewText = ''
      // 发送请求
      const { data: res } = await this.$axios.post('/login', data)
      if (res.meta.status === 200 || res.meta.status == 100) {
        this.viewText = ''
        this.$cookies.set('token', res.data.token)
        window.sessionStorage.setItem('userMsg', JSON.stringify(res.data))
        this.loginViewShow = false
        this.userImage = this.path.user_images + res.data.user_image
        this.userName = res.data.user_name
        if (res.meta.status === 100) {
          // 跳转到完善信息页面
          this.$router.push({ path: '/redact', query: { path: this.$route.path, user_id: res.data.id } })
        } else {
          // location.reload()
        }
      } else {
        this.viewText = res.meta.msg
      }
    }
  },
  watch: {
    '$route' (res) {
      if (res.query.login !== undefined) {
        // 显示登录页面
        this.loginViewShow = true
      }
      if (res.path === '/home' || res.path === '/home/') {
        this.action = true
      } else {
        this.action = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .placeholder {
    width: 100%;
    height: 80px;
  }
  .headBackgroud {
    background-color: #fff  !important;
    border-bottom: 1px solid #e0e0e0;
    .head_content_log {
      color: #f07a7a !important;
    }
    .head_content_search {
      input {
        border: 1px solid #f07a7a;
        color: rgb(109, 109, 109) !important;
        &::-webkit-input-placeholder {
            color: rgb(179, 179, 179) !important;
          }
          &:-moz-placeholder {
            color: rgb(179, 179, 179) !important;
          }
          &::-moz-placeholder {
            color: rgb(179, 179, 179) !important;
          }
          &:-ms-input-placeholder {
            color: rgb(179, 179, 179) !important;
          }
      }
    }
    .head_content_button {
      span {
        color: #8b8a8a !important;
      }
    }
    .user_name_text {
      color: #777777;
    }
  }
  .head_view {
    width: 100%;
    height: 80px;
    position: fixed;
    background-color: rgba(63, 62, 62, 0.3);
    z-index: 3000;
    top: 0;
    transition: .3s;
    .head_view_content {
      width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      .head_content_log {
        color: #fff;
        font-size: 30px;
        cursor: pointer;
      }
      .head_content_search {
        input {
          width: 500px;
          height: 50px;
          border-top-left-radius: 30px;
          border-bottom-left-radius: 30px;
          float: left;
          color: #fff;
          background-color: rgba(255, 255, 255, 0.3);
          // border: 1px solid #dd6363;
          &::-webkit-input-placeholder {
            color: rgb(255, 255, 255);
          }
          &:-moz-placeholder {
            color: rgb(255, 255, 255);
          }
          &::-moz-placeholder {
            color: rgb(255, 255, 255);
          }
          &:-ms-input-placeholder {
            color: rgb(255, 255, 255);
          }
        }
        button {
          width: 100px;
          height: 50px;
          border-top-right-radius: 30px;
          border-bottom-right-radius: 30px;
          float: left;
          background-color: #f07a7a;
          border: 1px solid #f07a7a;
          color: #fff;
        }
      }
      .head_content_button {
        display: flex;
        justify-content: space-between;
        align-items: center;
        div {
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: center;
          padding: 0 10px;
          .iconfont {
            font-size: 30px;
            cursor: pointer;
          }
          span {
            color: #fff;
            cursor: pointer;
          }
        }
      }
      .head_content_image {
          width: 50px;
          height: 50px;
          border-radius: 100%;
          overflow: hidden;
          cursor: pointer;
          display: flex;
          position: relative;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .ecsBtn {
          width: 100%;
          height: 100%;
          position: absolute;
          background-color: rgba(179, 155, 155, 0.5);
          border-radius: 100%;
          text-align: center;
          line-height: 50px;
          bottom: 0px;
          left: 0px;
          cursor: pointer;
          z-index: 200;
          color: #fff;
        }
    }
  }
  .login_content {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba($color: #000000, $alpha: 0.6);
    z-index: 1000;
    .login_content_view {
      width: 700px;
      height: 420px;
      position: absolute;
      border-radius: 10px;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      background: #fff;
      .login_view_header {
        height: 50px;
        width: 100%;
        text-align: center;
        line-height: 50px;
        border-bottom: 2px solid #cfcfcf;
        span {
          position: absolute;
          top: 0px;
          right: 20px;
          font-size: 20px;
          cursor: pointer;
        }
      }
      .login_view {
        padding: 10px;
        display: flex;
        height: 350px;
        z-index: 3000;
        p {
          color: red;
          font-size: 13px;
          transition: .3s;
        }
        .login_view_left {
          flex: 2;
          border-right: 2px solid #cfcfcf;
          display: flex;
          justify-content: center;
          align-content: center;
          align-items: center;
          flex-flow: column;
          div {
            &:nth-child(1),&:nth-child(2){
              margin: 15px 0;
              span {
                color: #898989;
                font-size: 16px;
              }
              input {
                border: 1px solid #e5e4e3;
                height: 40px;
                color: #5c5c5c;
              }
            }
            &:nth-child(5) {
              width: 200px;
              margin-left: 100px;
              margin-top: 10px;
              span {
                display: block;
                color: #30328f;
                margin: 10px;
                float: right;
                cursor: pointer;
              }
            }
          }
          button {
              width: 180px;
              height: 35px;
              background-color: #ff7e7e;
              color: #fff;
              border-radius: 6px;
              margin: 10px 0;
            }
        }
        .regis_view_left {
          flex: 2;
          border-right: 2px solid #cfcfcf;
          display: flex;
          justify-content: center;
          align-content: center;
          flex-wrap: wrap;
          .verfNm {
            display: flex;
            justify-content: space-between;
            align-items: center;
            input {
              width: 150px;
            }
            button {
              width: 130px;
              height: 35px;
              background-color: #ff7e7e;
              color: #fff;
              border-radius: 6px;
            }
          }
          div {
            width: 300px;
            margin: 15px 0;
            input {
              width: 100%;
              border: 1px solid #e5e4e3;
              height: 40px;
              color: #5c5c5c;
            }
          }
          .regis_button {
              width: 180px;
              height: 35px;
              background-color: #ff7e7e;
              color: #fff;
              border-radius: 6px;
              margin: 10px auto;
              margin-left: 60px;
            }
        }
        .login_view_rigth {
          flex: 1;
          display: flex;
          justify-content: center;
          flex-flow: column;
          align-content: center;
          align-items: center;
          img {
            width: 160px;
            margin-bottom: 15px;
          }
          span {
            width: 150px;
            color: #5a5a5a;
          }
        }
      }
    }
  }
  .user_name_text {
    color: #fff;
    transform: translateX(-50%);
  }
  .action {
    background-color: #999 !important;
  }
  .scrool_top_button {
    width: 60px;
    height: 60px;
    border: 1px solid #ff9494;
    position: fixed;
    bottom: 50px;
    right: 170px;
    z-index: 2000;
    cursor: pointer;
    transition: .3s;
    span {
      font-size: 40px;
      color: #ff9494;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      line-height: 60px;
    }
    &:hover {
      background-color: #ff9494;
      span {
        color: #fff;
      }
    }
  }
</style>