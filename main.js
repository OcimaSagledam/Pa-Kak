/* Since I am loading my scripts dynamically from the pa-kak.html, I am wrapping
my main JavaScript file in a load listener. This ensures that this code will not
execute until the document has finished loading and I have access to all of my classes. */
window.addEventListener("load", function(event) {

    "use strict";

    var keyDownUp = function(event){
        controller.keyDownUp(event.type, event.keyCode);
    };
    
    var resize = function(event){
        display.resize(document.documentElement.clientWidth - 32, document.documentElement.clientHeight - 32, game.world.height / game.world.width);
        display.render();
    };

    var render = function(){
        display.fill(game.world.background_color);
        display.drawRectangle(game.world.player.x, game.world.player.y, game.world.player.width, game.world.player.height, game.world.player.color);
        display.render();
    };

    var update = function () {
        if (controller.left.active)  { game.world.player.moveLeft();  }
        if (controller.right.active) { game.world.player.moveRight(); }
        if (controller.up.active)    { game.world.player.jump(); controller.up.active = false; }
        game.update();
    };

    /*The controller handles user input*/
    var controller = new Controller();
    /*The display handles window resizing, as well as the on screen*/
    var display = new Display(document.querySelector("canvas"));
    /*The game contains game logic*/
    var game = new Game();
    /*Within the engine, all other components interact*/
    var engine = new Engine(1000/30, render, update);

    display.buffer.canvas.height = game.world.height;
    display.buffer.canvas.width = game.world.width;

    window.addEventListener("resize", resize);
    window.addEventListener("keydown", keyDownUp);
    window.addEventListener("keyup", keyDownUp);

    resize();
    engine.start();
});