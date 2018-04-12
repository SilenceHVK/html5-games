(function (document, window) {
    'use strict';

    /**
     * 创建数组矩阵
     * @param {Number} n 
     * @param {Number} m 
     * @param {Number} initial 
     */
    Array.prototype.matrix = function (n, m, initial) {
        const mat = [];
        for (let i = 0; i < n; i++) {
            mat[i] = [];
            for (let j = 0; j < m; j++) {
                mat[i][j] = initial;
            }
        }
        return mat;
    };

    // 声明 俄罗斯方块对象
    const tetris = {
        blokImage: new Image(), // 方块图片对象
        blockSize: 30, // 方块大小
        mainRows: 23,  // 主界面纵向大小  
        mainCols: 15,  // 主界面横向大小
        mainImageData: null, // 存储主界面数据  
        borderList: [],  // 用于存储界面网格的矩阵
        curShap: { shap: [], shapsIndex: 0, shapIndex: 0, x: 0, y: 0, blockType: 0 }, // 用于存储当前图形数据
        nextShap: { shap: [], shapsIndex: 0, shapIndex: 0, x: 0, y: 0, blockType: 0 }, // 用于存储下一个图形数据
        // 所有图形矩阵样式
        shaps: [
            [
                [[1, 1], [1, 1]]
            ],
            [
                [[1, 1, 1, 1]],
                [[1], [1], [1], [1]]
            ],
            [
                [[0, 1, 0], [1, 1, 1]],
                [[1, 0], [1, 1], [1, 0]],
                [[1, 1, 1], [0, 1, 0]],
                [[0, 1], [1, 1], [0, 1]]
            ],
            [
                [[1, 1, 0], [0, 1, 1]],
                [[0, 1], [1, 1], [1, 0]]
            ],
            [
                [[0, 1, 1,], [1, 1, 0]],
                [[1, 0], [1, 1], [0, 1]]
            ]
        ]
    };
    /**
     * 初始化 tetris
     * @param {String} mainId 
     * @param {String} nextId
     */
    tetris.init = function (mainId, nextId) {
        // 初始化主界面网格矩阵
        tetris.borderList = tetris.borderList.matrix(tetris.mainRows, tetris.mainCols, 0);
        this.preloadImage('assets/images/blocks.png').then(image => {
            this.blokImage = image;
            const game = new GameObj(mainId, nextId);
            // 绑定键盘事件
            document.addEventListener('keydown', event => {
                const keyDirection = this.getKeyDirection(event)
                game.moveShap(keyDirection, game.mainCanvas);
            }, false);
        });
    };

    /**
     * 加载图片方法
     * @param {String} path 
     */
    tetris.preloadImage = function (path) {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = function () {
                resolve(image);
            };
            image.onerror = reject;
            image.src = path;
        });
    };

    /**
     * 获取键盘指令
     * @param {Object} event 
     */
    tetris.getKeyDirection = function (event) {
        const keyCode = event.which || event.keyCode;
        switch (keyCode) {
            case 1:
            case 38:
            case 269:
                return 'up';
                break;
            case 2:
            case 40:
            case 270:
                return 'down';
                break;
            case 3:
            case 37:
            case 271:
                return 'left';
                break;
            case 4:
            case 39:
            case 272:
                return 'right';
                break;
        }
    };

    // GameObj 类
    class GameObj {
        /**
         * 构造函数
         * @param {String} mainId 
         * @param {String} nextId 
         */
        constructor(mainId, nextId) {
            // 实例主游戏界面 canvas
            this.mainCanvas = this.newCanvas(mainId, tetris.blockSize * tetris.mainCols, tetris.blockSize * tetris.mainRows);
            // this.nextCanvas = this.newCanvas(nextId, 120, 120);
            // 绘制界面网格
            this.drawGrid(this.mainCanvas);
            tetris.curShap = this.randomShap();
            tetris.nextShap = this.randomShap();
            this.drawShap(this.mainCanvas, tetris.curShap);
        }

        /**
         * 实例 Canvas 对象
         * @param {String} canvasId 
         * @param {Number} width 
         * @param {Number} height 
         */
        newCanvas(canvasId, width, height) {
            const canvas = document.querySelector(canvasId);
            if (canvas) {
                canvas.width = width || window.innerWidth;
                canvas.height = height || window.innerHeight;
                canvas.context = canvas.getContext('2d');
            }
            return canvas;
        }

        /**
         * 绘制网格
         * @param {Object} canvas 
         */
        drawGrid(canvas) {
            canvas.context.beginPath();
            // 绘制线段颜色
            canvas.context.strokeStyle = 'rgba(0,0,0,0.6)';
            // 绘制线段宽度
            canvas.context.lineWidth = 0.5;
            // 绘制界面纵向坐标点
            for (let i = 0; i < tetris.mainCols; i++) {
                canvas.context.moveTo(i * tetris.blockSize, 0);
                canvas.context.lineTo(i * tetris.blockSize, canvas.height);
            }
            // 绘制界面横向坐标点
            for (let i = 0; i < tetris.mainRows; i++) {
                canvas.context.moveTo(0, i * tetris.blockSize);
                canvas.context.lineTo(canvas.width, i * tetris.blockSize);
            }
            // 绘制网格
            canvas.context.stroke();
            // 存储主界面数据
            tetris.mainImageData = canvas.context.getImageData(0, 0, canvas.width, canvas.height);
        }

        /**
         * 绘制图形
         * @param {Object} canvas 
         * @param {Object} shapObj 
         */
        drawShap(canvas, shapObj) {
            for (let i = 0; i < shapObj.shap.length; i++) {
                for (let j = 0; j < shapObj.shap[i].length; j++) {
                    if (shapObj.shap[i][j]) {
                        this.drawBlock(canvas, shapObj.x + j, shapObj.y + i, shapObj.blockType);
                    }
                }
            }
        }

        /**
         * 绘制方块
         * @param {Canvas} canvas 
         * @param {Number} x 
         * @param {Number} y 
         * @param {Number} blockType
         */
        drawBlock(canvas, x = 0, y = 0, blockType = 0) {
            // 方块图片大小
            const originalSize = 32;
            // 绘制方块
            canvas.context.drawImage(tetris.blokImage, blockType * originalSize, 0, originalSize, originalSize,
                x * tetris.blockSize, y * tetris.blockSize, tetris.blockSize, tetris.blockSize);
        }

        /**
         * 移动图形
         * @param {String} keyDirection 
         * @param {Canvas} canvas 
         */
        moveShap(keyDirection, canvas) {
            // 图形最大移动 X 坐标
            let maxX = tetris.mainCols - tetris.curShap.shap[0].length;
            // 图形最大移动 Y 坐标
            let maxY = tetris.mainRows - tetris.curShap.shap.length;

            // 图形转换
            if (keyDirection === 'up') {
                const curShap = tetris.curShap;
                const shapLength = tetris.shaps[curShap.shapsIndex].length - 1;
                tetris.curShap.shapIndex = curShap.shapIndex + 1 > shapLength ? 0 : curShap.shapIndex + 1;
                // 获取新的图形
                tetris.curShap.shap = tetris.shaps[curShap.shapsIndex][tetris.curShap.shapIndex];

                // 更改图形转换后最大 X 、Y 坐标
                maxX = tetris.mainCols - tetris.curShap.shap[0].length;
                maxY = tetris.mainRows - tetris.curShap.shap.length;

                // 图形转换时更改 X 坐标
                if (tetris.curShap.x > maxX) {
                    tetris.curShap.x -= (tetris.curShap.x - maxX);
                }

                // 图形转换时更改 Y 坐标
                if (tetris.curShap.y >= maxY) {
                    tetris.curShap.y -= (tetris.curShap.y - maxY);
                }
            }

            // 图形左移动
            if (keyDirection === 'left' && tetris.curShap.x > 0) {
                tetris.curShap.x -= 1;
            }

            // 图形右移动
            if (keyDirection === 'right' && tetris.curShap.x < maxX) {
                tetris.curShap.x += 1;
            }

            // 图形下移动
            if (keyDirection === 'down' && tetris.curShap.y < maxY) {
                tetris.curShap.y += 1;
            }
            this.refresh(canvas, tetris.mainImageData);
            this.drawShap(canvas, tetris.curShap);

            if (tetris.curShap.y === maxY) {
                this.addShapeToBordList();
                tetris.curShap = tetris.nextShap;
                tetris.nextShap = this.randomShap();
                this.drawShap(this.mainCanvas, tetris.curShap);
            }
        }

        // 生成随机图形
        randomShap() {
            // 生成随机图形
            const shapsIndex = Math.floor(Math.random() * tetris.shaps.length);
            const shapIndex = Math.floor(Math.random() * tetris.shaps[shapsIndex].length);
            const shap = tetris.shaps[shapsIndex][shapIndex];
            // 生成随机 x 坐标
            const x = Math.floor(Math.random() * (tetris.mainCols - shap[0].length));
            // 生成随机方块样式
            const blockType = Math.floor(Math.random() * 7);
            return { shap: shap, shapsIndex: shapsIndex, shapIndex: shapIndex, x: x, y: 0, blockType: blockType };
        }

        /**
         * 刷新界面
         * @param {Canvas} canvas 
         * @param {Object} canvas 
         */
        refresh(canvas, imageData) {
            canvas.context.clearRect(0, 0, canvas.width, canvas.height);
            canvas.context.putImageData(imageData, 0, 0);
            this.drawShapToBorderList(canvas, tetris.curShap.blockType);
        }

        // 将已落地的方块坐标存储到 网格矩阵中
        addShapeToBordList() {
            for (let y = 0; y < tetris.curShap.shap.length; y++) {
                for (let x = 0; x < tetris.curShap.shap[y].length; x++) {
                    if (tetris.curShap.shap[y][x]) {
                        const borderX = tetris.curShap.x + x;
                        const borderY = tetris.curShap.y + y;
                        tetris.borderList[borderY][borderX] = 1;
                    }
                }
            }
        }

        /**
         * 绘制已落地的方块
         * @param {Canvas} canvas 
         * @param {Number} blockType 
         */
        drawShapToBorderList(canvas, blockType = 0) {
            for (let y = 0; y < tetris.borderList.length; y++) {
                for (let x = 0; x < tetris.borderList[y].length; x++) {
                    if (tetris.borderList[y][x]) {
                        this.drawBlock(canvas, x, y, blockType);
                    }
                }
            }
        }
    };

    // 将 tetris 对象暴露给全局对象
    window.tetris = tetris;
})(document, window);

window.onload = function () {
    tetris.init('#c-game-main', '#c-next-block');
};