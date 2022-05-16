//! 带my开头的url地址都需要 headers,因为需要权限认证，参考 baseAPI.js

$(function () {
    let layer = layui.layer;
    let form = layui.form;

    initArtCateList();


    //todo 获取文章列表
    //* 获取文章列表(需要权限)
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            // headers 参考 baseAPI.js
            success: function (res) {
                // 调用 template 渲染数据
                let htmlStr = template('tpl-table', res);
                // 将其插入tbody当中
                $('tbody').html(htmlStr);
            }
        });
    }

    //todo 添加分类列表
    //* 为添加按钮绑定点击事件
    let indexAdd = null;
    $('#btnAddCate').click(function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '240px'],
            title: '添加文章分类',
            content: $('#btn-add').html()
        });
    });

    //* 因为是模板渲染，所以通过代理的形式， 为 form-add 表单绑定 submit 事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！');
                }
                // 重新调用获取文章列表
                initArtCateList();
                layer.msg('新增分类成功！');
                //* 根据指定的索引 index 关闭添加弹出层
                layer.close(indexAdd);
            }
        });
    });

    //todo 修改分类列表
    //* 因为是模板渲染，所以通过代理的形式， 为 btn-edit 绑定修改样式事件
    let indexEdit = null;
    $('tbody').on('click', '.btn-edit', function (e) {
        e.preventDefault();
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '240px'],
            title: '修改文章分类',
            content: $('#btn-edit').html()
        });

        let id = $(this).attr('data-Id');
        // console.log(id)
        //* 获取请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                // 使用插件选择带有 lay-filter 的属性的表单快速赋值
                form.val('form-edit', res.data);
            }
        });
    });

    //* 通过代理的形式，为修改分类的表单绑定 submit 事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！');
                }
                layer.msg('更新分类数据成功！');
                // 关闭弹出层
                layer.close(indexEdit);
                // 重新调用加载列表函数
                initArtCateList();
            }
        });
    });

    //todo 删除列表
    //* 通过代理的形式，为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        let id = $(this).attr('data-Id');
        // 提示用户是否删除
        layer.confirm('确定删除吗', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！');
                    }
                    layer.msg('删除分类成功！');
                    layer.close(index);
                    initArtCateList();
                }
            });
        });
    });
});