(function () {
    'use strict';
    const goBang = {};
    /**
     * 添加矩阵属性
     * @param {Number} m
     * @param {Number} n
     * @param {*} initial 
     */
    Array.prototype.matrix = function (m, n, initial) {
        let mat = [];
        for (let i = 0; i < m; i++) {
            mat[i] = [];
            for (let j = 0; j < n; j++) {
                mat[i][j] = initial;
            }
        }
        return mat;
    };

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
        // 声明玩家方
        chess.player = true;
        // 声明游戏是否结束
        chess.gameOver = false;
        // 设置棋盘大小
        goBang.setChessBorderSize(chess);
        // 绘制棋盘
        goBang.drawChessBorder(chess);
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
        width = width - (width % 10) - 20;
        height = height - (height % 10) - 20;
        chess.chessBorderSize = width >= height ? height : width;
        // 宽高比较取最小值
        chess.canvas.width = chess.canvas.height = chess.chessBorderSize;
    };

    /**
     * 绘制棋盘
     * @param {Object} chess 
     * @param {Number} interval 
     * @param {Number} padding 
     */
    goBang.drawChessBorder = function (chess, interval = 30, padding = 10) {
        if (chess) {
            const spliteNum = Math.round(chess.chessBorderSize / interval);
            chess.context.strokeStyle = '#bfbfbf';
            for (let i = 0; i < spliteNum; i++) {
                chess.context.beginPath();
                chess.context.moveTo(i * interval + padding, padding);
                chess.context.lineTo(i * interval + padding, chess.canvas.height - padding);
                chess.context.stroke();
                chess.context.closePath();

                chess.context.beginPath();
                chess.context.moveTo(padding, i * interval + 10);
                chess.context.lineTo(chess.canvas.width - 10, i * interval + 10);
                chess.context.stroke();
                chess.context.closePath();
            }


        }
    };

    window.goBang = goBang;
})();

window.onload = function () {
    window.goBang.init();
};