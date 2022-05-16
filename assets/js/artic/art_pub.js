//! 带my开头的url地址都需要 headers,因为需要权限认证，参考 baseAPI.js

$(function () {
    let layer = layui.layer;
    let form = layui.form;
    let laypage = layui.laypage;

    //* 调用方法
    initCate();
    // 3.调用 `initEditor()` 方法，初始化富文本编辑器
    initEditor();

    //todo 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！');
                }
                //* 使用模板引擎渲染分类的可选项
                let htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                //* 由于 layUI 渲染机制问题，上述下拉菜单无法渲染出来，需要重新渲染
                //* 通知 layUI 重新渲染表单区域的 IU 结构
                form.render();
            }
        });
    }

    // 1. 初始化图片裁剪器
    let $image = $('#image');

    // 2. 裁剪选项
    let options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    };

    // 3. 初始化裁剪区域
    $image.cropper(options);

    //todo 用户选择图片封面
    //* 为选择封面按钮绑定点击事件
    $('#btnChooseImage').click(function () {
        $('#coverFile').click();
    });

    //* 监听 coverFile 的 change 事件， 获取用户选择的文件列表
    $('#coverFile').change(function (e) {
        // 获取文件的列表数组
        let filesList = e.target.files;
        // 判断用户是否选择了文件
        if (filesList.length === 0) {
            return layer.msg('请选择文件！');
        }
        // 1. 拿到用户选择的文件
        let file = filesList[0];
        // 2. 根据选择的文件，创建一个对应的 URL 地址
        let newImgURL = URL.createObjectURL(file);
        // 3. 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options);        // 重新初始化裁剪区域
    });

    //todo 定义文章的状态
    let art_state = '已发布';
    //* 文存为草稿按钮，绑定点击事件处理函数
    $('#btnSave').click(function () {
        art_state = '草稿';
    });

    //todo 为表单绑定 submit 提交事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        //* 基于 form 表单，快速创建一个 FormDData 对象
        // 需要转化为原生Dom对象
        let fd = new FormData($(this)[0]);

        //* 将文章的发布状态转存到 fd 之中
        fd.append('state', art_state);

        //* v 为值， k 为键
        // fd.forEach((v, k) => {
        //     console.log(k, v)
        // });

        //* 将裁剪后的文件输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                //* 将文件对象存储到 fd 中
                fd.append('cover_img', blob)
                //* 发起 ajax 请求
                publishArticle(fd)
            });
    });

    //* 定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            //? 如果向服务器提交的是 FormData 格式的数据，必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                location.href = 'http://127.0.0.1:5500/04-%E5%A4%A7%E4%BA%8B%E4%BB%B6%E9%A1%B9%E7%9B%AE%E8%AF%BE%E7%A8%8B%E8%B5%84%E6%96%99%EF%BC%88%E7%AC%AC%E4%B9%9D%E7%AB%A0%E5%A4%A7%E4%BA%8B%E4%BB%B6%E5%90%8E%E5%8F%B0%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F%E9%A1%B9%E7%9B%AE%EF%BC%89/%E5%A4%A7%E4%BA%8B%E4%BB%B6//article/art_list.html'
            }
        })
    }
});