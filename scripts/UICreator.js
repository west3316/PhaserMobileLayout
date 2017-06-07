var UICreator = function () { }

UICreator.prototype = {
    // 将`name`属性和Phaser对象关联
    _name2Obj: {},
    _name2Attrs: {},

    // 将添加`children`操作延时到解析完成
    _delayAddChild: {},
    _delayCopy: {},



    // 
    _name2Shap: {
        "圆": Shape.Type.Circle,
        "椭圆": Shape.Type.Ellipse,
        "矩形": Shape.Type.Rect,
        "圆角矩形": Shape.Type.RoundedRect,
        
        "Circle": Shape.Type.Circle,
        "Ellipse": Shape.Type.Ellipse,
        "Rect": Shape.Type.Rect,
        "RoundedRect": Shape.Type.RoundedRect,
    },

    // 按照元素`type`属性解析
    _createByType: {
        group: null,
        sprite: null,
        shape: null,
        text: null,
    },


    init: function () {
        this.root = PML.game.add.group();
        this._setCache("group", { name: "root" }, this.root);

        this._createByType.group = this._group;
        this._createByType.sprite = this._sprite;
        this._createByType.shape = this._shape;
        this._createByType.text = this._text;
        this._createByType.copy = this._copy;
        this._createByType.button = this._button;

    },
    /**
     * 加载音频资源
     */
    loadAudio: function (audio) {
        _.forEach(audio, function (value, key) {
            console.log(key, value);
            PML.game.load.audio(key, value);
        });
    },
    /**
     * 加载图片资源
     */
    loadImages: function (images) {
        _.forEach(images, function (value, key) {
            console.log(key, value);
            PML.game.load.image(key, value);
        });
    },
    /**
     * 加载精灵表
     */
    loadSpriteSheet: function (sheets) {
        var key, path, width, height;
        _.forEach(sheets, function (params) {
            key = params[0];
            path = params[1];
            width = params[2];
            height = params[3];
            console.log(key, path);
            PML.game.load.spritesheet(key, path, width, height);
        });
    },
    /**
     * 加载XML形式的序列图
     */
    loadAltasXML: function (xmls) {
        var key, xml, image;
        _.forEach(xmls, function (params) {
            key = params[0];
            image = params[1];
            xml = params[2];
            console.log(key, xml);
            PML.game.load.atlasXML(key, image, xml);
        });
    },
    /**
     * 加载Json形势的序列图
     */
    loadAltasJson: function (jsons) {
        var key, json, image;
        _.forEach(jsons, function (params) {
            key = params[0];
            image = params[1];
            json = params[2];
            console.log(key, json);
            PML.game.load.atlasJSONHash(key, image, json);
        });
    },

    /**
     * 创建绘制 UI 对象并根据给定的`id`缓存
     */
    createUI: function (layout) {
        // 解析`layout`
        var ob;
        var self = this;
        var hiddenRef = [];
        _.forEach(layout, function (item) {
            _.forEach(item, function (value, key) {
                // console.log(key, value);
                ob = self._create(key, value);

                // 隐藏整个`ref`属性树
                if (ob && value.ref) {
                    ob.visible = false;
                }

                // 排除引用元素
                if (_.isObject(ob) && !value.ref) {
                    console.log("root add:", ob.ext.name, value);
                    self.root.add(ob);
                }

                if (key == "copy" && !value.ref) {
                    if (_.isUndefined(value.name)) {
                        // console.error("语法错误: `copy`元素缺少name属性");
                        // return;
                        value.name = this._newName("copy");
                    }
                    self._addChildJob("root", value.name);
                }
            });
        });

        this._after();
    },
    fullScreen: function () {
        // 通过调整摄像机全屏
        // console.log("root size:", this.root.width, this.root.height);

        PML.game.camera.bounds.setTo(0, 0, this.root.width, this.root.height);
        PML.game.camera.scale.set(PML.coordinate.horizontal, PML.coordinate.vertical);
        console.log("PML.game.camera.scale", PML.game.camera.scale);

        // 计算图像区域
        // var rcCoordinate = this._calcRect({ x: 0, y: 0, width: this.root.width, height: this.root.height });
        // console.log("rcCoordinate", rcCoordinate);
        // 不能直接修改 width, height
        // _.assign(this.root, rcCoordinate);
    },
    /**
     * @param  {string} name 配置中的`name`属性, 缓存索引key
     * @return {Phaser.Sprite/Pahser.Group/Phaser.Button/Phaser.Text ...}
     */
    get: function (name) {
        return this._name2Obj[name];
    },
    release: function () {
        _.forEach(this._name2Obj, function (obj, name) {
            if (obj.destory) {
                obj.destory();
            }

            if (obj.kill) {
                obj.kill();
            }

        });
        this._name2Obj = null;
        this._name2Attrs = null;
        this._delayAddChild = null;
        this._delayCopy = null;
    },

    // =========================================== 内部方法 ==================================================
    _create: function (key, value) {
        var fn = this._createByType[key];
        if (_.isUndefined(fn)) {
            console.error("无法解析元素`" + key + "`");
            return;
        }

        if (fn == null) {
            console.error("未注册元素`" + key + "`的解析方法");
            return;
        }

        // 执行解析
        return fn(this, key, value);
    },
    _after: function () {
        var ob;
        var self = this;

        var attrs;
        var type;
        _.forEach(this._delayCopy, function (value, key) {
            // 拷贝源的属性
            attrs = _.cloneDeep(self._name2Attrs[value.src]);
            type = attrs._innerType;
            // console.log(value, attrs.name);
            _.merge(attrs, _.omit(value, ["src", "_innerType"]));
            _.merge(attrs.area, _.pick(value, ["x", "y"]));
            // console.log(value.src, " attrs=> ", attrs);

            ob = self._create(type, attrs);
            if (_.isUndefined(ob)) {
                console.error("拷贝元素失败: ", attrs.toString());
                return;
            }
            self._setCache(type, attrs, ob);
        });

        // console.log("this._name2Obj", this._name2Obj);
        var child;
        var groupParent;
        _.forEach(this._delayAddChild, function (value, key) {
            // 父`group`元素
            groupParent = self._name2Obj[key];
            // console.log("parent:", key, value);
            _.forEach(value, function (item) {
                child = self._name2Obj[item];
                if (_.isUndefined(child)) {
                    console.error("`child`不存在:", item);
                    return;
                }
                attrs = self._name2Attrs[item];
                if (attrs && attrs.ref && _.isUndefined(attrs.visible)) {
                    child.visible = true;
                }

                // 子元素位置转为相对(父元素)偏移; 排除组元素因为Pahser会计算, 避免多次偏移问题
                if (!child instanceof Phaser.Group) {
                    child.x += groupParent.x;
                    child.y += groupParent.y;
                }
                // console.log("real add child:", child);
                child = groupParent.add(child);
                // console.log("real add child:", child.ext.name);
            });
        });
    },
    _clearCache: function () {
        this._name2Attrs = {};
        this._delayAddChild = {};
        this._delayCopy = {};
    },
    _setCache: function (type, attrs, ob) {
        if (_.isUndefined(attrs.name)) {
            attrs.name = this._newName(type);
        }

        this._name2Obj[attrs.name] = ob;
        attrs._innerType = type;
        this._name2Attrs[attrs.name] = attrs;

        if (_.isObject(attrs.area)) {
            attrs.area = _.merge({ x: ob.x, y: ob.y }, attrs.area);
            if (!_.isNumber(attrs.area.width) || !_.isNumber(attrs.area.height)) {
                console.error("`area`缺少正确的width, height属性");
            }
        }

        // 增加ext标记
        ob.ext = { name: attrs.name, area: attrs.area };
        ob.autoAlign = function () {
            ob = this;
            if (!_.isObject(ob.ext) || !_.isObject(ob.ext.area)) {
                // 没有自动布局对象
                // console.log("没有自动布局对象:", ob.ext);
                return;
            }

            var area = ob.ext.area;
            // console.log("areaareaareaareaarea", area);
            if (ob.width >= area.width) {
                ob.width = area.width;
                console.log("width overflow");
            } else {
                if (area.xalign === "左" || area.xalign == "left") {
                    ob.x = area.x;
                } else if (area.xalign === "右" || area.xalign == "right") {
                    ob.x = area.width - ob.width + area.x;
                } else if (area.xalign === "中" || area.xalign == "center") {
                    ob.x = area.width / 2 - ob.width / 2 + area.x;
                } else {
                    console.error("错误的`xalign`属性:", area.xalign);
                }
            }

            if (ob.height >= area.height) {
                ob.height = area.height;
                console.log("height overflow");
            } else {
                if (area.yalign === "上" || area.yalign === "top") {
                    ob.y = area.y;
                } else if (area.yalign === "下" || area.yalign === "bottom") {
                    ob.y = area.height - ob.height + area.y;
                } else if (area.yalign === "中" || area.yalign === "middle") {
                    ob.y = area.height / 2 - ob.height / 2 + area.y;
                } else {
                    console.error("错误的`yalign`属性:", area.yalign);
                }
            }
            // console.log("obobobobobb", _.pick(ob, ["x", "y", "width", "height"]));
        };
    },
    _addChildJob: function (parentName, name) {
        if (_.isUndefined(this._delayAddChild[parentName])) {
            this._delayAddChild[parentName] = [];
        }

        this._delayAddChild[parentName].push(name);
    },
    _calcRect: function (rect) {
        return {
            x: rect.x *= PML.coordinate.horizontal,
            y: rect.y *= PML.coordinate.vertical,
            width: rect.width *= PML.coordinate.horizontal,
            height: rect.height *= PML.coordinate.vertical
        }
    },
    _newName: function (type) {
        return _.uniqueId(type + "@");
    },
    _children: function (self, obPhaser, data) {
        if (_.isUndefined(data.children)) {
            return;
        }

        _.forEach(data.children, function (item) {
            if (_.isString(item.child)) {
                // console.log("add child3:", item);
                self._addChildJob(obPhaser.ext.name, item.child);
                return;
            }
            // console.log("add child4:", item);
            if (_.isObject(item.copy)) {
                item.copy.name = self._copy(self, "copy", item.copy);
                self._addChildJob(obPhaser.ext.name, item.copy.name);
                return;
            }

            if (!_.isObject(item)) {
                console.error("无效的`child`类型:", item);
                return;
            }

            _.forEach(item, function (v, k) {
                ob = self._create(k, v);
                if (_.isObject(ob)) {
                    obPhaser.add(ob);
                }
            });
        });
    },
    _group: function (self, etype, data) {
        data = _.merge({ x: 0, y: 0 }, data);

        var ob;
        var group = PML.game.add.group();
        var props = _.omit(data, ["id", "name", "group", "children", "ref", "copy", "_innerType"]);
        _.assign(group, props);
        self._setCache(etype, data, group);
        // console.log("groupName:", group.ext.name, props);
        if (!_.isUndefined(data.group)) {
            // console.log("add child1:", data.group);
            ob = self._group(self, etype, data.group);
            group.add(ob);
        }

        if (!_.isUndefined(data.copy)) {
            // console.log("add child2:", data.copy);
            data.copy.name = self._copy(self, data.name, data.copy);
            // console.log("delay:", data.name, data.copy.name);
            self._addChildJob(data.name, data.copy.name);
        }

        self._children(self, group, data);

        return group;
    },
    _sprite: function (self, etype, data) {
        var options = _.merge({
            x: 0,
            y: 0,
            frame: 0,
        }, data);

        if (_.isUndefined(options.key)) {
            console.error("语法错误: `sprite`元素没有key属性");
            return;
        }

        var sprite = PML.game.add.sprite(options.x, options.y, options.key, options.frame);
        self._setCache(etype, data, sprite);
        _.assign(sprite, _.omit(options, ["id", "name", "_innerType"]));


        sprite.changeKey = function (key) {
            var attrs = _.pick(sprite, ["width", "height"]);
            sprite.loadTexture(key);

            _.assign(sprite, attrs);
        }

        self._children(self, sprite, data);

        // console.log("options", rcCoordinate);
        return sprite;
    },
    _shape: function (self, etype, data) {
        var type = self._name2Shap[data.draw];
        if (_.isUndefined(data.draw)) {
            console.error("无法绘制该`shape`类型:", data.draw);
            return;
        }

        var options = _.omit(data, ["id", "draw"]);
        options.type = type;
        var graphics = Shape.draw(options);
        self._setCache(etype, data, graphics);
        return graphics;
    },
    _text: function (self, etype, data) {
        var options = _.merge({
            x: 0,
            y: 0,
        }, data);

        var text = PML.game.add.text(options.x, options.y, options.text, options.style);
        self._setCache(etype, data, text);
        _.assign(text, _.omit(options, ["style", "name", "ref", "area", "_innerType"]));

        self._children(self, text, data);

        return text;
    },
    _copy: function (self, etype, data) {
        if (_.isUndefined(data.src)) {
            console.error("语法错误: `copy`元素缺少src属性");
            return;
        }

        if (_.isUndefined(data.name)) {
            data.name = this._newName("copy");
            // console.log("data.name", data.name);
        }

        data = _.omit(data, "ref");

        // 缓存`copy`的属性
        self._delayCopy[data.name] = data;
        return data.name;
    },
    _button: function (self, etype, data) {
        var options = _.merge({
            x: 0,
            y: 0,
        }, data);

        if (_.isUndefined(options.key)) {
            console.error("语法错误: `button`元素没有key属性");
            return;
        }

        var button = PML.game.add.button(options.x, options.y, options.key);
        self._setCache(etype, data, button);
        _.assign(button, _.omit(options, ["id", "name", "_innerType"]));

        self._children(self, button, data);

        return button;
    },
}