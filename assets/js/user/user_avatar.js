//! 带my开头的url地址都需要 headers,因为需要权限认证，参考 baseAPI.js

$(function () {
    let layer = layui.layer;

    // 1.1 获取裁剪区域的 DOM 元素
    let $image = $('#image');
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    };

    // 1.3 创建裁剪区域
    $image.cropper(options);


    //* 为上传图片按钮绑定点击事件
    $('#btnChooseImage').click(function () {
        // 调用input选择文件的点击事件
        $('#file').click();
    });

    //* 为文件选择框绑定 change 事件
    $('#file').change(function (e) {
        // 获取用户选择的文件 target.files 为数据e中的一项
        let filelist = e.target.files;
        if (filelist.length === 0) {
            return layer.msg('请选择照片！');
        }

        // 1.拿到用户选择的文件
        let file = e.target.files[0];
        // 2.根据选择的文件，创建一个对应的 URL 地址
        let newImgURL = URL.createObjectURL(file);
        // 3.先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options);        // 重新初始化裁剪区域
    });

    //* 为确定按钮绑定点击事件
    $('#btnUpload').click(function () {
        // 1.将裁剪后的图片，输出为 base64 格式的字符串
        let dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png');       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        
        // 2.将头像上传，进行头像更换
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar:dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更换头像失败！')
                }
                layer.msg('更换头像成功！')
                //* 调用父页面 index.html 中的方法，重新渲染头像和用户信息 index.js
                // 因为数据在 iframe 页面中 index为user_info的父页面，所以 window.parent
                window.parent.getUserInfo()
            }
        })
    })
});