<template>
  <div class="content" ref="contentRef">
    <div class="content_left">
      <div class="content_left_header">
        <div>
          <a :class="pitch == 3 ? 'pitch' : ''" @click="typeClick(3)">全部</a>
          <a :class="pitch == 1 ? 'pitch' : ''" @click="typeClick(1)">图片</a>
          <a :class="pitch == 2 ? 'pitch' : ''" @click="typeClick(2)">视频</a>
          <a :class="pitch == 4 ? 'pitch' : ''" @click="typeClick(4)">达人</a>
        </div>
      </div>
      <!-- 素材 -->
      <div v-if="queryinfo.type != 4" class="content_left_view">
        <div class="scnene_contewnt" v-for="(item1, index) in flexList" :key="index">
          <Card v-for="item2 in item1.list" :key="item2.id" :viewdata="item2"></Card>
        </div>
      </div>
      <!-- 达人 -->
      <div v-else class="content_left_user">
        <div class="user_content" v-for="item in dataList" :key="item.id">
          <img :src="path.user_images + item.user_image" alt="">
          <div class="user_content_text">
            <h4>{{ item.user_name }}</h4>
            <div class="user_content_msg">
              <span>关注：<a>{{ item.holdSum }}</a></span>
              <span>粉丝：<a>{{ item.fansSum }}</a></span>
            </div>
            <p>{{ item.signature | signatureFiltra }}</p>
          </div>
          <button @click="openMyHomeClick(item.user_id)">查看</button>
        </div>
      </div>
    </div>
    <div ref="historyRef" class="content_rigth">
      <div class="history">
        <div>
          <h2>历史记录</h2>
        </div>
        <ul v-if="historyList.length != 0">
          <li v-for="(item, index) in historyList" @click="hisClick(item)" :key="index">{{ item }}</li>
        </ul>
        <span v-else>暂无数据</span>
      </div>
      <div class="history">
        <div>
          <h2>热门搜索</h2>
        </div>
        <ul v-if="hotList.length != 0">
          <li v-for="(item, index) in hotList" @click="hisClick(item.keyword)" :key="index">{{ item.keyword }}</li>
        </ul>
        <span v-else>暂无数据</span>
      </div>
    </div>
    <!-- 没更多数据 -->
    <div class="loading_view">
      <img v-show="loadingShow" src="../assets/images/loading.gif" alt="">
      <h2>没有更多了</h2>
    </div>
  </div>
</template>

<script>
export default {
    data () {
      return {
        // 格式化后的数据列表
        flexList: [],
        // 是否可以继续加载数据
        loadingShow: true,
        // 热搜标签
        hotList: [],
        // 历史搜索记录
        historyList: []
      }
    },
    async asyncData ({ $axios, query, $cookies }) {
    let path = $cookies.get('path')
    let queryinfo = {
      query: query.query === undefined || query.query === null ? "" : query.query,
      state: 1,
      type: query.type === undefined || query.type === "" ? 3 : Number(query.type),
      start: 1,
      limit: 30
    }
    let sceneres = []
    if (query.query !== "" && query.query !== undefined && query.query !== null) {
      const { data: res } = await $axios.get('/search', { params: queryinfo })
        if (res.meta.status !== 200) {
          return { errorview: true }
        }
      if (Number(queryinfo.type) !== 4) {
        res.data.forEach(item => {
          item.phone_path = path.images + item.phone_path
          item.video_path = path.video + item.video_path
          item.userMsg.user_image = path.user_images + item.userMsg.user_image
        })
      }
      sceneres = res.data
    }
    return {
      queryinfo: queryinfo,
      dataList: sceneres,
      pitch: queryinfo.type,
      loadingShow: sceneres.length === 0 ? false:true,
      path
    }
  },
  created () {
    if (this.errorview != true && Number(this.$route.query.type) !== 4) {
      this.viewData()
    }
    this.getHotlList()
  },
  mounted () {
    window.addEventListener('scroll', this.scrollview)
    window.addEventListener('resize', this.historyView)
    if (this.dataList.length < 10) {
      this.getlistData()
    }
    // 保存搜索历史
    let history = JSON.parse(window.sessionStorage.getItem('history')) || ''
    const query = this.$route.query.query
    if (history !== '') {
      const index = history.findIndex(v => v === query)
      if (index === -1 && query !== "" && query !== "" && query !== null && query !== undefined) {
        history.unshift(query)
      } else if(index !== -1 && query !== "" && query !== "" && query !== null && query !== undefined){
        history.splice(index, 1) // 删除原来的那条记录
        history.unshift(query)
      }
    } else {
      if (query !== "" && query !== "" && query !== null && query !== undefined) {
        history.unshift(query)
      }
    }
    this.historyList = history.slice(0,8)
    window.sessionStorage.setItem('history', JSON.stringify(history))
  },
  methods: {
    // 类型切换
    typeClick (type) {
      location.replace(`/search?type=${type}&query=${this.queryinfo.query}`)
    },
    // 数据格式化
    viewData () {
        let flexList = []
        const data = this.dataList
        for (let i = 0; i < 4; i++) {
          flexList.push({ list: [] })
        }
        let index = 0
        data.forEach((item, i)=> {
            if (index > 3) {
                index = 0
            }
            flexList[index].list.push(item)
            index++
        })
        this.flexList = flexList
    },
     // 跳转到用户详细页
    openMyHomeClick (id) {
        const { href } = this.$router.resolve({ path: '/myHome', query: { id: id } })
        window.open(href, '_blank');
    },
    // 获取数据
    async getlistData () {
      this.queryinfo.start++
      const { data: res } = await this.$axios.get('/search', { params: this.queryinfo })
        if (res.meta.status !== 200) return
        if (res.data.length === 0 && this.queryinfo.state === 1) {
          this.queryinfo.state = 2
          this.queryinfo.start = 1
          this.queryinfo.limit = 30
          this.getlistData()
        } else if(res.data.length === 0 && this.queryinfo.state === 2){
          this.loadingShow = false
          return
        }
        if (Number(this.$route.query.type) !== 4) {
          res.data.forEach(item => {
            item.phone_path = this.path.images + item.phone_path
            item.video_path = this.path.video + item.video_path
            item.userMsg.user_image = this.path.user_images + item.userMsg.user_image
          })
          this.dataList = [...this.dataList, ...res.data]
          this.viewData()
        } else {
          this.dataList = [...this.dataList, ...res.data]
        }
    },
    // 获取热搜数据
    async getHotlList () {
      const { data: res } = await this.$axios.get('/hotSearch?limit=16')
      if (res.meta.status !== 200) return
      const zz = /^[\u4E00-\u9FA5A-Za-z0-9]+$/
      res.data.forEach(item => {
        if (zz.test(item.keyword)) {
          this.hotList.push(item)
        }
      })
    },
    // 点击搜索历史
    hisClick (query) {
      let type = this.$route.query.type === undefined ? 3 : this.$route.query.type
      location.replace(`/search?type=${type}&query=${query}`)
    },
    // 历史记录框自适应
    historyView () {
      // this.$refs.historyRef.style.top = scrollTop + 'px'
      const viewWidth = this.$refs.contentRef.offsetWidth
      const viewLeft = this.$refs.contentRef.offsetLeft
      console.log(viewWidth, viewLeft)
      this.$refs.historyRef.style.position = "fixed"
      this.$refs.historyRef.style.top = '100px'
      this.$refs.historyRef.style.left = viewLeft + 960 + 'px'
    },
    // 滚动事件
    scrollview () {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const allHeight = Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight)
      if (allHeight - scrollTop <= 1000 && this.loadingShow == true) {
        this.getlistData()
      }
      this.historyView()
    }
  }
}
</script>

