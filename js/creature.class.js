// obejeto
// dependencies: canvas.js, ga.js

console.log('imported creature.class.js');


class Creature {

	initial_point = point(0);

	initial_lobus = new Lobus();

	constructor() {

	}

	get property() {
		return this._property;
	}
	set property(p) {
		this._property = p;
	}
	
}


class Lobus {

	initial_point = point(50);
	vel = 1;
	acc = 0.001;
	jrk = 0.0;
	initial_radius = 12;
	vel_r = -0.01;
	acc_r = 0;
	nodes = [];
	extensions = [];

	max_length = 800;
	max_radius = 50;

	constructor() {

	}

	cast( pixelmap ) {

		if ( pixelmap == undefined ) return errr('pixelmap undefined');

		// RGB
		if ( pixelmap.rgb ) return errr('pixelmap is rgb', pixelmap);
		this.pixelmap = pixelmap;

		this.within_pixelmap = true;

		let rate = 20;

		let length = 0;
		let node = {};
		node.point = this.initial_point;
		node.radius = this.initial_radius;

		node.vel = this.vel;
		node.acc = this.acc;
		node.vel_r = this.vel_r;

		while ( length < this.max_length && node.radius > 0 && node.radius < this.max_radius && this.within_pixelmap ) {

			this.draw_circle( node.point, node.radius );
			if ( this.within_pixelmap ) this.nodes.push( JSON.parse(JSON.stringify(node)) );

			node.point[0] += Math.sin( node.vel ) * rate;
			node.point[1] += Math.cos( node.vel ) * rate;
			node.vel += node.acc * rate;
			node.acc += this.jrk * rate;
			//----node.vel = normalize( node.vel, 1 );

			node.radius += node.vel_r * rate;
			node.vel_r += this.acc_r * rate;

			//length += Math.sqrt( node.vel[0] * node.vel[0]  + node.vel[1] * node.vel[1] ) * rate;
			length += rate;
		}

		return this.pixelmap;

	}

	draw( pixelmap ) {

		if ( pixelmap == undefined ) return errr('pixelmap undefined');

		// RGB
		if ( pixelmap.rgb ) return errr('pixelmap is rgb', pixelmap);
		this.pixelmap = pixelmap;

		let length = 0;
		let current_point = this.initial_point;
		let current_radius = this.initial_radius;

		let current_vel = this.vel;
		let current_vel_r = this.vel_r;

		while ( length < this.max_length && current_radius > 0 && current_radius < this.max_radius ) {

			this.draw_circle( current_point, current_radius );

			current_point[0] += current_vel[0];
			current_point[1] += current_vel[1];
			current_vel[0] += this.acc[0];
			current_vel[1] += this.acc[1];
			current_vel = normalize( current_vel );
			console.log(current_vel);

			current_radius += current_vel_r;
			current_vel_r += this.acc_r;

			length += Math.sqrt( current_vel[0] * current_vel[0] + current_vel[1] * current_vel[1] ) ;
		}

		return this.pixelmap;

	}

	growLobus( node = this.nodes[ Math.floor(Math.random() * myArray.length) ], instructions = this.extensions.instructions, ) {

		let extension = new Lobus();
		extension.base = node;

		this.extensions.push( extension );
	}

	draw_circle( point, radius ) {

		for (var i_radius = 0; i_radius < radius; i_radius++) {

			let _x = i_radius - 1
	        let _y = 0
	        let dx = 1
	        let dy = 1
	        let err = dx - i_radius*2
	        
	        let radius_ratio = i_radius/length
	        
	        while ( _x > _y ) {
	            
	            this.draw_pixel( point[0] + _x, point[1] + _y )
	            this.draw_pixel( point[0] + _y, point[1] + _x )
	            this.draw_pixel( point[0] - _y, point[1] + _x )
	            this.draw_pixel( point[0] - _x, point[1] + _y )
	            this.draw_pixel( point[0] - _x, point[1] - _y )
	            this.draw_pixel( point[0] - _y, point[1] - _x )
	            this.draw_pixel( point[0] + _y, point[1] - _x )
	            this.draw_pixel( point[0] + _x, point[1] - _y )
	            
	            if ( err <= 0 ) {
	                _y += 1
	                err += dy
	                dy += 2
	            }
	            if ( err > 0 ) {
	                _x -= 1
	                dx += 2
	                err += dx - i_radius*2
	            }
	        }
			
		}
	}

	draw_pixel( x, y ) {
		if ( !this.pixelmap.set( x, y, 100) ) this.within_pixelmap = false;
	}

	
}


function point (_x, _y = _x) {
	return [_x, _y];
}

function normalize ( arr, n = 1 ) {
	let ratio = n / Math.max.apply(Math, arr)
	for (var i = 0; i < arr.length; i++) {
		arr[i] = arr[i] * ratio;
	}
	return arr;
}

function errr( message, obj ) {
	console.log( '%c ' + message + ' ', 'background: #6282d9; color: #0b0236' );
	if ( obj != undefined ) console.log( obj, 'background: #6282d9; color: #0b0236' );
	return false;
}