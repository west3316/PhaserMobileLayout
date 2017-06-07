var MySceneControl = function () {
    ConfigLayout.call(this);
}

MySceneControl.prototype = _.create(ConfigLayout.prototype, {
    "constructor": MySceneControl,
    "_super": ConfigLayout.prototype,

    init: function () {
        // load a config file
        this.addLayoutFile("MyScene");
        this._super.init();
    },
    preload: function () {
        this._super.preload();
    },
    create: function () {
        this._super.create();

        // get our config `bg` sprite
        var bg = this.get("bg");
        console.log("bg:", bg);

        this.get("panel").autoAlign();
        this.get("label").autoAlign();

        // TODO: add control for display things
    },
});
