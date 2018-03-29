'use strict';
(function (document) { // document通过参数获得，避免作用域链一层层搜索

    function DomObject(dom) {
        this.dom = dom;
    };

    DomObject.prototype.get = function () {
        return this.dom;
    };

    DomObject.prototype.on = function (eventName, eventHandler) { // 事件注册
        this.get().addEventListener(eventName, eventHandler, false);
    };

    DomObject.prototype.css = function (styleKey, styleValue) {
        this.get().style[styleKey] = styleValue;
    };

    function $(selector, context) {    //context在哪里去找，如果没有就用document
        return new DomObject((context || document).querySelector(selector));
    }

    function _init() {
        $('#btn-start').on('click', function () {
            alert('开始游戏');
        });
    };

    document.addEventListener('DOMContentLoaded', function (ev) {
        _init();
    })
})(document);