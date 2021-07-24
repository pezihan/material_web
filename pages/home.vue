<template>
  <div class="container">
    <div class="content_images"><img src="../assets/images/home.jpg" alt=""></div>
    <div class="conetent">
      <div class="classify_content">
        <h4>分类</h4>
        <div class="classify_content_tag">
          <div v-for="item in classify" :key="item.id">
            <a :href="'/classify?id=' + item.id + '&type=3'">{{ item.name }}</a>
          </div>
        </div>
      </div>
      <div v-for="(item1, index) in flexList" :key="index" class="content_recommend">
        <div class="content_title">
          <h4>推荐{{ index == 0 ? '图片' : '视频' }}</h4>
          <a :href="'/recomed?type=' + (index*1  + 1)">更多 ></a>
        </div>
        <div class="content_recommend_view">
          <div class="scnene_contewnt" v-for="(item2, index) in item1.data" :key="index">
            <Card v-for="item3 in item2.list" :key="item3.id" :viewdata="item3"></Card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import axios from 'axios'
export default {
    data () {
      return {
        // 错误页面
        errorview: false,
        // 视图渲染需要的数据格式
        flexList: []
      }
    },
    async asyncData ({$axios, $cookies}) {
      let queryinfo = {
          type: 1,
          start: 1,
          limit: 30
        }
      let path = $cookies.get('path')
      // 获取分类标签
      const  { data } = await $axios.get('/classify')
      let classify = data.data
      // 获取图片数据
      const { data: res } = await $axios.get('/recommend', { params: queryinfo })
      if (res.meta.status !== 200) {
          return { errorview: true }
      }
      res.data.forEach(item => {
          item.phone_path = path.images + item.phone_path
          item.video_path = path.video + item.video_path
          item.userMsg.user_image = path.user_images + item.userMsg.user_image
        })
      let images = res.data
      // 获取视频数据
      queryinfo.type = 2
        const { data: res2 } = await $axios.get('/recommend', { params: queryinfo, type: 3 })
        if (res2.meta.status !== 200) {
          return { errorview: true }
        }
        res2.data.forEach(item => {
          item.video_path = path.video + item.video_path
          item.phone_path = path.images + item.phone_path
          item.userMsg.user_image = path.user_images + item.userMsg.user_image
        })
        let video = res2.data
      return {
        // 资源访问路径
        path,
        // 请求参数
        queryinfo,
        // 分类数据
        classify,
        // 推荐数据列表
        datalist: {
          images,
          video
        }
      }
    },
    created () {
      this.viewData()
    },
    methods: {
      // 数据处理
      viewData () {
          let flexList = [{data: []},{data: []}]
          const images = this.datalist.images
          const video = this.datalist.video
          let arr1 = []
          let arr2 = []
          for (let i = 0; i < 5; i++) {
            arr1.push({ list: [] })
            arr2.push({ list: [] })
          }
          let index = 0
          images.forEach((item, i)=> {
              if (index > 4) {
                  index = 0
              }
              arr1[index].list.push(item)
              index++
          })
          index = 0
          video.forEach((item, i)=> {
              if (index > 4) {
                  index = 0
              }
              arr2[index].list.push(item)
              index++
          })
          flexList[0].data = arr1
          flexList[1].data = arr2
          this.flexList = flexList
      }
    }
}
</script>

<style lang="scss" scoped>
  .content_images {
    width: 100%;
    height: 600px;
    overflow: hidden;
    margin-top: -80px;
    margin-bottom: 0;
    img {
      width: 100%;
      transform: translateY(-30%);
    }
  }
  .conetent {
    margin: 50px auto;
    width: 1200px;
  }
  .classify_content {
    width: 100%;
    h4 {
      text-align: center;
      font-size: 20px;
      margin-bottom: 20px;
    }
    .classify_content_tag {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      div {
        flex: 16.66%;
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
        a {
          display: block;
          width: 120px;
          height: 35px;
          background-color: #f8f8f8;
          text-align: center;
          line-height: 35px;
          border-radius: 15px;
          color: rgb(99, 99, 99);
          cursor: pointer;
          &:hover {
            background-color: #e9e9e9;
          }
        }
      }
    }
  }
  .content_recommend {
    margin-top: 20px;
    .content_title {
      h4 {
        font-size: 22px;
        font-weight: 700;
        display: inline-block;
        margin-right: 10px;
        color: #636363;
      }
      a {
        font-size: 14px;
        color: #636363;
        &:hover {
          color: #f07a7a;
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
  }
</style>
