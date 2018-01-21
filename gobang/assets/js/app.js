var Chess = (function () {
    'use strict';

    /**
     * 棋盘对象
     * @param {String} id 
     */
    var chess = function (id) {
        this.canvas = document.querySelector(id);
        this.width = this.canvas.offsetWidth;
        this.height = this.canvas.offsetHeight;
        if (this.canvas) {
            this.context = this.canvas.getContext('2d');
        }
        return this;
    };

    /**
     * 绘制棋盘方法
     * @param {String} color 
     * @param {Number} lineWidth 
     * @param {Number} blank 
     */
    chess.prototype.drawChess = function (color = '#bfbfbf', lineWidth = 5, blank = 30) {
        if (this.context) {
           
            this.context.beginPath();
            this.context.moveTo(0, 0);
            this.context.lineTo(0, this.height);
            this.context.stroke();
            this.context.beginPath();
            this.context.moveTo(15, 0);
            this.context.lineTo(15, this.height);
            this.context.stroke();
        }
    };
    return chess;
})();

window.onload = function () {
    new Chess('#chess').drawChess();
}