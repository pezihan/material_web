<template>
  <div class="content" v-if="!errorview">
    <div class="content_header_view">
      <h2>{{ tagName }}</h2>
      <div class="content_header_list">
        <a :class="pitch == 3 ? 'pitch' : ''" @click="typeClick(3)">全部</a>
        <a :class="pitch == 1 ? 'pitch' : ''" @click="typeClick(1)">图片</a>
        <a :class="pitch == 2 ? 'pitch' : ''" @click="typeClick(2)">视频</a>
      </div>
    </div>
    <div class="content_title">
      <span>分类 ></span>
      <span>{{ tagName }}</span>
    </div>
    <div class="content_recommend_view">
      <div class="scnene_contewnt" v-for="(item1, index) in flexList" :key="index">
        <Card v-for="item2 in item1.list" :key="item2.id" :viewdata="item2"></Card>
      </div>
    </div>
    <!-- 没更多数据 -->
    <div class="loading_view">
      <img v-show="loadingShow" src="../assets/images/loading.gif" alt="">
      <h2>没有更多了</h2>
    </div>
  </div>
  <div v-else class="error_content">
    <img src="../assets/images/error404.gif" alt="">
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 格式化后的数据列表
      flexList: [],
      // 是否可以继续加载数据
      loadingShow: true
    }
  },
  async asyncData ({ $axios, query, $cookies }) {
    let path = $cookies.get('path')
    let queryinfo = {
      tag_id: query.id,
      type: query.type,
      start: 1,
      limit: 30
    }
    const { data: res } = await $axios.get('/sort', { params: queryinfo })
      if (res.meta.status !== 200) {
      return { errorview: true }
    }
     res.data.forEach(item => {
      item.phone_path = path.images + item.phone_path
      item.video_path = path.video + item.video_path
      item.userMsg.user_image = path.user_images + item.userMsg.user_image
    })
    return {
      queryinfo: queryinfo,
      dataList: res.data,
      pitch: query.type,
      tagName: res.meta.tag_name,
      loadingShow: res.data.length === 0 ? false:true,
      path
    }
  },
  created () {
    if (this.errorview != true) {
      this.viewData()
    }
  },
  mounted () {
    window.addEventListener('scroll', this.scrollMenu)
    if (this.dataList.length < 10) {
      this.getlistData()
    }
  },
  methods: {
    // 类型切换
    typeClick (type) {
      location.replace(`/classify?id=${this.$route.query.id}&type=${type}`)
    },
    // 数据格式化
    viewData () {
        let flexList = []
        const data = this.dataList
        for (let i = 0; i < 5; i++) {
          flexList.push({ list: [] })
        }
        let index = 0
        data.forEach((item, i)=> {
            if (index > 4) {
                index = 0
            }
            flexList[index].list.push(item)
            index++
        })
        this.flexList = flexList
    },
    // 获取数据
    async getlistData () {
      this.queryinfo.start++
      const { data: res } = await this.$axios.get('/sort', { params: this.queryinfo })
        if (res.meta.status !== 200) return
        if (res.data.length === 0) return this.loadingShow = false
         res.data.forEach(item => {
          item.phone_path = this.path.images + item.phone_path
          item.video_path = this.path.video + item.video_path
          item.userMsg.user_image = this.path.user_images + item.userMsg.user_image
        })
        this.dataList = [...this.dataList, ...res.data]
        this.viewData()
    },
    // 滚动事件
    scrollMenu () {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const allHeight = Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight)
      if (allHeight - scrollTop <= 1000 && this.loadingShow == true) {
        this.getlistData()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .content {
    width: 1200px;
    margin: 0 auto;
    .content_header_view {
      margin: 30px 0;
      height: 140px;
      border: 1px solid #e0e0e0;
      position: relative;
      h2 {
        text-align: center;
        font-size: 20px;
        margin-top: 30px;
      }
      .content_header_list {
        width: 320px;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        margin: 30px 0;
        display: flex;
        justify-content: space-between;
        a {
          font-size: 18px;
          color: #4f4f4f;
          position: relative;
          cursor: pointer;
        }
        .pitch {
          color: #ec7b7b;
          &::after {
            content: '';
            display: inline-block;
            width: 20px;
            height: 4px;
            background-color: #ec7b7b;
            position: absolute;
            left: 8px;
            bottom: -8px;
            border-radius: 2px;
          }
        }
      }
    }
    .content_title {
      padding-bottom: 10px;
      border-bottom: 2px solid #e0e0e0;
      margin-bottom: 20px;
      span {
        color: #aaaaaa;
        font-size: 18px;
        &:nth-child(2) {
          color: #ec7b7b;
        }
      }
    }
  }
  .content_recommend_view {
      width: 1200px;
      display: flex;
      justify-content: space-between;
      .scnene_contewnt {
        flex: 16.66%;
      }
    }
  .loading_view {
    width: 100%;
    height: 100px;
    position: relative;
    img {
      height: 100%;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
    h2 {
      line-height: 100px;
      text-align: center;
      font-size: 25px;
      color: #ec7b7b;
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
