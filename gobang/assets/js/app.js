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
                let x = padding + i * interval;
                let y = padding + i * interval;
                vars.context.beginPath();
                vars.context.strokeStyle = '#bfbfbf';
                // 绘制 X 轴网格
                vars.context.moveTo(x, padding);
                vars.context.lineTo(x, vars.chessSize - padding);
                vars.context.stroke();
                // 绘制 Y 轴网格
                vars.context.moveTo(padding, y);
                vars.context.lineTo(vars.chessSize - padding, y);
                vars.context.stroke();
                vars.context.closePath();
            }
        }
    };

    let drawChess = function (vars, x, y, active, interval = 30, padding = 15) {
        if (vars) {
            x = padding + x * interval;
            y = padding + y * interval;
            vars.context.beginPath();
            let gradient = vars.context.createRadialGradient(x, y, 5, x, y, 2);
            if (active) {
                gradient.addColorStop(0, '#0A0A0A');
                gradient.addColorStop(1, '#626366');
            } else {
                gradient.addColorStop(0, '#F9F9F9');
                gradient.addColorStop(1, '#626366');
            }
            vars.context.fillStyle = gradient;
            vars.context.arc(x, y, 13, 0, 2 * Math.PI);
            vars.context.closePath();
            vars.context.fill();
            vars.context.stroke();
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
        // 判断下棋方
        vars.active = false;
        let width = window.innerWidth - 15;
        let height = window.innerHeight - 15;
        vars.chessSize = width > height ? height : width;
        vars.canvas.width = vars.canvas.height = vars.chessSize;
        // 绘制棋盘
        drawChessBorad(vars);
        //绑定棋盘事件
        this.bindingEvent(vars);
    };

    /**
     * 绑定棋盘事件
     * @param {Object} vars 
     */
    chess.bindingEvent = function (vars) {
        if (vars) {
            let interval = 30;
            vars.canvas.addEventListener('click', (e) => {
                let x = Math.floor(e.offsetX / interval);
                let y = Math.floor(e.offsetY / interval);
                drawChess(vars, x, y, vars.active, interval);
                vars.active = !vars.active;
            }, false);
        }
    };

    window.chess = chess;
})();

window.onload = function () {
    window.chess.init();
}