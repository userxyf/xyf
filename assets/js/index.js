$(function () {
    // 调用函数获取用户基本信息
    getUserInfo();

    // 用户退出
    let layer = layui.layer;
    $('#btnLogout').click(function () {
        // 提示用户是否退出
        layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function (index) {
            //do something

            // 清空本地存储的 token
            localStorage.removeItem('token')
            // 跳转到登录页面
            location.href = 'login.html'

            // 关闭 confirm 询问框
            layer.close(index);
        });
    });
});

// 获取用户基本信息(需要权限)
function getUserInfo() {
    $.ajax({
        url: '/my/userinfo',
        method: 'GET',
        // headers 就是请求头配置
        //* 可在baseAPI.js中查看 headers
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！');
            }
            // 调用 renderAvatar 渲染用户的头像
            renderAvatar(res.data);
        },
        // 无论请求成功与失败，complete函数都会执行，防止不登录就进入后台
        //* 可在baseAPI.js中查看 complete
    });
}

function renderAvatar(user) {
    // 获取用户名
    let name = user.nickname || user.username;
    // 欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    // 渲染用户头像
    if (user.user_pic !== null) {
        // 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        // 渲染文字头像
        $('.layui-nav-img').hide();
        let first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}