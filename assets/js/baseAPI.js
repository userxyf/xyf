//* 注意：每次调用 $.get() $.post() 的时候，会先调用 $.ajaxPrefilter 这个函数，可以拿到我们给 Ajax 提供的配置对象
$.ajaxPrefilter(function (options) {
    // options 为 Ajax 发起请求的所有数据 
    // 在发起真正的 Ajax 请求之前，统一拼接请求的路径
    options.url = 'http://www.liulongbin.top:3007' + options.url
    // console.log(options.url)

    //* 统一为有权限的接口，设置 headers 请求头
    // 判断是否有 /my/ 字符
    if (options.url.indexOf('/my/')) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    //* 全局统一挂载 complete 回调函数
    options.complete = function (res) {
        // console.log(res)
        // 可以使用 res.responseJSON 拿到服务器响应回来的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //强制清除 token
            localStorage.removeItem('token')
            //强制跳转到登录页面
            location.href = 'http://127.0.0.1:5500/04-%E5%A4%A7%E4%BA%8B%E4%BB%B6%E9%A1%B9%E7%9B%AE%E8%AF%BE%E7%A8%8B%E8%B5%84%E6%96%99%EF%BC%88%E7%AC%AC%E4%B9%9D%E7%AB%A0%E5%A4%A7%E4%BA%8B%E4%BB%B6%E5%90%8E%E5%8F%B0%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F%E9%A1%B9%E7%9B%AE%EF%BC%89/%E5%A4%A7%E4%BA%8B%E4%BB%B6/login.html'
        }
    }
});

// 此函可以统一管理 Ajax 中的数据，在 Ajax 调用之前进行修改，相当于一个拦截器


