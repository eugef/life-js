// http://life.written.ru/game_of_life_review_by_gardner

// Requirements:
// CryptoJS (https://code.google.com/p/crypto-js/#MD5)
function Life(width, height, canvas) {
    this.width = width;
    this.height = height;
    
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.m_w = Math.floor(this.canvas.width / this.width);
    this.m_h = Math.floor(this.canvas.height / this.height);
    
    this.field = [];
    this.generations = [];
    this.step = 0;
    this.timer = 0;
}

Life.prototype = {
    'generate': function(density) {
        this.field = [];
        this.generations = [];
        this.step = 0;
        
        var line = '';
        for (i=0; i<this.width; i++) {
            for (k=0; k<this.height; k++) {
                if (k == 0) {
                    this.field[i] = [];
                }
                this.field[i][k] = Math.random() < (density / 100) ? 1: 0;
                
                line += this.field[i][k];
            }
        }
        this.generations[this.step] = CryptoJS.MD5(line).toString();
    },
    
    'display': function() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle="#00FF00";
        
        for (i=0; i<this.width; i++) {
            for (k=0; k<this.height; k++) {
                if (this.field[i][k] == 1) {
                    //  draw rectagle with 1px padding
                    this.ctx.fillRect(i*this.m_w+1, k*this.m_h+1, this.m_w-2, this.m_h-2);
                }
            }
        }
    },
    
    'next': function() {
        this.step++;
        var next_field = [];
        var neighbor_count = 0;
        var line = '';
        
        for (i=0; i<this.width; i++) {
            for (k=0; k<this.height; k++) {
                if (k == 0) {
                    next_field[i] = [];
                }
                next_field[i][k] = 0;
                neighbor_count = this.neighbor(i, k);
                
                if (this.field[i][k] == 0) {
                    // birth of new cell
                    if (neighbor_count == 3) {
                        next_field[i][k] = 1;
                    }
                } else {
                    // cell is still alive
                    if ((neighbor_count == 2) || (neighbor_count == 3)) {
                        next_field[i][k] = 1;
                    }
                }
                
                line += next_field[i][k];
            }
        }
        
        this.field = next_field;
        var hash = CryptoJS.MD5(line).toString();
        this.generations[this.step] = hash;
        
        // check if such generation already exists,
        // omit last (current one) generation.
        if (this.generations.lastIndexOf(hash, -2) == -1) {
            return true;
        } else {
            return false;
        }
    },
    
    'neighbor': function(i, k) {
        r = this.cell(i-1, k-1) + this.cell(i, k-1) + this.cell(i+1, k-1) +
            this.cell(i-1, k)   +        0          + this.cell(i+1, k)   +
            this.cell(i-1, k+1) + this.cell(i, k+1) + this.cell(i+1, k+1);
            
        return r;
    },
    
    'cell': function(i, k) {
        // Toroid universe:
        // Left border is connected to right
        if (i < 0) {
            i = this.width + i;
        } else if (i >= this.width) {
            i = i - this.width;
        }
        // Top Border is connected to bottom
        if (k < 0) {
            k = this.height + k;
        } else if (k >= this.height) {
            k = k - this.height;
        }
        
        return this.field[i][k];
    },
    
    'play': function(msec, autostop) {
        if (this.timer) {
            this.stop();
        }
        
        var l = this;
        this.timer = setInterval(
            function() {
                var next_step = l.next();
                if (!next_step && autostop) {
                    l.stop();
                } else {
                    l.display();
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
        this.generate(density);
        this.display();
    }
    
};