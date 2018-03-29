'use strict';
(function (document) { // document通过参数获得，避免作用域链一层层搜索

    function DomObject(dom) {
        this.dom = dom;
    };

    DomObject.prototype.get = function () {
        return this.dom();
    };


})(document);