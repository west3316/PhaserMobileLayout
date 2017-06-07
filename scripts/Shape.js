var Shape = {
    Type: {
        Circle: 0,
        Ellipse: 1,
        Polygon: 2,
        Rect: 3,
        RoundedRect: 4,
        Shape: 5,
        Triangle: 6,
        Triangles: 7,
    }
}



// Shape.sprite = function (options) {
//     var graphics = this.draw(options);
//     var sprite = PML.game.add.sprite(options.x, options.y, graphics.generateTexture());
//     graphics.destroy();

//     // 保存参数用于调整
//     sprite._options = options;
//     return sprite;
// };

Shape.draw = function (options) {
    options = _.merge({
        fillColor: 0x312110,
        fillAlpha: 1,
        lineColor: 0x000000,
        lineAlpha: 1,
        lineWidth: 1,
    }, options);
    var graphics = PML.game.add.graphics(0, 0);
    if (options.lineAlpha !== 0) {
        graphics.lineStyle(options.lineWidth, options.lineColor, options.lineAlpha);
    }

    if (options.fillAlpha !== 0) {
        graphics.beginFill(options.fillColor, options.fillAlpha);
        this._draw(graphics, options);
        graphics.endFill();
    }

    return graphics;
};

Shape._draw = function (obj, options) {
    switch (options.type) {
        case this.Type.Circle:
            if (options.x === "undefined" || options.y === "undefined" || options.radius === "undefined") {
                console.log("Shape circle options not enough");
                return;
            }

            obj.drawCircle(options.x, options.y, options.radius);
            break;
        case this.Type.Ellipse:
            if (options.x === "undefined" || options.y === "undefined" || options.width === "undefined" || options.height === "undefined") {
                console.log("Shape ellipse options not enough");
                return;
            }

            obj.drawEllipse(options.x, options.y, options.width, options.height);
            break;
        case this.Type.Polygon:
            if (options.path === "undefined") {
                console.log("Shape polygon options not enough");
                return;
            }

            console.log("未实现");
            break;
        case this.Type.Rect:
            if (options.x === "undefined" || options.y === "undefined" || options.width === "undefined" || options.height === "undefined") {
                console.log("Shape rect options not enough");
                return;
            }

            obj.drawRect(options.x, options.y, options.width, options.height);
            break;
        case this.Type.RoundedRect:
            if (options.x === "undefined" || options.y === "undefined" || options.width === "undefined"
                || options.height === "undefined" || options.radius === "undefined") {
                console.log("Shape rounded rect options not enough");
                return;
            }

            obj.drawRoundedRect(options.x, options.y, options.width, options.height, options.radius);
            break;
        case this.Type.Shape:
            if (options.shape === "undefined") {
                console.log("Shape shape options not enough");
                return;
            }

            console.log("未实现");
            break;
        case this.Type.Triangle:
            if (options.points === "undefined" || options.cull === "undefined") {
                console.log("Shape triangle options not enough");
                return;
            }

            if (!options.points instanceof Array || !options.cull instanceof Boolean) {
                console.log("Shape triangle options type error");
                return;
            }

            console.log("未实现");
            break;
        case this.Type.Triangles:
            if (options.points === "undefined" || options.indices === "undefined" || options.cull === "undefined") {
                console.log("Shape triangle options not enough");
                return;
            }

            if (!options.points instanceof Array || !options.indices instanceof Array || !options.cull instanceof Boolean) {
                console.log("Shape triangle options type error");
                return;
            }

            console.log("未实现");
            break;
        default:
            console.log("Unkown draw type");
    }
};

Shape.reset = function (sprite, options) {
    if (_.isUndefined(options)) {
        options = {};
    }

    options = _.merge(sprite._options, options);
    if (_.isNumber(options.alpha)) {
        options.fillAlpha = options.alpha;
        options.lineAlpha = options.alpha;
    }

    if (_.isBoolean(options.visible) && !options.visible) {
        options.fillAlpha = 0;
        options.lineAlpha = 0;
    }

    sprite.loadTexture(this.draw(options.type, options).generateTexture());
    _.assign(sprite, options);
    return sprite;
};



