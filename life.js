// Life core - calculate game rules.
//
// Requirements:
// CryptoJS (https://code.google.com/p/crypto-js/#MD5)
function Life(width, height) {
    this.width = width;
    this.height = height;
    
    this.field = [];
    this.generations = [];
    this.step = 0;
}

Life.prototype = {
    generate: function(density) {
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
    
    next: function() {
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
        // return number of duplicate generation
        // return -1 in case of unique generation
        return this.generations.lastIndexOf(hash, -2);
    },
    
    neighbor: function(i, k) {
        r = this.cell(i-1, k-1) + this.cell(i, k-1) + this.cell(i+1, k-1) +
            this.cell(i-1, k)   +        0          + this.cell(i+1, k)   +
            this.cell(i-1, k+1) + this.cell(i, k+1) + this.cell(i+1, k+1);
            
        return r;
    },
    
    cell: function(i, k) {
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
    
};