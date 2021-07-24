<template>
    <div class="content" @click="particularClick">
        <div class="scenne_content_view" :style="'background-color:' + backgroudColor + ';'">
            <img @load="imageLoad" :src="viewdata.phone_path" alt="">
            <!-- <video v-show="viewdata.type == 2" :src="viewdata.video_path"></video> -->
            <img class="audit_not_view" v-show="viewdata.state == 2" src="../assets/images/not_min.png">
        </div>
        <span class="user_decs_text">{{ viewdata.scene_desc }}</span>
        <div class="user_scene_sum">
            <div @click.stop="clikeClick(viewdata.id,1)">
                <span :class="viewdata.like == false ? 'iconfont icon-aixin' : 'iconfont icon-aixin1'"></span>
                <span>{{ viewdata.likeSum }}</span>
            </div>
            <div>
                <span class="iconfont icon-pinglun1"></span>
                <span>{{ viewdata.commentSum }}</span>
            </div>
            <div @click.stop="clikeClick(viewdata.id,2)">
                <span :class="viewdata.collect == false ? 'iconfont icon-shoucang11' : 'iconfont icon-shoucang4'"></span>
                <span>{{ viewdata.collectSum }}</span>
            </div>
        </div>
        <div class="user_msg_content">
            <img :src="viewdata.userMsg.user_image" alt="">
            <span>{{ viewdata.userMsg.user_name }}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Card',
    data () {
        return {
            // 是否在是移动端
            mobile: false,
           backgroudColor: '#fc9d9b',
           // 颜色
           colorArr: [
               '#458994',
               '#84af9b',
               '#c8c7a8',
               '#facdae',
               '#fc9d9b'
           ]
        }
    },
    created () {
       this.random()
    },
    methods: {
        // 生成随机数选一个颜色
        random () {
            const index = Math.floor(Math.random()*Math.floor(5));
            this.backgroudColor = this.colorArr[index]
        },
        // 点赞与收藏
        async clikeClick (sceneId, type) {
            const { data: res } = await this.$axios.put(`/likeCollet?scene_id=${sceneId}&type=${type}`)
            if (res.meta.status === 401) {
                this.$router.push({ path: this.$route.path, query: { ...this.$route.query, login: new Date().getTime() } })
            }
            if (res.meta.status !== 200) return
            if (type === 1) {
                this.viewdata.like = !this.viewdata.like
                if (this.viewdata.like) {
                    this.viewdata.likeSum++ 
                    return
                }
                this.viewdata.likeSum--
            } else {
                this.viewdata.collect = !this.viewdata.collect
                if (this.viewdata.collect) {
                    this.viewdata.collectSum++ 
                    return
                }
                this.viewdata.collectSum--
            }
        },
        // 跳转到详细页面
        async particularClick () {
            const { href } = this.$router.resolve({ path: '/particular', query: { id: this.viewdata.id } })
            window.open(href, '_blank');
        },
        // 图片加载完成
        imageLoad () {
            this.backgroudColor = '#fff'
        }
    },
    props: {
        viewdata: Object
    },
    watch: {
        
    }
}
</script>

<style lang="scss" scoped>
    .content {
        width: 215px;
        border: 1px solid #e0e0e0;
        border-radius: 20px;
        overflow: hidden;
        margin-top: 25px;
        transition: .4s;
        .scenne_content_view {
            min-height: 100px;
            width: 100%;
            position: relative;
            img {
                display: block;
                width: 100%;
                height: 100%;
                cursor: pointer;
                margin-bottom: 5px;
            }
            video {
                display: block;
                width: 100%;
                cursor: pointer;
                margin-bottom: 5px;
            }
            .audit_not_view {
                position: absolute;
                width: 180px;
                height: 180px;
                top: 20%;
                left: 50%;
                transform: translateX(-50%);
            }
        }
        .user_decs_text {
            color: #545454;
            font-size: 14px;
            padding: 8px;
            display: block;
        }
        .user_scene_sum {
            padding: 5px 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            div {
                cursor: pointer;
            }
            span {
                color: #8b8b8b;
            }
            .iconfont {
                font-size: 22px;
            }
            .icon-aixin1 {
                color: #f89090;
            }
            .icon-shoucang4 {
                color: #f89090;
            }
        }
        .user_msg_content {
            padding: 10px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            img {
                width: 40px;
                // height: 40px;
                border-radius: 100%;
                cursor: pointer;
            }
            span {
                margin-left: 15px;
                color: #f89090;
                cursor: pointer;
            }
        }
        &:hover {
            transform: translateY(-12px);
            box-shadow: 3px 3px 5px 1px #c4c3c3;
        }
    }
</style>