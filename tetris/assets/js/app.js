'use strict';
(function (document, window) {

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


    // DomObject 类
    const DomObject = function (dom) {
        this.dom = dom;
    }
    // 返回 DomObject 的 dom 对象
    DomObject.prototype.get = function () {
        return this.dom;
    }
    // 事件注册
    DomObject.prototype.on = function (eventName, eventHandler) { // 事件注册
        this.get().addEventListener(eventName, eventHandler, false);
    };
    // css 样式动态更改
    DomObject.prototype.css = function (styleKey, styleValue) {
        this.get().style[styleKey] = styleValue;
    };
    // $ 选择器
    const $ = function (selector, context) {
        return new DomObject((context || document).querySelector(selector));
    };

    // 俄罗斯方框类
    const tetris = {
        borderSize: 30, // 设置块的大小
        rows: 20,   // 设置纵向大小  
        cols: 13,   // 设置横向大小
        borderList: [], // 用于存储游戏界面中的坐标
        gridImageData: null, // 用于存储canvas 界面缓存
    };

    // 设置 Canvas
    tetris.canvas = function (canvasID, width, height) {
        const newCanvas = {};
        newCanvas.canvas = document.querySelector(canvasID);
        if (newCanvas.canvas) {
            // 设置 canvas 的宽度
            newCanvas.width = newCanvas.canvas.width = width || window.innerWidth;
            // 设置 canvas 的高度
            newCanvas.height = newCanvas.canvas.height = height || window.innerHeight;
            // 设置 canvas 的上下文
            newCanvas.context = newCanvas.canvas.getContext('2d');
        }
        return newCanvas;
    };

    // 绘制游戏界面网格
    tetris.drawGameGrid = function (canvasID) {
        const gameMain = this.canvas(canvasID, this.cols * this.borderSize, this.rows * this.borderSize);
        if (gameMain.context) {
            gameMain.context.beginPath();
            gameMain.context.strokeStyle = 'rgba(0,0,0,0.6)';
            gameMain.context.lineWidth = 0.5;
            // 绘制纵向线段
            for (let i = 0; i < this.cols; i++) {
                gameMain.context.moveTo(i * this.borderSize, 0);
                gameMain.context.lineTo(i * this.borderSize, gameMain.height);
            }
            // 绘制横向线段
            for (let i = 0; i < this.rows; i++) {
                gameMain.context.moveTo(0, i * this.borderSize);
                gameMain.context.lineTo(gameMain.width, i * this.borderSize);
            }
            gameMain.context.stroke();
            // 填充界面坐标
            this.borderList = this.borderList.matrix(this.rows, this.cols, 0);
            // 缓存 canvas 数据
            this.gridImageData = gameMain.context.getImageData(0, 0, gameMain.width, gameMain.height);
        }
    };

    // 开始游戏
    tetris.startGame = function (canvasID) {
        this.drawGameGrid(canvasID);
    };

    // 将俄罗斯类暴露给全局对象 window
    window.tetris = tetris;
    // 将选择器暴露给全局对象 window
    window.$ = $;
})(document, window);


window.onload = function () {
    $('#btn-start').on('click', function () {
        $('.start-container').css('display', 'none');
        $('.game-container').css('display', 'block');
        tetris.startGame('#c-game-main');
    });
}