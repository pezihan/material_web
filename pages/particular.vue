<template>
    <div v-if="!errorview" class="content" ref="contentRef">
        <div class="content_left">
            <div class="user_content">
                <div class="user_image" @click="openMyHomeClick(viewdata.userMsg.id)">
                    <img :src="viewdata.userMsg.user_image">
                </div>
                <div class="user_msg_list">
                    <h4>{{ viewdata.userMsg.user_name }}</h4>
                    <span>{{ viewdata.up_time | commentTimeFiltra }}</span>
                </div>
                <button @click="holdClick">{{ viewdata.userMsg.hold === true ? '取消关注' : '关注' }} </button>
            </div>
            <h4 class="content_scene_desc">{{ viewdata.scene_desc }}</h4> 
            <div class="content_view">
                <img  v-show="viewdata.type == 1" :src="viewdata.phone_path" alt="">
                <div v-show="viewdata.type == 2" class="video_content">
                    <img @load="imageLoad($event)" ref="ImageRef" :width="videoHeight" :height="videoWidth" :src="viewdata.phone_path" alt="">
                    <video id="video" :src="viewdata.video_path" ref="videoRef" :width="videoWidth" :height="videoHeight" preload="auto" poster autoplay controls>
                        <!-- <source :src="viewdata.video_path"  type="video/mp4">
                        <source :src="viewdata.video_path"  type="video/MOV">
                        <source :src="viewdata.video_path"  type="video/mov"> -->
                    </video>
                </div>
            </div>
            <div class="content_button">
                <div>
                    <span  @click.stop="clikeClick(viewdata.id,1)" :class="viewdata.like == false ? 'iconfont icon-aixin' : 'iconfont icon-aixin1'"></span>
                    <span>{{ viewdata.likeSum }}</span>
                </div>
                <div @click="contentSendShow = !contentSendShow">
                    <span class="iconfont icon-pinglun"></span>
                    <span class="commit_text">评论</span>
                </div>
                <div>
                    <span @click.stop="clikeClick(viewdata.id,2)" :class="viewdata.collect == false ? 'iconfont icon-shoucang2' : 'iconfont icon-shoucang4'"></span>
                    <span>{{ viewdata.collectSum }}</span>
                </div>
                <div v-if="deleteBtnShow" @click.stop="deleteClick(viewdata.id, viewdata.type)">
                    <span class="iconfont icon-shanchu"></span>
                    <span class="delete_text">删除</span>
                </div>
                <div @click="downloadClick(viewdata.type == 1 ? viewdata.phone_path : viewdata.video_path)">
                    <span class="iconfont icon-xiazai"></span>
                    <span class="commit_text">下载</span>
                </div>
            </div>
            <div :class="contentSendShow == false ? 'content_send_animation' : 'content_send content_send_animation'">
                <span class="content_send_tilte">评论</span>
                <div>
                    <textarea v-model="textContent" type="text" placeholder="说些什么吧"></textarea>
                    <div class="content_send_button">
                        <span @click="contentSendShow = false">取消</span>
                        <button @click="sendComentClick(viewdata.id, 1)">发送</button>
                    </div>
                </div>
            </div>
        </div>
        <div v-show="commentList.length != 0" class="comment_title">
                <div class="comment_title_h4">
                    <div></div>
                    <h2>所有评论</h2>
                </div>
                <div class="content_view" v-for="item in commentList" :key="item.id">
                    <div class="content_view_user">
                        <img :src="item.user_image" alt="" @click="openMyHomeClick(item.user_id)">
                        <div class="view_user_text">
                            <h4>{{ item.user_name }}</h4>
                            <span>{{ item.comment_time | commentTimeFiltra }}</span>
                        </div>
                        <span @click="showSendShow(1, item.id)">回复</span>
                    </div>
                    <p>{{ item.comment_text }}</p>
                    <div v-show="item.replyShow" class="view_user_button">
                        <textarea v-model="textContent" type="text" placeholder="说些什么吧"></textarea>
                        <button @click="sendComentClick(item.id, 2)">发送</button>
                        <span>取消</span>
                    </div>
                    <div class="content_two_view" v-for="item2 in item.commentTwo" :key="item2.id">
                        <div class="content_view_user">
                            <img :src="item2.user_image" alt="" @click="openMyHomeClick(item2.user_id)">
                            <div class="view_user_text">
                                <h4>{{ item2.user_name }}</h4>
                                <span>{{ item2.comment_time | commentTimeFiltra }}</span>
                            </div>
                            <span @click="showSendShow(2, item2.id)">回复</span>
                        </div>
                        <p>{{ item2.comment_text }}</p>
                        <div v-show="item2.replyShow" class="view_user_button">
                            <textarea v-model="textContent" type="text" placeholder="说些什么吧"></textarea>
                            <button @click="sendComentClick(item2.comment_id, 2)">发送</button>
                            <span>取消</span>
                        </div>
                    </div>
                </div>
                <div v-show="!notCommentShow" class="more_comment" @click="moreCommentClick">更多评论</div>
            </div>
            <div class="notcommentview" v-show="notCommentShow">
                <h2>没有更多评论了</h2>
            </div>
        <div class="content_rigth" ref="recomRef">
            <div class="content_view" v-for="item in similarityData" @click="particularClick(item.id)" :key="item.id">
                <div class="content_view_img">
                    <img :src="item.phone_path" alt="">
                </div>
                <div class="content_view_title">
                    <a>{{ item.scene_desc }}</a>
                    <span>{{ item.likeSum }}个喜欢 ~ {{ item.collectSum }}人收藏</span>
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
    name: 'particular',
    data() {
        return {
            // 素材数据
            viewdata: {
                userMsg: {}
            },
            // 评论请求参数
            commentInfo: {
                start: 1,
                limit: 5,
                scene_id: ''
            },
            // 评论输入框文字内容
            textContent: '',
            // 评论数据
            commentList: [],
            // 相似素材数据
            similarityData: [],
            // 评论输入框显示与隐藏
            contentSendShow: false,
            // 错误页面显示
            errorview: false,
            // 资源访问路径
            path: {},
            // 视频宽
            videoWidth: '100%',
            // 视频高
            videoHeight: '',
            // 没有评论是显示提示
            notCommentShow: false,
            // 是否显示删除按钮
            deleteBtnShow: false
        }
    },
    created () {
        this.path = this.$cookies.get('path')
    },
    mounted () {
        this.getViewData()
        this.similarity()
        this.getComment()
        window.addEventListener('resize', this.recomdetailsView)
        window.addEventListener('scroll', this.recomdetailsView)
    },
    methods: {
        // 判断移动端
        _isMobile() {
            let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
            return flag
        },
        // 获取素材信息
        async getViewData () {
            const id = this.$route.query.id
            const { data: res } = await this.$axios.get('/particulars', { params: { scene_id: id } })
            if (res.meta.status !== 200) return this.errorview = true
            res.data.video_path = res.data.video_path ==="" ? "" : `${this.path.video}${res.data.video_path}`
            res.data.phone_path = res.data.phone_path === "" ? "" : `${this.path.images}${res.data.phone_path}`
            res.data.userMsg.user_image = `${this.path.user_images}${res.data.userMsg.user_image}`
            const userMsg = window.localStorage.getItem('userMsg') || ""
            if (userMsg && Number(JSON.parse(userMsg).id) === Number(res.data.userMsg.id) ) {
                this.deleteBtnShow = true
            }
            this.viewdata = res.data
        },
        // 获取类似素材推荐
        async similarity () {
            const id = this.$route.query.id
            const { data: res } = await this.$axios.get('/similarity', { params: { scene_id: id } })
            if (res.meta.status !== 200) return this.errorview = true
            res.data.forEach(item => {
                item.video_path = item.video_path ==="" ? "" : `${this.path.video}${item.video_path}`
                item.phone_path = item.phone_path === "" ? "" : `${this.path.images}${item.phone_path}`
            })
            this.similarityData = res.data
        },
        // 跳转到详细页面
        async particularClick (id) {
            location.replace(`/particular?id=${id}`)
        },
        // 点赞与收藏
        async clikeClick (sceneId, type) {
            const { data: res } = await this.$axios.put(`/likeCollet?scene_id=${sceneId}&type=${type}`)
            if (res.meta.status === 401) {
                this.$router.push({ path: this.$route.path, query: { login: new Date().getTime() } })
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
        // 删除
        async deleteClick (id, type) {
            const { data: res } = await this.$axios.delete('/deleteMaterial', { params: { scene_id: id } })
            if (res.meta.status !== 200) return
            this.$router.push({ path: '/myHome', query: { id: this.viewdata.user_id, type: type } })
        },
        // 关注与取消关注
        async holdClick () {
            const { data: res } = await this.$axios.put(`/hold?user_id=${this.viewdata.userMsg.id}`)
            if (res.meta.status === 401) {
                this.$router.push({ path: this.$route.path, query: { login: new Date().getTime() } })
            }
            if (res.meta.status !== 200) return
            this.viewdata.userMsg.hold = !this.viewdata.userMsg.hold
        },
        // 获取评论
        async getComment () {
            this.commentInfo.scene_id = this.$route.query.id
            const { data: res } = await this.$axios.get('/getComment', { params: this.commentInfo })
            if (res.meta.status !== 200) return this.notCommentShow = true
            res.data.forEach(item => {
                item.user_image = this.path.user_images + item.user_image
                item.replyShow = false
                item.commentTwo.forEach(item2 => {
                    item2.user_image = this.path.user_images + item2.user_image
                    item2.replyShow = false
                })
            })
            this.commentList = [...this.commentList, ...res.data]
            if (res.data.length < 5) {
                this.notCommentShow = true
            } else {
                this.notCommentShow = false
            }
        },
        // 跳转到用户详细页
        openMyHomeClick (id) {
            const { href } = this.$router.resolve({ path: '/myHome', query: { id: id } })
            window.open(href, '_blank');
        },
        // 发送评论
        async sendComentClick(id, type) {
            if (this.textContent === '') return
            let data = []
            if (type === 1) {
                const { data: res } = await this.$axios.post('/comment', { scene_id: id, comment_text: this.textContent })
                data = res
            } else {
                const { data: res } = await this.$axios.post('/reply', { comment_id: id, comment_text: this.textContent })
                data = res
            }
            if (data.meta.status === 401) {
                this.$router.push({ path: this.$route.path, query: { ...this.$route.query, login: new Date().getTime() } })
            }
            if (data.meta.status === 200) {
                    this.commentInfo.start = 1
                    this.commentList = []
                    this.getComment()
                    this.textContent = ''
                }
        },
        // 回复评按钮点击
        showSendShow (type, id) { // replyShow
            this.contentSendShow = false
            this.commentList.forEach(item => {
                if (type === 1 && item.id === id) {
                    item.replyShow = true
                } else {
                    item.replyShow = false
                }
                item.commentTwo.forEach(item2 => {
                    if (type !== 1 && item2.id === id) {
                        item2.replyShow = true
                    } else {
                        item2.replyShow = false
                    }
                })
            })
        },
        // 加载更多评论
        moreCommentClick () {
            this.commentInfo.start++
            this.getComment()
        },
        imageLoad(ev) {
            const width = ev.path[0].naturalWidth
            const height = ev.path[0].naturalHeight
            console.log(width, height);
            if (width > height) {
                this.videoWidth = '100%'
                this.videoHeight = ''
            } else {
                this.videoWidth = ''
                this.videoHeight = '100%'
            }
        },
        // 推荐框自适应
        recomdetailsView () {
            const viewLeft = this.$refs.contentRef.offsetLeft
            this.$refs.recomRef.style.position = "fixed"
            this.$refs.recomRef.style.top = '100px'
            this.$refs.recomRef.style.left = viewLeft + 820 + 'px'
        },
        // // 截取视频图片
        // initialize () {
        //     this.$refs.videoRef.addEventListener('loadeddata', function () {
        //         var canvas = document.createElement("canvas");
        //         canvas.width = this.$refs.videoRef.videoWidth * 0.8
        //         canvas.height = this.$refs.videoRef.videoHeight * 0.8
        //         canvas.getContext('2d').drawImage(this.$refs.videoRef, 0, 0, canvas.width, canvas.height)
        //         this.imgUrl = canvas.toDataURL("image/png")
        //     }.bind(this))
        // },
        // 下载视频或图片
        async downloadClick (url) {
           const elt = document.createElement('a');
            elt.setAttribute('href', url);
            const name = url.substring((url.length - 20),url.length) + Number(this.viewdata.type) === 1 ? '.jpeg' : '.mp4' 
            elt.setAttribute('download', name)
            elt.style.display = 'none';
            document.body.appendChild(elt);
            elt.click();
            document.body.removeChild(elt);
        }
    }
}
</script>

<style lang="scss" scoped>
    .content {
        width: 1200px;
        margin: 0 auto;
        position: relative;
    }
    .content_left {
        width:  800px;
        margin: 20px 0;
        border: 1px solid #e0e0e0;
        .user_content {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding: 15px;
            .user_image {
                width: 60px;
                height: 60px;
                border-radius: 100%;
                overflow: hidden;
                background-color: #f5b1b1;
                cursor: pointer;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .user_msg_list {
                width: 80%;
                margin-left: 20px;
                h4 {
                    font-size: 20px;
                }
            }
            button {
                background-color: #f07a7a;
                width: 120px;
                height: 35px;
                color: #fff;
                border-radius: 20px;
            }
        }
        .content_scene_desc {
            padding: 15px;
            color: #444444;
            font-size: 18px;
        }
        .content_view {
            img {
                width: 100%;
            }
            .video_content {
                height: 700px;
                background-color: #1a1a1a;
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
                overflow: hidden;
                img {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%) scale(1.1);
                    width: 100%;
                    // height: 100%;
                    filter: blur(20px);
                }
                video {
                    z-index: 800;
                    // width: 100%;
                    // height: 100%;
                }
            }
        }
        .content_button {
            margin-top: 20px;
            width: 100%;
            height: 70px;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid #e0e0e0;
            border-left: none;
            border-right: none;
            div {
                width: 200px;
                height: 40px;
                border-right: 1px solid #e0e0e0;
                display: flex;
                justify-content: center;
                align-items: center;
                .iconfont {
                    font-size: 25px;
                    margin-right: 10px;
                }
                .delete_text:hover {
                    color: #f07a7a;
                }
                span {
                    color: #666666;
                    cursor: pointer;
                }
                .commit_text {
                    &:hover {
                        color: #f07a7a;
                    }
                }
                .icon-aixin1, .icon-shoucang4 {
                    color: #f07a7a;
                    font-size: 25px;
                }
                &:last-of-type {
                    border: none;
                }
                button {
                    background-color: #f07a7a;
                    width: 100px;
                    height: 35px;
                    border-radius: 20px;
                    color: #fff;
                }
            }
        }
        .content_send_animation {
            overflow: hidden;
            height: 0;
        }
        .content_send {
            width: 100%;
            height: 160px;
            overflow: hidden;
            background-color: #fafafa;
            display: flex;
            justify-content: flex-start;
            padding: 15px;
            transition: .5s;
            border-bottom: 1px solid #e0e0e0;
            .content_send_tilte {
                width: 80px;
            }
            div {
                width: 100%;
                position: relative;
                textarea {
                    padding: 10px;
                    width: 100%;
                    height:80px;
                    border: 1px solid #f07a7a;
                    border-radius: 5px;
                    color: #777777;
                }
                .content_send_button {
                    width: 135px;
                    right: 0px;
                    position: absolute;
                    margin-top: 10px;
                    span {
                        margin-right: 10px;
                        font-size: 14px;
                        color: #777777;
                        cursor: pointer;
                        &:hover {
                            color: #f07a7a;
                        }
                    }
                    button {
                        background-color: #f07a7a;
                        width: 80px;
                        height: 35px;
                        color: #fff;
                    }
                }
            }
        }
    }
    .notcommentview {
        width: 800px;
        margin: 40px 0;
        h2 {
            font-size: 20px;
            color: #f07a7a;
            text-align: center;
        }
    }
    .comment_title {
        width: 800px;
            .comment_title_h4 {
                margin: 10px;
                div {
                    width: 6px;
                    height: 20px;
                    border-radius: 5px;
                    background-color: #f07a7a;
                    display: inline-block;
                    vertical-align: middle;
                    margin-right: 10px;
                }
                h2 {
                    display: inline-block;
                    vertical-align: middle;
                    font-size: 20px;
                }
            }
            .content_view {
                border-top: 1px solid #e0e0e0;
                padding: 10px;
                margin-bottom: 20px;
                .content_view_user {
                    display: flex;
                    justify-content: space-between;
                    align-content: center;
                    margin-bottom: 10px;
                    img {
                        width: 50px;
                        height: 50px;
                        border-radius: 100%;
                        cursor: pointer;
                    }
                    .view_user_text {
                        width: 660px;
                        h4 {
                            font-size: 18px;
                            margin-bottom: 5px;
                        }
                    }
                    span {
                        color: #777777;
                        cursor: pointer;
                        margin-top: 10px;
                        &:hover {
                            color: #f07a7a;
                        }
                    }
                }
                p {
                    margin-left: 70px;
                    color: #444444;
                }
                .view_user_button {
                    width: 700px;
                    height: 140px;
                    position: relative;
                    margin-left: 70px;
                    margin-top: 20px;
                    textarea {
                        padding: 10px;
                        width: 100%;
                        height:80px;
                        border: 1px solid #f07a7a;
                        border-radius: 5px;
                        color: #777777;
                        margin-bottom: 10px;
                    }
                    span {
                        float: right;
                        margin-right: 10px;
                        font-size: 14px;
                        color: #777777;
                        cursor: pointer;
                        margin-top: 10px;
                        &:hover {
                            color: #f07a7a;
                        }
                    }
                    button {
                        float: right;
                        background-color: #f07a7a;
                        width: 80px;
                        height: 35px;
                        color: #fff;
                    }
                }
            }
            .more_comment {
                    width: 100%;
                    height: 70px;
                    border: 1px solid #e0e0e0;
                    text-align: center;
                    line-height: 68px;
                    margin-bottom: 50px;
                    font-size: 20px;
                    color: #f87979;
                    cursor: pointer;
                    &:hover {
                        background-color: #eeeeee;
                    }
                }
        }
    .content_two_view {
        margin-left: 70px;    
        background-color: #f5f5f5;
        padding: 10px;
        margin-top: 20px;
        border-radius: 8px;
        .view_user_text {
            width: 560px !important;
        }
        .view_user_button {
            width: 600px !important;
        }
    }
    .content_rigth {
        width:  380px;
        position: absolute;
        right: 0;
        top: 0;
        border: 1px solid #e0e0e0;
        .content_view {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin: 15px;
            .content_view_img {
                width: 100px;
                height: 100px;
                overflow: hidden;
                position: relative;
                cursor: pointer;
                border-radius: 5px;
                video ,img{
                    width: 100%;
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    display: block;
                }
            }
            .content_view_title {
                margin-left: 20px;
                a {
                    width: 220px;
                    display:-webkit-box;
                    word-break: break-all;
                    overflow:hidden;
                    -webkit-box-orient:vertical;
                    -webkit-line-clamp:2;
                    margin-bottom: 10px;
                    cursor: pointer;
                    &:hover {
                        color: #f07a7a;
                    }
                }
                span {
                    display: block;
                    font-size: 15px;
                    color: #777777;
                }
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