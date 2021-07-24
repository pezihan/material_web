<template>
    <div v-if="!errorview" class="content">
        <div class="background_imaegs_view">
            <img :src="userMsg.background" alt="">
            <button>更换背景</button>
            <div v-if="userMsg.region">
                <span class="iconfont icon-weizhi1"></span>
                <span>{{ userMsg.region }}</span>
            </div>
        </div>
        <div class="user_message_view">
            <div class="user_image_view">
                <img :src="userMsg.user_image" alt="">
            </div>
            <h4>{{ userMsg.user_name }}</h4>
            <div class="user_flash">关注 {{ userMsg.holdSum | holdFansFiltra }} | 粉丝 {{ userMsg.fansSum | holdFansFiltra }}</div>
            <p>{{ userMsg.signature == null || userMsg.signature == "" ? '暂无简介' : userMsg.signature }}</p>
            <button v-if="buttonShow">编辑</button>
        </div>
        <div class="content_view">
            <div class="content_left">
                <div class="scnene_contewnt" v-for="(item1, index) in flexList" :key="index">
                    <Card v-for="item2 in item1.list" :key="item2.id" :viewdata="item2"></Card>
                </div>
            </div>
            <div class="content_rigth">
                <div :class="querinfo.type == 1 ? 'btn_action' : ''" @click="switchoverClick(1)">
                    <span class="iconfont icon-tupian"></span>
                    <span>图片</span>
                </div>
                <div :class="querinfo.type == 2 ? 'btn_action' : ''" @click="switchoverClick(2)">
                    <span class="iconfont icon-shipin"></span>
                    <span>视频</span>
                </div>
                <div :class="querinfo.type == 3 ? 'btn_action' : ''" @click="switchoverClick(3)">
                    <span class="iconfont icon-tianjia"></span>
                    <span>收藏</span>
                </div>
            </div>
        </div>
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
            // 错误页面
            errorview: false,
            // 用户编辑按钮显示隐藏
            buttonShow: false,
            // 用户信息
            userMsg: '',
            // 用户素材信息
            userDataList: [],
            // 格式化后的素材信息数据
            flexList: [],
            // 提交服务器的数据
            querinfo: {
                user_id: '',
                type: 1,
                start: 1,
                limit: 30
            },
            // 资源访问路径
            path: "",
            // 是否可以继续加载数据
            loadingShow: true
        }
    },
    mounted () {
        this.path = this.$cookies.get('path')
        const query = this.$route.query
        if (!query.id) return this.errorview = !this.errorview
        this.querinfo.user_id = query.id
        if (query.type) this.querinfo.type = query.type
        this.getUserMsg()
        this.getDataList()
        window.addEventListener('scroll', this.scrollviewuser)
    },
    methods: {
        // 获取用户信息
        async getUserMsg () {
            const { data: res } = await this.$axios.get('/userMsg', { params: { user_id: this.querinfo.user_id } })
            if (res.meta.status !== 200) return this.errorview = !this.errorview
            res.data.background = res.data.background === "" || res.data.background === null ? '/_nuxt/assets/images/home.jpg' : this.path.images + res.data.background
            res.data.user_image = this.path.user_images + res.data.user_image
            const userMsg = window.sessionStorage.getItem('userMsg') || ""
            if (userMsg && Number(JSON.parse(userMsg).id) === Number(this.querinfo.user_id) ) {
                this.buttonShow = true
            }
            this.userMsg = res.data
        },
        // 数据格式化
        viewData () {
            let flexList = []
            const data = this.userDataList
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
        // 获取素材信息
        async getDataList () {
            const { data: res } = await this.$axios.get('/usermaterial', { params: this.querinfo })
            if (res.meta.status !== 200) return this.errorview = !this.errorview
            if (res.data.length === 0) return this.loadingShow = false
             res.data.forEach(item => {
                item.phone_path = this.path.images + item.phone_path
                item.video_path = this.path.video + item.video_path
                item.userMsg.user_image = this.path.user_images + item.userMsg.user_image
            })
            this.userDataList = [...this.userDataList, ...res.data]
            this.viewData()
        },
        // 切换类型
        switchoverClick (type) {
            this.querinfo.start = 1
            this.querinfo.type = type
            this.userDataList = []
            this.flexList = []
            this.getDataList()
        },
        // 滚动事件
        scrollviewuser () {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const allHeight = Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight)
            if (allHeight - scrollTop <= 1000 && this.loadingShow == true) {
                this.querinfo.start++
                this.getDataList()
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .content {
        width: 1200px;
        margin: 0 auto;
    }
    .background_imaegs_view {
        width: 100%;
        height: 300px;
        margin-top: 20px;
        overflow: hidden;
        position: relative;
        img {
            width: 100%;
            display: block;
            position: absolute;
            top: 50%;
            transform: translateY(-50%); 
            z-index: -1;
        }
        &:hover button {
            display: block;
        }
        button {
            width: 100px;
            height: 30px;
            background-color: rgba($color: #000000, $alpha: .6);
            color: #fff;
            font-size: 14px;
            border-radius: 80px;
            line-height: 30px;
            position: absolute;
            top:5px;
            right: 5px;
            display: none;
        }
        div {
            position: absolute;
            bottom:5px;
            left: 5px;
            span {
                color: #fff;
            }
        }
    }
    .user_message_view {
        width: 100%;
        position: relative;
        margin-bottom: 50px;
        .user_image_view {
            width: 100px;
            height: 100px;
            overflow: hidden;
            border-radius: 100%;
            margin: 0 auto;
            margin-top: -50px;
            margin-bottom: 15px;
            img {
                width: 100%;
            }
        }
        h4 {
            width: 100%;
            text-align: center;
        }
        .user_flash {
            width: 100%;
            text-align: center;
            margin: 10px 0;
            color: #777777;
        }
        p {
            width: 100%;
            text-align: center;
            color: #777777;
        }
        button {
            width: 80px;
            height: 30px;
            background-color: #777777;
            color: #fff;
            border-radius: 50px;
            line-height: 30px;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            margin-top: 10px;
        }
    }
    .content_view {
        width: 100%;
        display: flex;
        justify-content:space-between;
        // margin-bottom: 50px;
        .content_left {
            width: 950px;
            border-top: 2px solid #d4d4d4;
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
            .scnene_contewnt {
                flex: 16.66%;
            }
        }
        .content_rigth {
            border-top: 2px solid #d4d4d4;
            margin-top: 20px;
            padding-top: 25px;
            width: 250px;
            // border: 1px solid #000000;
            padding-left: 20px;
            div {
                width: 100%;
                height: 40px;
                padding: 0px 5px;
                margin-bottom: 10px;
                line-height: 40px;
                cursor: pointer;
                &:hover {
                    background-color: #f3f3f3;
                }
                .iconfont {
                    font-size: 30px;
                    vertical-align: middle;
                }
                span {
                    color: #777777;
                    margin-right: 5px;
                    font-size: 16px;
                }
                .icon-tupian { color: #feaaaa; }
                .icon-shipin { color: #ffcc85; }
                .icon-tianjia { color: #acd3f4; }
            }
        }
        .btn_action {
            background-color: #f3f3f3;
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
</style>