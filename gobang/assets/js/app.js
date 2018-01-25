(function () {
    'use strict';
    let chess = {};

    /**
     * 绘制棋盘
     * @param {Object} vars 
     */
    let drawChessBorad = function (vars, padding = 15, interval = 30) {
        if (vars) {
            // 根据棋盘大小绘制棋盘网格
            let spliteNum = Math.round((vars.chessSize - (padding * 2)) / interval) + 1;
            for (let i = 0; i < spliteNum; i++) {
                vars.context.beginPath();
                vars.context.strokeStyle = '#bfbfbf';
                // 绘制 X 轴网格
                vars.context.moveTo(padding + i * interval, padding);
                vars.context.lineTo(padding + i * interval, vars.chessSize - padding);
                vars.context.stroke();
                // 绘制 Y 轴网格
                vars.context.moveTo(padding, padding + i * interval);
                vars.context.lineTo(vars.chessSize - padding, padding + i * interval);
                vars.context.stroke();
                vars.context.closePath();
            }
        }
    };

    let drawChess = function (vars) {
        if (vars) {
            vars.context.beginPath();
            let gradient = vars.context.createRadialGradient(100, 100, 20, 100, 100, 10);
            gradient.addColorStop(0, '#0A0A0A');
            gradient.addColorStop(1, '#626366');
            vars.context.fillStyle = gradient;
            vars.context.arc(100, 100, 50, 0, 2 * Math.PI);
            vars.context.closePath();
            vars.context.fill();
        }
    }

    /**
     * 初始化游戏界面
     */
    chess.init = function () {
        let vars = {};
        // 创建 Canvas 元素 并添加至 body 中
        vars.canvas = document.createElement('canvas');
        document.body.appendChild(vars.canvas);
        // 获取 Canvas 上下文对象
        vars.context = vars.canvas.getContext('2d');
        let width = window.innerWidth - 15;
        let height = window.innerHeight - 15;
        vars.chessSize = width > height ? height : width;
        vars.canvas.width = vars.canvas.height = vars.chessSize;
        // 绘制棋盘
        drawChessBorad(vars);
        // 绘制棋子
        drawChess(vars);
        //绑定棋盘事件
        this.bindingEvent(vars);
    };

    /**
     * 绑定棋盘事件
     * @param {Object} vars 
     */
    chess.bindingEvent = function (vars) {
        if (vars) {
            vars.canvas.addEventListener('click', (e) => {
                alert('点击了棋盘');
            }, false);
        }
    };

    window.chess = chess;
})();

window.onload = function () {
    window.chess.init();
}