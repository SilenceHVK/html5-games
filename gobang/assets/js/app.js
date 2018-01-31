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

            // 初始化所有落子点坐标
            for (let i = 0; i < spliteNum; i++) {
                vars.chessBorad[i] = [];
                vars.wins[i] = [];
                for (let j = 0; j < spliteNum; j++) {
                    vars.chessBorad[i][j] = 0;
                    vars.wins[i][j] = [];
                }
            }

            // 推断所有横向赢法坐标
            for (let i = 0; i < spliteNum; i++) {
                for (let j = 0; j < spliteNum - 4; j++) {
                    for (let k = 0; k < 5; k++) {
                        vars.wins[i][j + k][vars.winCount] = true;
                    }
                    vars.winCount++;
                }
            }

            // 推断所有纵向赢法坐标
            for (let i = 0; i < spliteNum; i++) {
                for (let j = 0; j < spliteNum - 4; j++) {
                    for (let k = 0; k < 5; k++) {
                        vars.wins[j + k][i][vars.winCount] = true;
                    }
                    vars.winCount++;
                }
            }

            // 推断所有斜向赢法坐标
            for (let i = 0; i < spliteNum - 4; i++) {
                for (let j = 0; j < spliteNum - 4; j++) {
                    for (let k = 0; k < 5; k++) {
                        vars.wins[i + k][j + k][vars.winCount] = true;
                    }
                    vars.winCount++;
                }
            }

            // 推断所有反斜向赢法坐标
            for (let i = 0; i < spliteNum - 4; i++) {
                for (let j = spliteNum - 1; j > 3; j--) {
                    for (let k = 0; k < 5; k++) {
                        vars.wins[j - k][i + k][vars.winCount] = true;
                    }
                    vars.winCount++;
                }
            }

            // 记录所有赢法
            for (let i = 0; i < vars.winCount; i++) {
                vars.computerWins[i] = 0;
                vars.userWins[i] = 0;
            }
        }
    };

    let drawChess = function (vars, x, y, active, interval = 30, padding = 15) {
        if (vars) {
            x = padding + x * interval;
            y = padding + y * interval;
            vars.context.beginPath();
            let gradient = vars.context.createRadialGradient(x + 2, y - 2, 13, x + 2, y - 2, 0);
            if (active) {
                gradient.addColorStop(0, '#0a0a0a');
                gradient.addColorStop(1, '#636766');
            } else {
                gradient.addColorStop(0, '#d1d1d1');
                gradient.addColorStop(1, '#f9f9f9');
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
        // 用于记录落子坐标
        vars.chessBorad = [];
        // 用于记录所有赢法坐标
        vars.wins = [];
        // 统计赢法总数
        vars.winCount = 0;
        vars.computerWins = [];
        vars.userWins = [];
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
                // 判断该坐标是否已落子
                if (vars.chessBorad[x][y] === 0) {
                    drawChess(vars, x, y, vars.active, interval);
                    vars.chessBorad[x][y] = vars.active ? 1 : 2;
                    vars.active = !vars.active;
                }
            }, false);
        }
    };

    window.chess = chess;
})();

window.onload = function () {
    window.chess.init();
}