<style lang="scss" scoped>
  .content {
    width: 1200px;
    margin: 0 auto;
    position: relative;
    .content_left {
      width: 940px;
      .content_left_header {
        width: 100%;
        border: 1px solid #e0e0e0;
        height: 60px;
        margin-top: 20px;
        display: flex;
        justify-content: center;
        div {
          width: 500px;
          display: flex;
          justify-content: space-around;
          align-items: center;
        }
        a {
          color: #4f4f4f;
          width: 100px;
          text-align: center;
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
            left: 50%;
            transform: translateX(-50%);
            bottom: -8px;
            border-radius: 2px;
          }
        }
      }
      .content_left_view {
        // width: 1200px;
        display: flex;
        justify-content: space-between;
        .scnene_contewnt {
          flex: 16.66%;
        }
      }
    }
  }
  .loading_view {
    width: 940px;
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
  .content_left_user {
    width: 100%;
    .user_content {
      border-bottom: 1px solid #e0e0e0;
      padding: 20px 10px;
      overflow: hidden;
      position: relative;
      img {
        width: 90px;
        height: 90px;
        border-radius: 100%;
        float: left;
      }
      .user_content_text {
        float: left;
        position: absolute;
        top: 50%;
        left: 120px;
        transform: translateY(-50%);
        h4 {
          font-size: 18px;
        }
        .user_content_msg {
          padding: 8px 0;
          span {
            margin-right: 20px;
            font-size: 16px;
          }
          a {
            color: #ec7b7b;
          }
        }
        p {
          color: #727070;
        }
      }
      button {
        width: 120px;
        height: 40px;
        border-radius: 20px;
        color: #fff;
        font-size: 16px;
        background-color: #ec7b7b;
        float: right;
        position: absolute;
        top: 50%;
        right: 20px;
        transform: translateY(-50%);
      }
    }
  }
  .content_rigth {
      width: 240px;
      height: 400px;
      position: absolute;
      top: 0;
      right: 0;
      .history {
        padding: 5px;
        border: 1px solid #e0e0e0;
        margin-bottom: 40px;
        div {
          border-bottom: 1px solid #e0e0e0;
          margin-bottom: 10px;
          h2 {
            font-size: 18px;
            padding: 10px;
            padding-bottom: 5px;
          }
        }
        span {
            display: block;
            color: #aaaaaa;
            width: 100%;
            text-align: center;
            height: 100%;
            margin-bottom: 10px;
          }
        ul {
          display: flex;
          width: 100%;
          // flex-direction: column;
          flex-wrap: wrap;
          justify-content: flex-start;
          align-content:flex-start;
          li {
            flex: 50%;
            color: #aaaaaa;
            padding: 0px 10px;
            padding-bottom: 5px;
            overflow:hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            cursor: pointer;
            margin-bottom: 10px;
            &:hover {
              color:#ec7b7b;
              text-decoration:underline;
            }
          }
        }
      }
    }
</style>
