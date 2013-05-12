// http://life.written.ru/game_of_life_review_by_gardner
function Life(width, height, canvas) {
	console.log('Life');
	this.width = width;
	this.height = height;
	
	this.canvas = canvas;
	this.ctx = this.canvas.getContext("2d");
	this.m_w = Math.floor(this.canvas.width / this.width);
	this.m_h = Math.floor(this.canvas.height / this.height);
	
	this.field = [];
	
	this.generate();
	this.display();
}

Life.prototype = {
    'generate': function(){
		console.log('generate');
		this.field = [];
		for (i=0; i<this.width; i++) {
			for (k=0; k<this.height; k++) {
				if (k == 0) {
					this.field[i] = [];
				}
				this.field[i][k] = Math.random() > 0.5 ? 1: 0;
			}
		}
    },
	
	'display': function() {
		console.log('display');
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.fillStyle="#00FF00";
		
		for (i=0; i<this.width; i++) {
			for (k=0; k<this.height; k++) {
				//console.log('[' + i + '][' + k + '] = ' + this.field[i][k]);
				if (this.field[i][k] == 1) {
					this.ctx.fillRect(i*this.m_w, k*this.m_h, this.m_w, this.m_h);
				}
			}
		}
	},
	
	'next': function() {
		console.log('next');
		var next_field = [];
		var neighbor_count = 0;
		for (i=0; i<this.width; i++) {
			for (k=0; k<this.height; k++) {
				if (k == 0) {
					next_field[i] = [];
				}
				next_field[i][k] = 0;
				neighbor_count = this.neighbor(i, k);
				
				if (this.field[i][k] == 0) {
					if (neighbor_count == 3) {
						next_field[i][k] = 1;
					}
				} else {
				    if ((neighbor_count == 2) || (neighbor_count == 3)) {
						next_field[i][k] = 1;
					}
				}

			}
		}
		
		this.field = next_field;
	},
	
	'neighbor': function(i, k) {
		r = this.getf(i-1, k-1) + this.getf(i, k-1) + this.getf(i+1, k-1) +
			this.getf(i-1, k)   +        0          + this.getf(i+1, k)   +
			this.getf(i-1, k+1) + this.getf(i, k+1) + this.getf(i+1, k+1);
			
		return r;
	},
	
	// todo: toroid universe
	'getf': function(i, k) {
	    if ((this.field[i] !== undefined) && (this.field[i][k] !== undefined)) {
			return this.field[i][k];
		} else {
			return 0;
		}
	},
	
	// todo: pause, start, stop
	'go': function(msec) {
		var l = this;
		setInterval(
			function() {
				l.next();
				l.display();
				
			},
			msec
		);
	}
	
};