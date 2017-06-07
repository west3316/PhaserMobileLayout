# PhaserMobileLayout
layout for Phaser by YAML config file, only support mobile devices

# Featrues
- config layout
- auto scale
- easy

# Require
- js-yaml (parse YAML text)
- lodash  (make js easy)

# How to use
- include library file **js-yaml, lodash**
- load layout script
  - UIConfig.js (parse config)
  - UICreator.js (create Phaser object by UIConfig result)
  - Shape.js (Phaser.Graphics wrapper)
- load layout config file
  ```javascript
  // at previous game state
  this.game.load.text("MyScene", "assets/layout/MyScene.yaml");
  ```
- inherit **ConfigLayout**
  e.g.
  ```javascript
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
        
        // TODO: add control for display things
      },
    });
  ```
- get sprite refrence by name  

  ```javascript
    create: function () {
        this._super.create();
        
        // get background sprite by config name attr
         var bgSprite = this.get("bg");
         // var bgSprite = this.get("背景");
        
         // TODO: add control for display things
    },
  ```
  
# Suggestion
1. use **ConfigLayout** layout display object
2. inherit **ConfigLayout** with control, animation ... (support function for service)
3. inherit suggestion 2 with service implement

# How to cofig
See [HowToConfig.md]()

# Public License
[WTFPL](http://www.wtfpl.net/)





