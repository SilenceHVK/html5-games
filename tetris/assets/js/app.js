'use strict';

// 工具类
(function (document, window) {
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

    /**
    * 定义实例一个 canvas 对象 的静态方法
    * @param {String} canvasID 
    * @param {Number} width
    * @param {Number} height
    */
    $.canvas = function (canvasID, width, height) {
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

    /**
     * 加载图片静态方法
     * @param {String} path
     */
    $.preloadImage = function (path) {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = function () {
                resolve(image);
            };
            image.onerror = reject;
            image.src = path;
        });
    };
    window.$ = $;

})(document, window);


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

    // 绘制游戏界面网格
    const _drawGameGrid = function (canvas) {
        canvas.context.beginPath();
        canvas.context.strokeStyle = 'rgba(0,0,0,0.6)';
        canvas.context.lineWidth = 0.5;
        // 绘制纵向线段
        for (let i = 0; i < tetris.cols; i++) {
            canvas.context.moveTo(i * tetris.borderSize, 0);
            canvas.context.lineTo(i * tetris.borderSize, canvas.height);
        }
        // 绘制横向线段
        for (let i = 0; i < tetris.rows; i++) {
            canvas.context.moveTo(0, i * tetris.borderSize);
            canvas.context.lineTo(canvas.width, i * tetris.borderSize);
        }
        canvas.context.stroke();
        // 填充界面坐标
        tetris.borderList = tetris.borderList.matrix(tetris.rows, tetris.cols, 0);
        // 缓存 canvas 数据
        tetris.gridImageData = canvas.context.getImageData(0, 0, canvas.width, canvas.height);
    };

    /**
     * 绘制方块
     * @param {*} canvas 
     * @param {*} x 
     * @param {*} y 
     */
    const _drawBlcoks = function (canvas, x, y) {
        const block = {
            size: 30,
            originalSize: 32,
        }
        const sprite = tetris.imageResource.get('blocks');  // 获取方块图片资源ååå
        canvas.context.beginPath();
        canvas.context.drawImage(sprite,block.originalSize, 0, block.originalSize, block.originalSize, 0, 0, block.size, block.size);
    };

    // 俄罗斯方框类
    const tetris = {
        borderSize: 30, // 设置块的大小
        rows: 20,   // 设置纵向大小  
        cols: 13,   // 设置横向大小
        borderList: [], // 用于存储游戏界面中的坐标
        gridImageData: null, // 用于存储canvas 界面缓存
        imageResource: new Map() // 图片资源
    };

    /**
     * 开始游戏
     * @param {*} canvasID 
     */
    tetris.startGame = async function (canvasID) {
        this.imageResource.set('blocks', await $.preloadImage('assets/images/blocks.png'));
        const canvas = $.canvas(canvasID, this.cols * this.borderSize, this.rows * this.borderSize);
        if (canvas.context) {
            _drawGameGrid(canvas);
            _drawBlcoks(canvas);
        }
    };

    // 将俄罗斯类暴露给全局对象 window
    window.tetris = tetris;
})(document, window);


window.onload = function () {
    $('#btn-start').on('click', function () {
        $('.start-container').css('display', 'none');
        $('.game-container').css('display', 'block');
        tetris.startGame('#c-game-main');
    });
}