// Life player - display Life flow on canvas
function LifePlayer(life, canvas) {
    this.life = life;
    this.canvas = canvas;
    
    this.ctx = this.canvas.getContext("2d");
    
    // Cell scale for width and height
    this.m_w = Math.floor(this.canvas.width / this.life.width);
    this.m_h = Math.floor(this.canvas.height / this.life.height);
    
    // Cell margin - 10% of scale
    this.c_m = Math.round(Math.min(this.m_w, this.m_h) / 10);
    
    this.timer = 0;
}

LifePlayer.prototype = {
    display: function() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle="#00FF00";
        
        for (i=0; i<this.life.width; i++) {
            for (k=0; k<this.life.height; k++) {
                if (this.life.field[i][k] == 1) {
                    // draw rectagle with margin
                    this.ctx.fillRect(i*this.m_w + this.c_m, k*this.m_h + this.c_m, this.m_w - 2*this.c_m, this.m_h - 2*this.c_m);
                }
            }
        }
    },
    
    play: function(msec, autostop) {
        if (this.timer) {
            this.stop();
        }
        
        var p = this;
        this.timer = setInterval(
            function() {
                var next_step = p.life.next();
                if (autostop && (next_step != -1)) {
                    p.stop();
                } else {
                    p.display();
                }
            },
            msec
        );
    },
    
    'stop': function() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = 0;
        }    
    },
    
    'restart': function(density) {
        this.stop();
        this.life.generate(density);
        this.display();
    }
    
};