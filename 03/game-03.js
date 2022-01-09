const Game = function() {

    /* The world object is now its own class. */
    this.world = new Game.World();
  
    /* The Game.update function works the same as in part 2. */
    this.update = function() {
  
      this.world.update();
  
    };
  
  };
  
  Game.prototype = { constructor : Game };
  
  /* The world is now its own class. */
  Game.World = function(friction = 0.9, gravity = 3) {
  
    this.friction = friction;
    this.gravity  = gravity;
  
    /* Player is now its own class inside of the Game.World object. */
    this.player   = new Game.World.Player();
  
    /* Here is the map data. Later on I will load it from a json file, but for now
    I will just hardcode it here. */
    this.columns   = 12;
    this.rows      = 9;
    this.tile_size = 16;
    /*Svaki red ima 20 stupaca, s tin da svaki tip levela ima
    7 redova (znači npr level s zelenom travom se kreće od 1 do 140)
    Između svakog tipa levela prazan red
    (To znači da nakon zelenog levela koji završava na 140, 
    spritovi za žuti kreću od 160)
    */
    this.map = [100,81,82,83,81,82,83,81,82,83,81,101,
      24,140,140,140,140,140,140,140,140,140,140,20,
      24,140,140,140,140,140,140,140,140,140,140,20,
      24,140,140,140,140,140,140,00,03,03,02,121,
      24,140,140,140,140,140,140,80,81,82,81,82,
      24,140,140,140,140,175,140,140,140,140,140,140,
      24,140,140,140,00,04,140,140,140,140,140,00,
      24,140,140,140,20,24,140,140,140,140,140,20,
      120,01,02,03,121,120,01,02,03,02,03,121];
  
    /* Height and Width now depend on the map size. */
    this.height   = this.tile_size * this.rows;
    this.width    = this.tile_size * this.columns;
  
  };
  
  /* Now that world is a class, I moved its more generic functions into its prototype. */
  Game.World.prototype = {
  
    constructor: Game.World,
  
    collideObject:function(object) {// Same as in part 2.
  
      if (object.x < 0) { object.x = 0; object.velocity_x = 0; }
      else if (object.x + object.width > this.width) { object.x = this.width - object.width; object.velocity_x = 0; }
      if (object.y < 0) { object.y = 0; object.velocity_y = 0; }
      else if (object.y + object.height > this.height) { object.jumping = false; object.y = this.height - object.height; object.velocity_y = 0; }
  
    },
  
    update:function() {
  
      this.player.velocity_y += this.gravity;
      this.player.update();
  
      this.player.velocity_x *= this.friction;
      this.player.velocity_y *= this.friction;
  
      this.collideObject(this.player);
  
    }
  
  };
  
  /* The player is also its own class now. Since player only appears in the context
  of Game.World, that is where it is defined. */
  Game.World.Player = function(x, y) {
  
    this.color1     = "#404040";
    this.color2     = "#f0f0f0";
    this.height     = 12;
    this.jumping    = true;
    this.velocity_x = 0;
    this.velocity_y = 0;
    this.width      = 12;
    this.x          = 100;
    this.y          = 50;
  
  };
  
  Game.World.Player.prototype = {
  
    constructor : Game.World.Player,
  
    jump:function() {
  
      if (!this.jumping) {
  
        this.jumping     = true;
        this.velocity_y -= 20;
  
      }
  
    },
  
    moveLeft:function()  { this.velocity_x -= 0.5; },
    moveRight:function() { this.velocity_x += 0.5; },
  
    update:function() {
  
      this.x += this.velocity_x;
      this.y += this.velocity_y;
  
    }
  
  };