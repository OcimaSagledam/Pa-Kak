const Engine = function (time_step, update, render){

    this.accumulated_time = 0; //Amount of time that's accumulated since the last update
    this.animation_frame_request = undefined,
    this.time = undefined, //The most recent timestamp of loop execution
    this.time_step = time_step, //1000/30 = 30 frames per second

    this.update = false;

    this.update = update;
    this.render = render;

    this.run = function(time_stamp){ //This is once cycle of the game loop
        this.accumulated_time += time_stamp - this.time;
        this.time = time_stamp;

        if (this.accumulated_time >= this.time_step*3){
            this.accumulated_time = this.time_step;
        }

        while(this.accumulated_time >= this.time_step){
            this.accumulated_time -= this.time_step;
            this.update(time_stamp);
            this.update=true;
        }    
        if(this.update){
            this.update=false;
            this.render(time_stamp);
        }
        this.animation_frame_request = window.requestAnimationFrame(this.handleRun);
    };
    this.handleRun = (time_step) => {this.run(time_step);};
};

Engine.prototype = {
    constructor: Engine,

    start:function(){
        this.accumulated_time = this.time_step;
        this.time = window.performance.now();
        this.animation_frame_request = window.requestAnimationFrame(this.handleRun);
    },
    stop:function(){
        window.cancelAnimationFrame(this.animation_frame_request);
    }
};