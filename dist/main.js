//import less = require('less');
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Crucial = /** @class */ (function () {
    function Crucial(id) {
        this.app = null;
        this.app = $(id);
        window.app = this;
    }
    return Crucial;
}());
var Component = /** @class */ (function () {
    function Component(id) {
        this.container = null;
        this.element = null;
        this.uid = '';
        console.log(id);
        this.container = $(id);
        this.uid = this.RandomID();
        this.container.classList.add(this.uid);
        this.Update();
    }
    Component.prototype.Render = function () {
        var _this = this;
        this.container.innerHTML = this.Template();
        if (!!this.Style()) {
            var scoped = "." + this.uid + " {" + this.Style() + "}";
            less.render(scoped, function (err, out) {
                _this.container.innerHTML += "<style>" + out.css + "</style>";
            });
        }
    };
    Component.prototype.RandomID = function () {
        return 'c' + Math.random().toString(36).substr(2);
    };
    Component.prototype.Update = function () {
        this.Render();
        this.Bind();
    };
    Component.prototype.Bind = function () {
    };
    Component.prototype.Style = function () {
        return '';
    };
    return Component;
}());
var Button = /** @class */ (function (_super) {
    __extends(Button, _super);
    function Button(id) {
        var _this = _super.call(this, id) || this;
        _this.count = 0;
        _this.count2 = 0;
        return _this;
    }
    Button.prototype.Template = function () {
        return /*html*/ "\n            <div>\n                <button class=\"one\">Wow so like this? " + (this.count | 0) + "</button>\n                <button class=\"two\">Wow so like this? " + (this.count2 | 0) + "</button>\n            </div>\n        ";
    };
    Button.prototype.Style = function () {
        return /*css*/ "\n            .one {\n                background-color: red;\n            }\n\n            .two {\n                background-color: green;\n            }\n        ".trim();
    };
    Button.prototype.Bind = function () {
        var _this = this;
        this.container.querySelector('.one').addEventListener('click', function () {
            console.log('clicked');
            _this.count++;
            _this.Update();
        });
        this.container.querySelector('.two').addEventListener('click', function () {
            console.log('clicked');
            _this.count2++;
            _this.Update();
        });
    };
    return Button;
}(Component));
var $ = document.querySelector.bind(document);
(function () {
    var app = new Crucial('#app');
    //new Component('cru-button')
    new Button('cru-button');
})();
