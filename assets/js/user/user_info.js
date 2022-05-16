//! 带my开头的url地址都需要 headers,因为需要权限认证，参考 baseAPI.js

$(function () {
    let form = layui.form
    let layer = layui.layer

    // 自定义验证规则
    //* 将其添加到 input 中的 lay-verify 属性中即可验证
    form.verify({
        nickname: function (value) {
            // value为昵称框的值
            if (value.length > 6) {
                return '昵称的长度必须在 1~6 字符之间'
            }
        }
    })

    initUserInfo()

    //* 初始化用户的信息(需要权限)
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            //* headers
            //* 可在baseAPI.js中查看 headers
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！')
                }
                // console.log(res)
                //* 使用 layUI 中的 form.val()为表单赋值，必须给表单添加 lay-filter=“”，详情参考官网文档
                form.val('formUserInfo', res.data)
            }
        })
    }

    //* 重置表单数据
    $('#btnReset').click(function (e) {
        // 阻止默认的重置行为
        e.preventDefault()
        // 重新初始化用户信息
        initUserInfo()
    })

    //* 监听修改表单的提交事件
    $('.layui-form').submit(function (e) {
        // 阻止默认提交行为
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            // 快速获取表单数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改数据失败！')
                }
                layer.msg('修改数据成功！')
                //* 调用父页面 index.html 中的方法，重新渲染头像和用户信息 index.js
                // 因为数据在 iframe 页面中 index为user_info的父页面，所以 window.parent
                window.parent.getUserInfo()
            }
        })
    })
})