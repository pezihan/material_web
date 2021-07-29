<template>
  <div  v-if="!errorview" class="content">
    <div class="content_title">
      <span>用户</span>
      <span>></span>
      <span>{{ queryInfo.type == 1 ? '我的关注' : '我的粉丝' }}</span>
    </div>
    <div class="content_view">
      <div class="content_view_left">
        <div :class="queryInfo.type == 1 ? 'action' : ''" @click="switchoverClick(1)">我的关注</div>
        <div :class="queryInfo.type == 2 ? 'action' : ''" @click="switchoverClick(2)">我的粉丝</div>
      </div>
      <div class="content_view_rigth">
        <div class="user_view" v-for="item in dataList" :key="item.user_id">
          <div @click="openMyHomeClick(item.user_id)" class="user_view_left">
            <img :src="item.user_image" alt="">
          </div>
          <div class="user_view_rigth">
            <h4>{{ item.user_name }}</h4>
            <div>
              <span>关注  <a href="">{{ item.holdSum }}</a></span>
               <span>粉丝  <a href="">{{ item.fansSum }}</a></span>
            </div>
            <p>{{ item.signature }}</p>
          </div>
        </div>
        <div class="user_view_bottom">
          <div v-for="(item, index) in page" :key="index" @click="nextPageClick(1, item)">{{ item }}</div>
          <div @click="nextPageClick(2)">></div>
        </div>
      </div>
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
        // 错误页面
        errorview: false,
        path: '',
        // 请求参数
        queryInfo: {
          user_id: '',
          type: 1,
          start: 1,
          limit: 10
        },
        // 数据
        dataList: [],
        // 粉丝数量
        fansSum: 0,
        // 关注数量
        holdSum: 0,
        // 分页
        page: '',
        // 最大可翻页码
        maxPage: 0
      }
    },
    mounted() {
      this.path = this.$cookies.get('path')
      if (this.$route.query.user_id === undefined) return errorview = true
      this.queryInfo.user_id = this.$route.query.user_id
      this.queryInfo.type = this.$route.query.type !== undefined ? this.$route.query.type : 1
      this.getDataList()
    },
    methods: {
      async getDataList () {
        const { data: res } = await this.$axios.get('/holdlist', { params: this.queryInfo })
        if (res.meta.status !== 200) return this.errorview = !this.errorview
        res.data.userList.forEach(item => {
          item.user_image = this.path.user_images + item.user_image
        })
        this.dataList = res.data.userList
        this.fansSum = res.data.fansSum
        this.holdSum = res.data.holdSum
        const sum =  Math.ceil((this.queryInfo.type == 1 ? this.holdSum : this.fansSum) / this.queryInfo.limit)
        let page = []
        const max = this.queryInfo.start + 3 >= sum ? sum : this.queryInfo.start + 3
        for (let i = this.queryInfo.start; i <= max; i++) {
          page.push(i)
        }
        this.page = page
        this.maxPage = max
      },
      switchoverClick(type) {
        this.queryInfo.type = type
        this.getDataList()
      },
      // 翻页
      nextPageClick (type, item) {
        if (type === 1) {
          this.queryInfo.start = item
        } else {
          this.queryInfo.start = this.queryInfo.start >= this.maxPage ? this.queryInfo.start : this.queryInfo.start++
        }
        this.getDataList()
      },
       // 跳转到用户详细页
      openMyHomeClick (id) {
          const { href } = this.$router.resolve({ path: '/myHome', query: { id: id } })
          window.open(href, '_blank');
      },
    }
}
</script>

<style lang="scss" scoped>
.content {
        width: 1200px;
        margin: 0 auto;
    }
    .content_title {
      margin: 20px;
      span {
        cursor: pointer;
        color: #3f3f3f;
        &:hover  {
          &:nth-child(odd) {
            color: #f07a7a;
          }
        }
      }
  }
  .content_view {
    display: flex;

    .content_view_left {
      div {
        width: 240px;
        height: 60px;
        line-height: 60px;
        padding-left: 40px;
        position: relative;
        cursor: pointer;
      }
    }
    .content_view_rigth {
      border: 1px solid #e0e0e0;
      width: 100%;
      padding: 30px;
      .user_view {
        border-bottom: 1px solid #e0e0e0;
        display: flex;
        align-content: center;
        justify-content: flex-start;
        padding-bottom: 10px;
        margin-bottom: 20px;
        cursor: pointer;
        .user_view_left {
          width: 80px;
          height: 80px;
          overflow: hidden;
          border-radius: 100%;
          margin-right: 20px;
          img {
            width: 100%;
          }
        }
        .user_view_rigth {
          display: flex;
          flex-direction: column;
          justify-content: center;
          h4 {
            color: #3a3a3a;
            margin-bottom: 8px;
          }
          div {
            // margin: 2px 0;
            span {
            color: #777777;
            a {
              color: #f07a7a;
            }
          }
          }
          p {
            color: #777777;
          }
        }
      }
    }
    .action {
      background-color: #fcf2f2;
      color: #ff7e7e;
      // transition: 0.3s;
      &::before {
        content: '';
        display: inline-block;
        width: 4px;
        height: 20px;
        background-color: #ff7e7e;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 20px;
      }
    }
  }
  .user_view_bottom {
    display: flex;
    justify-content: center;
    align-content: center;
    div {
      width: 60px;
      height: 60px;
      border-radius: 100%;
      border: 1px solid #ff7e7e;
      line-height: 60px;
      text-align: center;
      font-size: 18px;
      color: #f07a7a;
      margin: 0 10px;
      cursor: pointer;
      &:first-of-type {
        background-color: #f07a7a;
        color: #fff;
      }
      &:hover {
        background-color: #f07a7a;
        color: #fff;
      }
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
