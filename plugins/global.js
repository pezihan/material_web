// import Card from '../components/Card.vue'

import Vue from 'vue'
import md5 from 'js-md5';
Vue.prototype.$md5 = md5;

// Vue.component('Card', Card)

Vue.filter('signatureFiltra', function(data) {
    if (data === "" || data === null || data === undefined) {
        return '无签名'
    } else {
        return data
    }
})

// 格式评论时间
Vue.filter('commentTimeFiltra', function (data) {
    const time = new Date(data)
    const year = time.getFullYear()
    const month = time.getMonth() + 1
    const date = time.getDate()
    const hour = time.getHours() < 10 ? `0${time.getHours()}` : time.getHours()
    const Minut = time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes()
    return `${year}年${month}月${date}日 ${hour}:${Minut}`
})