//* 注意：每次调用 $.get() $.post() 的时候，会先调用 $.ajaxPrefilter 这个函数，可以拿到我们给 Ajax 提供的配置对象
$.ajaxPrefilter(function (options) {
    // options 为 Ajax 发起请求的所有数据 
    // 在发起真正的 Ajax 请求之前，统一拼接请求的路径
    options.url = 'http://www.liulongbin.top:3007' + options.url
    console.log(options.url)
});

// 此函可以统一管理 Ajax 中的数据，在 Ajax 调用之前进行修改，相当于一个拦截器