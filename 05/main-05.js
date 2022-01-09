window.addEventListener("load", function(event) {

  "use strict";
  const AssetsManager = function() {

    this.tile_set_image = undefined;

  };

  AssetsManager.prototype = {

    constructor: Game.AssetsManager,

    loadTileSetImage:function(url, callback) {

      this.tile_set_image = new Image();

      this.tile_set_image.addEventListener("load", function(event) {

        callback();

      }, { once : true});

      this.tile_set_image.src = url;

    }

  };

   ///////////////////
    //// FUNCTIONS ////
  ///////////////////

  var keyDownUp = function(event) {

    controller.keyDownUp(event.type, event.keyCode);

  };

  var resize = function(event) {

    display.resize(document.documentElement.clientWidth, document.documentElement.clientHeight, game.world.height / game.world.width);
    display.render();

  };

  /* The render function uses the new display methods now. I will eventually have to create
  some sort of object manager when I get more objects on the screen. */
  var render = function() {

    display.drawMap   (assets_manager.tile_set_image,
    game.world.tile_set.columns, game.world.map, game.world.columns,  game.world.tile_set.tile_size);

    let frame = game.world.tile_set.frames[game.world.player.frame_value];

    display.drawObject(assets_manager.tile_set_image,
    frame.x, frame.y,
    game.world.player.x + Math.floor(game.world.player.width * 0.5 - frame.width * 0.5) + frame.offset_x,
    game.world.player.y + frame.offset_y, frame.width, frame.height);

    display.render();

  };

  var update = function() {

    if (controller.left.active ) { game.world.player.moveLeft ();                               }
    if (controller.right.active) { game.world.player.moveRight();                               }
    if (controller.up.active   ) { game.world.player.jump();      controller.up.active = false; }

    game.update();

  };

      /////////////////
    //// OBJECTS ////
  /////////////////

  var assets_manager = new AssetsManager();// Behold the new assets manager!
  var controller     = new Controller();
  var display        = new Display(document.querySelector("canvas"));
  var game           = new Game();
  var engine         = new Engine(1000/30, render, update);

      ////////////////////
    //// INITIALIZE ////
  ////////////////////

  /* This is going to have to be moved to a setup function inside of the Display class or something.
  Leaving it out here is kind of sloppy. */
  display.buffer.canvas.height = game.world.height;
  display.buffer.canvas.width  = game.world.width;
  display.buffer.imageSmoothingEnabled = false;

  /* Now my image is loaded into the assets manager instead of the display object.
  The callback starts the game engine when the graphic is loaded. */
  assets_manager.loadTileSetImage("Sprites/Tiles.png", () => {
    display.tile_sheet.image.addEventListener("load", function(event) {
      resize();
    }, { once:true });
  
    display.player_sheet.image.src = "Sprites/Player.png";
    resize();
    engine.start();

  });

  window.addEventListener("keydown", keyDownUp);
  window.addEventListener("keyup",   keyDownUp);
  window.addEventListener("resize",  resize);

});