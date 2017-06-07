// `Phaser Mobile Layout` global domain
var PML = {};

(function () {
    var w = window.screen.width * window.devicePixelRatio;
    var h = window.screen.height * window.devicePixelRatio;

    var game = new Phaser.Game(w, h, Phaser.AUTO, "game");
    Boot = function () { }

    Boot.prototype = {
        init: function () {
            // 保存到全局域中
            PML.game = game;
        },
        preload: function () {
            game.load.script("UIConfig", "scripts/UIConfig.js");
            game.load.script("Shape", "scripts/Shape.js");
            game.load.script("UICreator", "scripts/UICreator.js");
            game.load.script("ConfigLayout", "scripts/ConfigLayout.js");

            // load layout config file
            game.load.text("MyScene", "assets/layout/MyScene.yaml");
            // inherit ConfigLayout
            game.load.script("MySceneControl", "states/MySceneControl.js");
        },

        create: function () {
            game.input.maxPointers = 1;
            game.scale.pageAlignVertically = true;
            game.scale.pageAlignHorizontally = true;
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            // 强制使用横屏游戏
            game.scale.forceOrientation(true, false);
            game.scale.updateLayout(true);
            game.scale.setShowAll();
            game.scale.refresh();

            // and to global domain
            PML.uiConfig = new UIConfig();
            // *important: calc scale ratio by resource raw coordinate
            this.calcCoordinate(1280, 720);

            game.state.add("MySceneControl", MySceneControl);
            game.state.start("MySceneControl");
        },

        calcCoordinate: function (rawWidth, rawHeight) {
            PML.coordinate = {};
            // 计算出调整的比率
            PML.coordinate.horizontal = this.game.width / rawWidth;
            PML.coordinate.vertical = this.game.height / (rawHeight * PML.coordinate.horizontal) * PML.coordinate.horizontal;
        },
    };

    function startGame() {
        console.log("Boot state");
        game.state.add("Boot", Boot);
        game.state.start("Boot");
    }

    if (true || game.device.desktop) {
        console.log("PC");
        startGame();
    } else {
        console.log("Mobile");
        document.addEventListener("deviceready", startGame, false);
    }


}());

