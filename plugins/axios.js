import NProgress from 'nprogress'
import 'nprogress/nprogress.css'


export default async function ({$axios, redirect, req, $cookies })  {
    // 数据访问前缀
    if(process.server){
        $axios.defaults.baseURL = 'http://127.0.0.1:5000/user';
        const path = $cookies.get('path')
        const host = req.headers.host.substring(0, req.headers.host.lastIndexOf(':'))
        if (path == undefined || path == '' || path == null) {  // 写入资源访问路径到cookie
            const { data } = await $axios.$get('http://127.0.0.1:5000/user/resource')
            // const newData = {
            //     images: `http://${host}:5000${data.images}`,
            //     video: `http://${host}:5000${data.video}`,
            //     user_images: `http://${host}:5000${data.user_images}`
            // }
            $cookies.set('path', data)
        }
    }
    if(process.client){
        $axios.defaults.baseURL = '/user';
        const token = window.localStorage.getItem('token') || ""
        if (token !== "") {
            $cookies.set('token', token)
        }
    }
    // request拦截器
    $axios.onRequest(config => {
        if(process.client){
            // 客户端下，请求进度条开始
            NProgress.start();
        }
        // 将获取到token加入到请求头中
        config.headers.authorization = $cookies.get('token') || ""
    });
    $axios.onResponse(response => {
        if(process.client){
            // 客户端下， 请求进度条结束
            NProgress.done();
            // token过期
            if (response.data.meta.status === 401) {
                $cookies.remove('token')
                window.localStorage.clear()
                // 重新刷新改页面
                // location.reload()
            }
        }
    })
}