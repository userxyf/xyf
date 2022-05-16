//! 带my开头的url地址都需要 headers,因为需要权限认证，参考 baseAPI.js

$(function () {
    let layer = layui.layer;
    let form = layui.form;
    let laypage = layui.laypage;

    //* 定义美化实践的过滤器
    // 在列表数据的模板引擎进行调用
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date);

        let y = padZero(dt.getFullYear());
        let m = padZero(dt.getMonth() + 1);
        let d = padZero(dt.getDate());

        let hh = padZero(dt.getHours());
        let mm = padZero(dt.getMinutes());
        let ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    };
    //* 定义补0函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }

    //? 定义一个查询的参数对象，奖来请求数据的时候，需要将请求参数对象提交到服务器
    let q = {
        pagenum: 1, // 页码值（默认初始页为第一页）
        pagesize: 2, // 每页显示多少条数据
        cate_id: '', // 文章分类的 Id
        sate: '', // 文章的状态，可选值有：已发布、草稿
    };

    //* 调用方法
    initTable();
    initCate();

    //todo 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！');
                }
                //* 使用模板引擎渲染页面的数据
                let htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                //* 调用渲染分页的方法
                renderPage(res.total);
            }
        });
    }

    //todo 初始化文章分类的方法
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

    //todo 为筛选表单绑定 submit 事件
    $('#form-select').submit(function (e) {
        e.preventDefault();
        //* 获取表单中选中项的值
        let cate_id = $('[name=cate_id]').val();
        let state = $('[name=state]').val();
        //* 为查询参数对象 q 重新赋值
        q.cate_id = cate_id;
        q.sate = state;
        //* 根据最新的筛选条件，重新渲染表格的数据
        initTable();
    });

    //todo 渲染分页的方法
    function renderPage(total) {
        //* 调用 layer.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', // 此处 id 不加 #
            count: total, // 总数
            limit: q.pagesize, // 每页显示数据多少
            curr: q.pagenum, // 默认选中的页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], // 里面的顺序不能变
            limits: [2, 3, 5, 8], // 每页显示数据可选
            //* 分页切换时触发
            //? 触发 jump 的两种方式 1.点击页码 2.使用 laypage.render()
            jump: function (obj, first) {
                // console.log(first)
                //* 把最新的页码值和条目数赋值给 q
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                // 直接调用会死循环
                // initTable()

                //* 如果是 laypage.render() 导致的触发 jump 则返回 true 不然就是点击页码触发的 jump ，下列判断可防止死循环
                if (!first) {
                    initTable();
                }
            }
        });
    }

    //todo 通过代理的形式，为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        let id = $(this).attr('data-id');
        // 获取页面中删除按钮的个数
        let len = $('.btn-delete').length
        layer.confirm('确定将此项永久删除吗?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    //* 删除过后判断本页是否还有文章，若没有，页码值需 -1，再调用 initTable()
                    if (len === 1) {
                        // 如果len值为一证明页面中没有删除按钮，页面上没有文章
                        // 页码值最小为1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })

            layer.close(index);
        });
    });
});