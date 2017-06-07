var UIConfig = function () { }

UIConfig.prototype = {
    // 缓存载入的配置
    _cache: {},

    // 配置`name`与Phaser对象映射
    _name2Ob: {},

    // 载入所有配置文件
    load: function (cfgKey) {
        var doc = this._cache[cfgKey];
        if (!_.isUndefined(doc)) {
            return false;
        }

        // 从yaml配置中载入布局数据
        try {
            doc = jsyaml.safeLoad(PML.game.cache.getText(cfgKey));
        } catch (e) {
            console.error("UI布局配置解析失败:", e);
            return false;
        }

        this._cache[cfgKey] = doc;
        return true;
    },
    getAudio: function (cfgKey) {
        var doc = this._cache[cfgKey];
        if (!doc) {
            console.error("无法获取`" + cfgKey + "`配置数据");
            return;
        }

        var data = doc.res;
        if (!_.isObject(data)) {
            console.error("语法错误: 缺失`res`元素");
            return;
        }

        if (!_.isObject(data.audio)) {
            console.log("`res`元素缺少audio属性");
            return;
        }

        return data.audio;
    },
    getImage: function (cfgKey) {
        var doc = this._cache[cfgKey];
        if (!doc) {
            console.error("无法获取`" + cfgKey + "`配置数据");
            return;
        }

        var data = doc.res;
        if (!_.isObject(data)) {
            console.error("语法错误: 缺失`res`元素");
            return;
        }

        if (!_.isObject(data.image)) {
            console.error("语法错误: `res`元素缺少image属性");
            return;
        }

        return data.image;
    },
    getSpriteSheet: function (cfgKey) {
        var doc = this._cache[cfgKey];
        if (!doc) {
            console.error("无法获取`" + cfgKey + "`配置数据");
            return;
        }

        var data = doc.res;
        if (!_.isObject(data)) {
            console.error("语法错误: 缺失`res`元素");
            return;
        }

        if (!_.isObject(data.sheet)) {
            console.log("`res`元素没有sheet属性");
            return;
        }

        // 转换数据结构
        var ret = [];
        var lst;
        _.forEach(data.sheet, function (value, key) {
            var params = [];
            params.push(key);
            lst = value.split(",");
            if (lst.length != 3) {
                console.error("`sheet`格式错误1");
            }

            // path
            params.push(_.trim(lst[2]));

            try {
                // width, height
                params.push(parseInt(_.trim(lst[0])));
                params.push(parseInt(_.trim(lst[1])));
            } catch (e) {
                console.error("`sheet`格式错误2");
            }

            ret.push(params);
        }, this);

        return ret;
    },
    getAltasJson: function (cfgKey) {
        var doc = this._cache[cfgKey];
        if (!doc) {
            console.error("无法获取`" + cfgKey + "`配置数据");
            return;
        }

        var data = doc.res;
        if (!_.isObject(data)) {
            console.error("语法错误: 缺失`res`元素");
            return;
        }

        if (!_.isObject(data.json)) {
            console.log("`res`元素没有json属性");
            return;
        }

        // 转换数据结构
        var ret = [];
        var lst;
        _.forEach(data.json, function (value, key) {
            var params = [];
            params.push(key);
            lst = value.split(",");
            if (lst.length != 2) {
                console.error("`json`格式错误1");
            }

            // image
            params.push(_.trim(lst[1]));
            // json
            params.push(_.trim(lst[0]));

            ret.push(params);
        }, this);

        return ret;
    },
    getAltasXML: function (cfgKey) {
        var doc = this._cache[cfgKey];
        if (!doc) {
            console.error("无法获取`" + cfgKey + "`配置数据");
            return;
        }

        var data = doc.res;
        if (!_.isObject(data)) {
            console.error("语法错误: 缺失`res`元素");
            return;
        }

        if (!_.isObject(data.xml)) {
            console.log("`res`元素没有xml属性");
            return;
        }

        // 转换数据结构
        var ret = [];
        var lst;
        _.forEach(data.xml, function (value, key) {
            var params = [];
            params.push(key);
            lst = value.split(",");
            if (lst.length != 2) {
                console.error("`xml`格式错误1");
            }

            // image
            params.push(_.trim(lst[1]));
            // xml
            params.push(_.trim(lst[0]));

            ret.push(params);
        }, this);

        return ret;
    },

    getLayout: function (cfgKey) {
        var doc = this._cache[cfgKey];
        if (!doc) {
            console.error("无法获取`" + cfgKey + "`配置数据");
            return;
        }
        var layout = doc.layout
        if (!_.isObject(layout)) {
            console.error("语法错误: 缺失`layout`元素");
            return;
        }

        return layout;
    },

};