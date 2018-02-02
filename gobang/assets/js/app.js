(function () {
    'use strict';
    const goBang = {};
    /**
     * 初始化游戏界面
     */
    goBang.init = function () {
        const chess = {};
        // 创建 Canvas 元素 并添加至 body 中
        chess.canvas = document.createElement('canvas');
        document.body.appendChild(chess.canvas);;
        // 获取 Canvas 上下文对象
        chess.context = chess.canvas.getContext('2d');
        // 设置棋盘大小
        goBang.setChessBorderSize(chess);
    };

    /**
     * 设置棋盘大小
     * @param {Object} chess 
     */
    goBang.setChessBorderSize = function (chess) {
        // 获取浏览器窗体宽高
        let width = document.body.offsetHeight;
        let height = document.body.offsetWidth;
        // 取宽高整除 10
        width = width - (width % 10);
        height = height - (height % 10);
        // 宽高比较取最小值
        chess.canvas.width = chess.canvas.height = width >= height ? height : width;
    };
    window.goBang = goBang;
})();

window.onload = function () {
    window.goBang.init();
};