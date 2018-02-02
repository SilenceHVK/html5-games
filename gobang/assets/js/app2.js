(function () {
    'use strict';
    let chess = {};

    /**
     * 绘制棋盘
     * @param {Object} vars 
     * @param {Number} padding 
     * @param {Number} interval 
     */
    let drawChessBorad = function (vars, padding = 15, interval = 30) {
        if (vars) {
            // 根据棋盘大小绘制棋盘网格
            let spliteNum = Math.round((vars.chessSize - (padding * 2)) / interval) + 1;
            vars.spliteNum = spliteNum;
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
            // 推断所有赢法坐标
            inferWins(vars);
        }
    };

    /**
     * 绘制棋子
     * @param {Object} vars 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Boolean} active 
     * @param {Number} interval 
     * @param {Number} padding 
     */
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
    };

    /**
     * 推断所有赢法坐标
     * @param {Object} vars 
     */
    let inferWins = function (vars) {
        // 推断所有横向赢法坐标
        for (let i = 0; i < vars.spliteNum; i++) {
            for (let j = 0; j < vars.spliteNum - 4; j++) {
                for (let k = 0; k < 5; k++) {
                    vars.wins[i][j + k][vars.winCount] = true;
                }
                vars.winCount++;
            }
        }

        // 推断所有纵向赢法坐标
        for (let i = 0; i < vars.spliteNum; i++) {
            for (let j = 0; j < vars.spliteNum - 4; j++) {
                for (let k = 0; k < 5; k++) {
                    vars.wins[j + k][i][vars.winCount] = true;
                }
                vars.winCount++;
            }
        }

        // 推断所有斜向赢法坐标
        for (let i = 0; i < vars.spliteNum - 4; i++) {
            for (let j = 0; j < vars.spliteNum - 4; j++) {
                for (let k = 0; k < 5; k++) {
                    vars.wins[i + k][j + k][vars.winCount] = true;
                }
                vars.winCount++;
            }
        }

        // 推断所有反斜向赢法坐标
        for (let i = 0; i < vars.spliteNum - 4; i++) {
            for (let j = vars.spliteNum - 1; j > 3; j--) {
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
    };

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
        vars.active = true;
        // 用于记录落子坐标
        vars.chessBorad = [];
        // 用于记录所有赢法坐标
        vars.wins = [];
        // 统计赢法总数
        vars.winCount = 0;
        vars.computerWins = [];
        vars.userWins = [];
        // 记录游戏是否结束
        vars.gameOver = false;
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
                // 判断游戏是否结束
                if (vars.gameOver) return;
                // 判断是否为用户下棋
                if (!vars.active) return;
                let x = Math.floor(e.offsetX / interval);
                let y = Math.floor(e.offsetY / interval);
                // 判断该坐标是否已落子
                if (vars.chessBorad[x][y] === 0) {
                    chess.stepOne(vars, x, y, interval);
                    chess.judementWin(vars, x, y);
                    vars.active = !vars.active;
                    chess.computerStepOne(vars, interval);
                }
            }, false);
        }
    };

    /**
     * 落子函数
     * @param {Object} vars 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} interval 
     */
    chess.stepOne = function (vars, x, y, interval = 30) {
        drawChess(vars, x, y, vars.active, interval);
        vars.chessBorad[x][y] = vars.active ? 1 : 2;
    };

    chess.computerStepOne = function (vars, interval = 30) {
        let userScore = [];
        let computerScore = [];
        let maxScore = 0;
        // 初始化计算机落子坐标
        let point = {
            x: 0,
            y: 0
        };
        // 循环落子点数组筛选未落子坐标
        for (let i = 0; i < vars.chessBorad.length; i++) {
            userScore[i] = [];
            computerScore[i] = [];
            for (let j = 0; j < vars.chessBorad.length; j++) {
                userScore[i][j] = 0;
                computerScore[i][j] = 0;
                // 筛选未落子坐标
                if (vars.chessBorad[i][j] === 0) {
                    // 循环所有赢法
                    for (let k = 0; k < vars.winCount; k++) {
                        // 判断当前赢法存在
                        if (vars.wins[i][j][k]) {
                            // 判断用户落子赢法分数
                            if (vars.userWins[k] === 1) {
                                userScore[i][j] += 100;
                            } else if (vars.userWins[k] === 2) {
                                userScore[i][j] += 1000;
                            } else if (vars.userWins[k] === 3) {
                                userScore[i][j] += 2000;
                            } else if (vars.userWins[k] === 4) {
                                userScore[i][j] += 22000;
                            }

                            // 判断计算机落子赢法分数
                            if (vars.computerWins[k] === 1) {
                                computerScore[i][j] += 200;
                            } else if (vars.computerWins[k] === 2) {
                                computerScore[i][j] += 2000;
                            } else if (vars.computerWins[k] === 3) {
                                computerScore[i][j] += 2200;
                            } else if (vars.computerWins[k] === 4) {
                                computerScore[i][j] += 25000;
                            }
                        }
                    }
                    // 根据每个坐标得分 推算有利坐标
                    if (userScore[i][j] > maxScore) {
                        maxScore = userScore[i][j];
                        point = {
                            x: i,
                            y: j
                        };
                    } else if (userScore[i][j] === maxScore) {
                        if (computerScore[i][j] > computerScore[i][j]) {
                            point = {
                                x: i,
                                y: j
                            };
                        }
                    }
                    if (computerScore[i][j] > maxScore) {
                        maxScore = computerScore[i][j];
                        point = {
                            x: i,
                            y: j
                        };
                    } else if (computerScore[i][j] === maxScore) {
                        if (userScore[i][j] > userScore[i][j]) {
                            point = {
                                x: i,
                                y: j
                            };
                        }
                    }
                }
            }
        }
        chess.stepOne(vars, point.x, point.y, interval);
        chess.judementWin(vars, point.x, point.y);
        vars.active = !vars.active;
    };

    /**
     * 判断赢法
     * @param {Object} vars 
     */
    chess.judementWin = function (vars, x, y) {
        for (let index = 0; index < vars.winCount; index++) {
            // 判断落子点是否
            if (vars.wins[x][y][index]) {
                // 统计用户落子后赢法数据
                if (vars.active) {
                    vars.userWins[index]++;
                    vars.computerWins[index] = 6;
                    if (vars.userWins[index] === 5) {
                        alert('黑子获胜');
                        vars.gameOver = true;
                    }
                }
                // 统计计算机落子后赢法数据
                else {
                    vars.computerWins[index]++;
                    vars.userWins[index] = 6;
                    if (vars.computerWins[index] === 5) {
                        alert('白子获胜');
                        vars.gameOver = true;
                    }
                }
            }
        }
    };

    /**
     * 消息框
     * @param {String} msg 
     */
    chess.tooltip = function (msg) {

    };
    window.chess = chess;
})();

window.onload = function () {
    window.chess.init();
}