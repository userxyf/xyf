// Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NjkxMSwidXNlcm5hbWUiOiJ4eWYiLCJwYXNzd29yZCI6IiIsIm5pY2tuYW1lIjoiIiwiZW1haWwiOiIiLCJ1c2VyX3BpYyI6IiIsImlhdCI6MTY1MjM1MjQyMCwiZXhwIjoxNjUyMzg4NDIwfQ.K9PJ3zL_224E-niSHxLkXvgXD3UfufF1PuMaWR9fHAY
$(function () {
    // 点击“去注册账号”链接
    $('#link_reg').click(function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 点击“去登录”链接
    $('#link_login').click(function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    //* 从 layUI 中获取 form layer 对象
    let form = layui.form
    let layer = layui.layer

    //* 通过 form.verify() 函数自定义检验规则
    //* 将其添加到 input 中的 lay-verify 属性中即可验证
    //* pwd或者repwd添加给了谁value的值就表示谁表单的值
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 校验两次密码是否一致
        repwd: function (value) {
            // value为确认密码框的值
            // 分别拿到注册密码框和确认密码框的内容，进行比较
            let pwd = $('.reg-box [name=password]').val()
            if (pwd != value) {
                return '两次密码不一致'
            }
        }
    })

    //* 监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        // 阻止默认提交行为
        e.preventDefault()
        $.post('/api/reguser',
            { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }, function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg('注册成功，请登录')
            // 注册成功自动转登录
            $('#link_login').click()
        })
    })

    //* 监听登录表单的提交事件
    $('#form_login').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 快速获取表单数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！')
                }
                layer.msg('登录成功！')
                //* 将登录成功得到的 token 值保存到本地
                localStorage.setItem('token', res.token)
                // 跳转到后台
                location.href = 'index.html'
            }
        })
    })
})