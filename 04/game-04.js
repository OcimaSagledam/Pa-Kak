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
    this.collider = new Game.World.Collider();// Here's the new collider class.
  
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
                24,72,73,74,140,140,140,00,03,03,02,121,
                24,92,93,94,140,140,140,80,81,82,81,82,
                24,112,113,114,140,175,140,140,140,140,140,140,
                24,140,88,140,00,04,140,140,140,140,140,00,
                24,140,108,140,20,24,140,140,140,140,140,20,
                120,01,02,03,121,120,01,02,03,02,03,121];
  
  /* These collision values correspond to collision functions in the Collider class.
  00 is nothing. everything else is run through a switch statement and routed to the
  appropriate collision functions. These particular values aren't arbitrary. Their binary
  representation can be used to describe which sides of the tile have boundaries.
  0000 = 0  tile 0:    0    tile 1:   1     tile 2:    0    tile 15:    1
  0001 = 1           0   0          0   0            0   1            1   1
  0010 = 2             0              0                0                1
  1111 = 15        No walls     Wall on top      Wall on Right      four walls
  This binary representation can be used to describe which sides of a tile are boundaries.
  Each bit represents a side: 0 0 0 0 = l b r t (left bottom right top). Keep in mind
  that this is just one way to look at it. You could assign your collision values
  any way you want. This is just the way I chose to keep track of which values represent
  which tiles. I haven't tested this representation approach with more advanced shapes. */

  this.collision_map = [
    00,04,04,04,04,04,04,04,04,04,04,00,
    02,00,00,00,00,00,00,00,00,00,00,08,
    02,00,00,00,00,00,00,00,00,00,00,08,
    02,00,00,00,00,00,00,09,01,01,01,00,
    02,00,01,00,00,00,00,12,04,04,04,04,
    02,01,01,01,00,01,00,00,00,00,00,00,
    02,00,00,00,09,03,00,00,00,00,00,09,
    02,00,00,00,08,03,00,00,00,00,00,08,
    00,01,01,01,08,01,01,01,01,01,01,08];

    /* Height and Width now depend on the map size. */
    this.height   = this.tile_size * this.rows;
    this.width    = this.tile_size * this.columns;
  
  };
  
  Game.World.prototype = {
  
    constructor: Game.World,
  
    /* This function has been hugely modified. */
    collideObject:function(object) {
  
      /* Let's make sure we can't leave the world boundaries. */
      if      (object.getLeft()   < 0          ) { object.setLeft(0);             object.velocity_x = 0; }
      else if (object.getRight()  > this.width ) { object.setRight(this.width);   object.velocity_x = 0; }
      if      (object.getTop()    < 0          ) { object.setTop(0);              object.velocity_y = 0; }
      else if (object.getBottom() > this.height) { object.setBottom(this.height); object.velocity_y = 0; object.jumping = false; }
  
      /* Now let's collide with some tiles!!! The side values refer to the tile grid
      row and column spaces that the object is occupying on each of its sides. For
      instance bottom refers to the row in the collision map that the bottom of the
      object occupies. Right refers to the column in the collision map occupied by
      the right side of the object. Value refers to the value of a collision tile in
      the map under the specified row and column occupied by the object. */
      var bottom, left, right, top, value;
  
      /* First we test the top left corner of the object. We get the row and column
      he occupies in the collision map, then we get the value from the collision map
      at that row and column. In this case the row is top and the column is left. Then
      we hand the information to the collider's collide function. */
      top    = Math.floor(object.getTop()    / this.tile_size);
      left   = Math.floor(object.getLeft()   / this.tile_size);
      value  = this.collision_map[top * this.columns + left];
      this.collider.collide(value, object, left * this.tile_size, top * this.tile_size, this.tile_size);
  
      /* We must redifine top since the last collision check because the object may
      have moved since the last collision check. Also, the reason I check the top corners
      first is because if the object is moved down while checking the top, he will be
      moved back up when checking the bottom, and it is better to look like he is standing
      on the ground than being pushed down through the ground by the cieling. */
      top    = Math.floor(object.getTop()    / this.tile_size);
      right  = Math.floor(object.getRight()  / this.tile_size);
      value  = this.collision_map[top * this.columns + right];
      this.collider.collide(value, object, right * this.tile_size, top * this.tile_size, this.tile_size);
  
      bottom = Math.floor(object.getBottom() / this.tile_size);
      left   = Math.floor(object.getLeft()   / this.tile_size);
      value  = this.collision_map[bottom * this.columns + left];
      this.collider.collide(value, object, left * this.tile_size, bottom * this.tile_size, this.tile_size);
  
  
      bottom = Math.floor(object.getBottom() / this.tile_size);
      right  = Math.floor(object.getRight()  / this.tile_size);
      value  = this.collision_map[bottom * this.columns + right];
      this.collider.collide(value, object, right * this.tile_size, bottom * this.tile_size, this.tile_size);
  
    },
  
    update:function() {
  
      this.player.velocity_y += this.gravity;
      this.player.update();
  
      this.player.velocity_x *= this.friction;
      this.player.velocity_y *= this.friction;
  
      this.collideObject(this.player);
  
    }
  
  };
  
  Game.World.Collider = function() {
  
    /* This is the function routing method. Basically, you know what the tile looks like
    from its value. You know which object you want to collide with, and you know the
    x and y position of the tile as well as its dimensions. This function just decides
    which collision functions to use based on the value and allows you to tweak the
    other values to fit the specific tile shape. */
    this.collide = function(value, object, tile_x, tile_y, tile_size) {
  
      switch(value) { // which value does our tile have?
  
        /* All 15 tile types can be described with only 4 collision methods. These
        methods are mixed and matched for each unique tile. */
  
        case  1: this.collidePlatformTop      (object, tile_y            ); break;
        case  2: this.collidePlatformRight    (object, tile_x + tile_size); break;
        case  3: if (this.collidePlatformTop  (object, tile_y            )) return;// If there's a collision, we don't need to check for anything else.
                 this.collidePlatformRight    (object, tile_x + tile_size); break;
        case  4: this.collidePlatformBottom   (object, tile_y + tile_size); break;
        case  5: if (this.collidePlatformTop  (object, tile_y            )) return;
                 this.collidePlatformBottom   (object, tile_y + tile_size); break;
        case  6: if (this.collidePlatformRight(object, tile_x + tile_size)) return;
                 this.collidePlatformBottom   (object, tile_y + tile_size); break;
        case  7: if (this.collidePlatformTop  (object, tile_y            )) return;
                 if (this.collidePlatformRight(object, tile_x + tile_size)) return;
                 this.collidePlatformBottom   (object, tile_y + tile_size); break;
        case  8: this.collidePlatformLeft     (object, tile_x            ); break;
        case  9: if (this.collidePlatformTop  (object, tile_y            )) return;
                 this.collidePlatformLeft     (object, tile_x            ); break;
        case 10: if (this.collidePlatformLeft (object, tile_x            )) return;
                 this.collidePlatformRight    (object, tile_x + tile_size); break;
        case 11: if (this.collidePlatformTop  (object, tile_y            )) return;
                 if (this.collidePlatformLeft (object, tile_x            )) return;
                 this.collidePlatformRight    (object, tile_x + tile_size); break;
        case 12: if (this.collidePlatformLeft (object, tile_x            )) return;
                 this.collidePlatformBottom   (object, tile_y + tile_size); break;
        case 13: if (this.collidePlatformTop  (object, tile_y            )) return;
                 if (this.collidePlatformLeft (object, tile_x            )) return;
                 this.collidePlatformBottom   (object, tile_y + tile_size); break;
        case 14: if (this.collidePlatformLeft (object, tile_x            )) return;
                 if (this.collidePlatformRight(object, tile_x            )) return;
                 this.collidePlatformBottom   (object, tile_y + tile_size); break;
        case 15: if (this.collidePlatformTop  (object, tile_y            )) return;
                 if (this.collidePlatformLeft (object, tile_x            )) return;
                 if (this.collidePlatformRight(object, tile_x + tile_size)) return;
                 this.collidePlatformBottom   (object, tile_y + tile_size); break;
  
      }
  
    }
  
  };
  
  /* Here's where all of the collision functions live. */
  Game.World.Collider.prototype = {
  
    constructor: Game.World.Collider,
  
    /* This will resolve a collision (if any) between an object and the y location of
    some tile's bottom. All of these functions are pretty much the same, just adjusted
    for different sides of a tile and different trajectories of the object. */
    collidePlatformBottom:function(object, tile_bottom) {
  
      /* If the top of the object is above the bottom of the tile and on the previous
      frame the top of the object was below the bottom of the tile, we have entered into
      this tile. Pretty simple stuff. */
      if (object.getTop() < tile_bottom && object.getOldTop() >= tile_bottom) {
  
        object.setTop(tile_bottom);// Move the top of the object to the bottom of the tile.
        object.velocity_y = 0;     // Stop moving in that direction.
        return true;               // Return true because there was a collision.
  
      } return false;              // Return false if there was no collision.
  
    },
  
    collidePlatformLeft:function(object, tile_left) {
  
      if (object.getRight() > tile_left && object.getOldRight() <= tile_left) {
  
        object.setRight(tile_left - 0.01);// -0.01 is to fix a small problem with rounding
        object.velocity_x = 0;
        return true;
  
      } return false;
  
    },
  
    collidePlatformRight:function(object, tile_right) {
  
      if (object.getLeft() < tile_right && object.getOldLeft() >= tile_right) {
  
        object.setLeft(tile_right);
        object.velocity_x = 0;
        return true;
  
      } return false;
  
    },
  
    collidePlatformTop:function(object, tile_top) {
  
      if (object.getBottom() > tile_top && object.getOldBottom() <= tile_top) {
  
        object.setBottom(tile_top - 0.01);
        object.velocity_y = 0;
        object.jumping    = false;
        return true;
  
      } return false;
  
    }
  
   };
  
  /* The object class is just a basic rectangle with a bunch of prototype functions
  to help us work with positioning this rectangle. */
  Game.World.Object = function(x, y, width, height) {
  
   this.height = height;
   this.width  = width;
   this.x      = x;
   this.x_old  = x;
   this.y      = y;
   this.y_old  = y;
  
  };
  
  Game.World.Object.prototype = {
  
    constructor:Game.World.Object,
  
    /* These functions are used to get and set the different side positions of the object. */
    getBottom:   function()  { return this.y     + this.height; },
    getLeft:     function()  { return this.x;                   },
    getRight:    function()  { return this.x     + this.width;  },
    getTop:      function()  { return this.y;                   },
    getOldBottom:function()  { return this.y_old + this.height; },
    getOldLeft:  function()  { return this.x_old;               },
    getOldRight: function()  { return this.x_old + this.width;  },
    getOldTop:   function()  { return this.y_old                },
    setBottom:   function(y) { this.y     = y    - this.height; },
    setLeft:     function(x) { this.x     = x;                  },
    setRight:    function(x) { this.x     = x    - this.width;  },
    setTop:      function(y) { this.y     = y;                  },
    setOldBottom:function(y) { this.y_old = y    - this.height; },
    setOldLeft:  function(x) { this.x_old = x;                  },
    setOldRight: function(x) { this.x_old = x    - this.width;  },
    setOldTop:   function(y) { this.y_old = y;                  }
  
  };
  
  Game.World.Player = function(x, y) {
  
    Game.World.Object.call(this, 100, 100, 12, 12);
  
    this.color1     = "#404040";
    this.color2     = "#f0f0f0";
  
    this.jumping    = true;
    this.velocity_x = 0;
    this.velocity_y = 0;
  
  };
  
  Game.World.Player.prototype = {
  
    jump:function() {
  
      if (!this.jumping) {
  
        this.jumping     = true;
        this.velocity_y -= 20;
  
      }
  
    },
  
    moveLeft:function()  { this.velocity_x -= 0.5; },
    moveRight:function() { this.velocity_x += 0.5; },
  
    update:function() {
  
      this.x_old = this.x;
      this.y_old = this.y;
      this.x    += this.velocity_x;
      this.y    += this.velocity_y;
  
    }
  
  };
  
  Object.assign(Game.World.Player.prototype, Game.World.Object.prototype);
  Game.World.Player.prototype.constructor = Game.World.Player;