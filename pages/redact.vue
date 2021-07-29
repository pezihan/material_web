<template>
  <div  v-if="!errorview" class="content">
    <div class="content_title">
      <span @click="routerHome">我的主页</span>
      <span>></span>
      <span>基本信息</span>
    </div>
    <div class="content_user_image">
      <div class="user_image"><img :src="path.user_images + userMsg.user_image" alt=""></div>
      <div class="content_msg_view">
        <div class="content_text">
          <p>在pezihan大家都是“有头有脸”的朋友，上传头像让大家更快认识您。选择喜欢的图片作为您的头像：</p>
        </div>
        <button @click="setUserImageClick">上传头像</button>
        <span>可以上传jpg,jpeg,png格式的图片，且文件小于1M</span>
        <input class="fileInput" type="file" accept=".png,.jpg,.jpeg" name="" ref="uploadUserImgRef" style="display:none"  @change="uploadUserImgChange($event)"/>
      </div>
    </div>
    <div class="content_view_set">
      <div class="user_name">
        <span>用户名:</span>
        <input max="10" v-model="userMsg.user_name" type="text" placeholder="最大不能超过8个字符"/>
      </div>
      <div class="user_sex">
        <span>性别:</span>
          <label><input type="radio" :value="0" v-model="userMsg.sex" name="sex" />男</label>
          <label><input type="radio" :value="1" v-model="userMsg.sex" name="sex" />女</label>
          <label><input type="radio" :value="2" v-model="userMsg.sex" name="sex" />保密</label>
      </div>
      <div class="user_city">
        <span>城市:</span>
        <input max="10" v-model="userMsg.region" type="text" placeholder="最大不能超过10个字符"/>
      </div>
      <span></span>
      <textarea v-model="userMsg.signature" placeholder="一句话介绍说说你喜欢什么，也可以写上你的新浪微博、豆瓣、个人博客等。"></textarea>
      <button @click="setUserMsg">保存设置</button>
    </div>
  </div>
  <div v-else class="error_content">
    <img src="../assets/images/error404.gif" alt="">
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 用户信息
      userMsg: '',
      // 错误页面
      errorview: false,
      path: ''
    }
  },
  mounted() {
    this.path = this.$cookies.get('path')
    this.getUserMsg()
  },
  methods: {
    // 跳转到我的主页
    routerHome () {
      const userMsg = window.localStorage.getItem('userMsg') || ""
        if (userMsg) {
          const query = {
          id: JSON.parse(userMsg).id
        }
        const { href } = this.$router.resolve({ path: '/myHome', query: query })
        window.open(href, '_blank');
      }
    },
    // 获取用户信息
      async getUserMsg () {
          const { data: res } = await this.$axios.get('/userMsg', { params: { user_id: this.$route.query.user_id } })
          if (res.meta.status !== 200) return this.errorview = !this.errorview
          this.userMsg = res.data
      },
      // 上传头像
      setUserImageClick() {
        const upload = this.$refs.uploadUserImgRef
        upload.click()
      },
      // 上传
      async uploadUserImgChange (e) {
        // 图片大小不超过1M
        const limitSize = 1024 * 1024 * 1 // 1M
        const file = e.target.files[0]
        if (file.size > limitSize) return alert('头像大小不能大于1M')
        const forms = new FormData()
        forms.append('file', file)
        const configs = {
            headers: { 'Content-Type': 'multipart/form-data' }
        }
        const { data: res } = await this.$axios.post('/upUserImages', forms, configs)
        if (res.meta.status !== 201) return alert('上传失败')
        this.userMsg.user_image = res.data.path
      },
      // 保存信息
      async setUserMsg () {
        const { data: res } = await this.$axios.post('/userMsg', this.userMsg)
        if (res.meta.status !== 201) return alert('修改资料失败')
        // 修改保存在sesstion中的信息
        window.localStorage.setItem('userMsg', JSON.stringify(this.userMsg))
        alert('修改成功')
        location.reload()
      }
  }
}
</script>

<style lang="scss" scoped>
  .content {
    width: 1200px;
    margin: 10px auto;
    textarea {
      resize: none;
      display: block;
      margin: 20px 0;
      width: 500px;
      height: 150px;
      padding: 5px;
      border: 1px solid #d4d4d4;
    }
    button {
      background-color: #f07a7a;
      width: 100px;
      height: 30px;
      color: #fff;
    }
  }
  .content_title {
    span {
      cursor: pointer;
      color: #5678a0;
      &:hover  {
        &:nth-child(odd) {
          color: #f07a7a;
        }
      }
    }
  }
  .content_user_image {
    margin: 20px 0;
    display: flex;
    justify-content: flex-start;
    .user_image {
      width: 150px;
      height: 150px;
      overflow: hidden;
      margin-right: 20px;
      img {
        width: 100%;
      }
    }
    .content_msg_view {
      width: 400px;
      .content_text {
        p {
          color: #c9bbbb;
          font-size: 14px;
        }
      }
      button {
        color: #fff;
        background-color: #f07a7a;
        width: 80px;
        height: 35px;
        margin: 20px 0;
      }
      span {
        display: block;
        color: #c9bbbb;
        font-size: 14px;
      }
    }
  }
  .content_view_set {
    .user_name {
      margin: 20px 0;
      span {
        color: #666666;
      }
      input {
      border: 1px solid #d4d4d4;
      height: 26px;
      margin-left: 10px;
  }
    }
    .user_sex {
      margin: 20px 0;
      span {
        color: #666666;
      }
      label {
        margin: 0 10px;
        cursor: pointer;
        padding: 5px;
      }
    }
  }
  .user_city {
    margin: 10px 0;
    input {
      border: 1px solid #d4d4d4;
      height: 26px;
      margin-left: 10px;
  }
  }
  .error_content {
        width: 100%;
        height: 600px;
        font-weight: 600;
        color: #f07a7a;
        position: relative;
        img {
            width: 600px;
            position: absolute;
            left: 50%; top: 50%;
            transform: translate(-50%,-50%);
        }
    }
</style>
