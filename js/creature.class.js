// obejeto
// dependencies: canvas.js, ga.js

console.log('imported creature.class.js');


class Creature {

	initial_point = point(50,50);

	constructor() {

		this.lobus = new Lobus({
			initial_point : this.initial_point
		});
	}

	get property() {
		return this._property;
	}
	set property(p) {
		this._property = p;
	}


	
}


class Lobus {
	
	max_length = 450;
	max_radius = 50;

	constructor( instructions = false ) {

		this.pixelmap = newPixelmap( 250, 500, false, false );

		this.initial_point = instructions.initial_point || point(2,20);
		this.vel = instructions.vel || 0;
		this.acc = instructions.acc || 0.002;
		this.jrk = instructions.jrk || 0;
		this.initial_radius = instructions.initial_radius || 4;
		this.vel_r = instructions.vel_r || 0.0;
		this.acc_r = instructions.acc_r || 0.0;
		this.nodes = instructions.nodes || [];
		this.extensions = instructions.extensions || [];

	}

	cast() {

		// RGB
		if ( this.pixelmap.rgb ) return errr('pixelmap is rgb', pixelmap);

		this.within_pixelmap = true;

		let rate = 2;

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

			//node.vel_r += (node.point[0] % 100)/100000 - (node.point[1] % 100)/100000;
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

		this.within_pixelmap = true;

		let rate = 2;

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

			node.vel_r += (node.point[0] % 100)/10000 - (node.point[1] % 100)/10000;
			//----node.vel = normalize( node.vel, 1 );

			node.radius += node.vel_r * rate;
			node.vel_r += this.acc_r * rate;

			//length += Math.sqrt( node.vel[0] * node.vel[0]  + node.vel[1] * node.vel[1] ) * rate;
			length += rate;
		}

		return this.pixelmap;

	}

	growLobus( node = this.nodes[ Math.floor(Math.random() * this.nodes.length) ], sett = false ) {

		let extension = new Lobus( node );
		extension.base = node;

		extension.acc = extension.acc * -1;
		extension.initial_point = node.point;
		extension.initial_radius = node.radius;

		this.extensions.push( extension );
	}

	cast_circle( point, radius ) {

		let valid = true;
		valid = valid && cast_pixel( point[0] + radius, point[1] + radius );
		valid = valid && cast_pixel( point[0] + radius, point[1] - radius );
		valid = valid && cast_pixel( point[0] - radius, point[1] - radius );
		valid = valid && cast_pixel( point[0] - radius, point[1] + radius );
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

	cast_pixel( x, y ) {
		return ( /* x > 0 mirror */ true && y > 0 && x+1 < this.pixelmap.width && y+1 < this.pixelmap.height );
	}

	draw_pixel( x, y ) {
		//console.log('x:' + x + '|y:' + y );
		if ( !this.pixelmap.set( x, y, Math.random() * 100) ) this.within_pixelmap = false;
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