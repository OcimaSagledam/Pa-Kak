window.addEventListener("load", function(event){

    "use strict";

    var render = function(){
        display.renderColor(game.color);
        display.render();
    };

    var update = function () {
        game.update();
    };

    /*The controller handles user input*/
    var controller = new Controller();
    /*The display handles window resizing, as well as the on screen*/
    var display = new Display(document.querySelector("canvas"));
    /*The game contains game logic*/
    var game = new Gamepad();
    /*Within the engine, all other components interact*/
    var engine = new Engine(1000/30, render, update);


    window.addEventListener("resize", display.handleResize);
    window.addEventListener("keydown", controller.handleKeyDownUp);
    window.addEventListener("keyup", controller.handleKeyDownUp);

    display.resize();
    engine.start();
});