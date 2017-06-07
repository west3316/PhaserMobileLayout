/**
 * 采用配置文件布局
 * @class
 * @classdesc 该模块只进行布局和展示
 */


var ConfigLayout = function () { };


ConfigLayout.prototype = {
    // 总是定义`CONFIG`变量, 指向本状态布局配置的缓存key, 必须在control层init()方法中指明
    CONFIG: [],

    // UICreator 对象
    _creator: null,

    init: function () {
        // 初始化 UICreator 对象
        this._creator = new UICreator();
        this._creator.init();
    },
    preload: function () {
        _.forEach(this.CONFIG, function (cfg) {
            if (!PML.uiConfig.load(cfg)) {
                return;
            }

            var audio = PML.uiConfig.getAudio(cfg);
            if (audio) {
                this._creator.loadAudio(audio);
            }

            // 读取资源
            var images = PML.uiConfig.getImage(cfg);
            if (!images) {
                console.log("没有配置`image`资源");
                return;
            }

            // 加载资源
            this._creator.loadImages(images);

            // 读取精灵表
            var spriteSheets = PML.uiConfig.getSpriteSheet(cfg);
            if (spriteSheets) {
                // 加载资源
                this._creator.loadSpriteSheet(spriteSheets);
            }

            // 读取xml表资源
            var xml = PML.uiConfig.getAltasXML(cfg);
            if (xml) {
                // 加载资源
                this._creator.loadAltasXML(xml);
            }

            // 读取json表资源
            var json = PML.uiConfig.getAltasJson(cfg);
            if (json) {
                // 加载资源
                this._creator.loadAltasJson(json);
            }
        }, this);
    },

    create: function () {
        // 解析并创建元素
        console.log("解析并创建元素");

        _.forEach(this.CONFIG, function (cfg) {
            // 读取布局
            var layout = PML.uiConfig.getLayout(cfg);
            if (!layout) {
                return;
            }

            // 根据布局创建UI对象
            this._creator.createUI(layout);
        }, this);

        // 拉伸至全屏
        this._creator.fullScreen();
    },
    shutdown: function() {
        this._creator.release();
    },
    get: function (name) {
        return this._creator.get(name);
    },
    // 增加配置布局文件
    addLayoutFile: function (configKey) {
        this.CONFIG.push(configKey);
    },
    // 固定摄像机, 自动调整位置偏移
    fixedToCamera: function (arrKeys) {
        _.forEach(arrKeys, function (item) {
            this._cameraOffset(this.get(item));
        }, this);
    },

    // =========================================== 内部方法 ==================================================
    _groupCameraOffset: function (group) {
        _.forEach(group.children, function (ob) {
            this._cameraOffset(ob);
        }, this);
    },
    _cameraOffset: function (ob) {
        if (ob instanceof Phaser.Group) {
            // console.log(ob.ext.name, "组");
            this._groupCameraOffset(ob);
            return;
        }

        // 固定镜头后会导致偏移
        ob.fixedToCamera = true;
        // 修复镜头偏移
        ob.autoAlign();
        ob.cameraOffset.set(ob.x * PML.coordinate.horizontal, ob.y * PML.coordinate.vertical);
        // console.log(ob.ext.name, ob.x, ob.y);
        if (ob.children.length != 0) {
            this._groupCameraOffset(ob);
        }
    },
}


