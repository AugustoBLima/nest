// obejeto
// dependencies: canvas.js, utils.js, genotypes.js

console.log('imported creature.class.js');

var color1 = [ Math.round( Math.random() * 255 ), Math.round( Math.random() * 255 ), Math.round( Math.random() * 255 ) ];
var color2 = [ Math.round( Math.random() * 255 ), Math.round( Math.random() * 255 ), Math.round( Math.random() * 255 ) ];
window.colors = [];
for (var i = 0; i < 10; i++) {
    window.colors[i] = [];
	for (var i2 = 0; i2 < 3; i2++) {
		window.colors[i][i2] = Math.round( color1[i2] * i/10 + color2[i2] * (1-i/10) );
	}
	window.colors[i][3] = [i, window.c_lobus];
}

class Creature {

	seed = '';

	constructor( genotype = false ) {

		//pixelmapToCanvas(this.pixelmap);

		if ( !genotype ) {

			this.genotype = new Genotype;
			this.genotype.linked_creatures.push( this );

		} else {

			this.genotype = genotype;
			if ( genotype.sequence.length == 0 ) {
				genotype.linked_creatures.push( this );
			} else {
				this.init();
			}
		}

		for (var i = 0; i < 10; i++) {
			this.seed += Math.random().toString().replace('0.','');
			//this.seed += Math.random().toString(36).substring(2);
		}

		console.log('seed|' + this.seed);
		//this.seed = '28234655471201921873881310670309680965279194369428905102998471828746561074031525197226839335538975335209839988777303379412397996043517423417456098049388421243286906';
		//this.seed = '641677448368058327102138887967338549473564943759759664221560180829331008517121426659710899718568351280812951810573428360802967882578513981238569619322050146843532';
		//this.seed = '60068472800937945320983718342762308273002088884298006549301603423437690641986615350245831209187471628972467130947635179970000903141655482542061069489675862016274';

	}

	init(){

		this.pixelmap = newPixelmap( 501, 1001, true, false );

		this.backbone = new Backbone( this.pixelmap, {
			initial_point : this.initial_point,
			creature : this
		});
		this.backbone.attach(this);

		this.backbone.cast();
		this.backbone.grow_tentacles();
		this.backbone.grow_body();
		this.backbone.grow_details();

		this.backbone.draw();
	}

	allele( position, power = 1 ) {

		let gene = this.genotype.sequence[ position ];
		let allele = power == 1 ? this.seed[ position ] : attenuate( this.seed[ position ], power );
		//let allele = power == 1 ? parseInt(this.seed[ position ],36) : attenuate( parseInt(this.seed[ position ],36), power );

		return ( allele / (10 - 1) ) * ( gene[1] - gene[0] ) + gene[0];
		//return ( allele / (36 - 1) ) * ( gene[1] - gene[0] ) + gene[0];
	}
	
}

class Lobus {
	
	max_length = 1500;
	max_radius = 50;
	min_radius = 5;

	cast_rate = 2;
	offset = 0;
	rotation = 0;

	nodes = [];
	extensions = [];
	role = 'none';

	constructor( pixelmap, instructions = false ) {

		if ( instructions ) Object.assign( this, instructions );

		this.pixelmap = pixelmap || newPixelmap( 500, 1000, false, false );
		this.attach( instructions.creature );

	}

	attach( creature ) {
		this.creature = creature;
		this.allele = function( argument ){
			return Creature.prototype.allele.apply( this.creature, arguments);
		}
	}

	cast() {

		// RGB
		//if ( this.pixelmap.rgb ) return console.log('pixelmap is rgb');

		this.within_pixelmap = true;

		let rate = this.cast_rate;

		let length = 0;
		let node = {};

		node.radius = this.initial_radius;

		if ( this.base == undefined ) {
			node.point = JSON.parse(JSON.stringify(this.initial_point));
		} else {

			let point = [];
			point[0] = this.base.point[0] - this.offset * this.initial_radius * Math.cos(3.1415 * ( this.base.vel )) + this.offset * this.base.radius * Math.cos(3.1415 * this.base.vel) - (1 - Math.sin( 1.57 * (1+ this.rotation) )) * this.base.radius;
			point[1] = this.base.point[1] - this.offset * this.initial_radius * Math.cos(3.1415 * ( 0.5 + this.base.vel )) + this.offset * this.base.radius * Math.cos(3.1415 * ( this.base.vel + 0.5 )) - Math.sin(1.57 * (this.rotation) )* this.base.radius;
			node.point = point;

		}

		node.vel = this.vel + this.rotation * 0.5;
		node.acc = this.acc;
		node.vel_r = this.vel_r;

		while ( length < this.max_length && node.radius > 0 && node.radius < this.max_radius && node.radius > this.min_radius && this.within_pixelmap ) {

			this.cast_circle( node.point, node.radius );
			//this.draw_circle( node.point, node.radius );
			if ( this.within_pixelmap ) this.nodes.push( JSON.parse(JSON.stringify(node)) );

			node.point[0] += Math.sin( node.vel * 3.1415 ) * rate;
			node.point[1] += Math.cos( node.vel * 3.1415 ) * rate;
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

	draw() {

		for (var i = 0; i < this.extensions.length; i++) {
			this.extensions[i].draw();

			/*for (var i1 = 0; i1 < this.pixelmap.length; i1++) {
				for (var i2 = 0; i2 < this.pixelmap[i1].length; i2++) {
					let test = JSON.parse( JSON.stringify( this.pixelmap[i1][i2] ) );
					test[3] = -1;
					this.pixelmap[i1][i2] = test;
				}
			}*/
		}

		for (var i = 0; i < this.nodes.length; i++) {
			this.draw_circle( this.nodes[i].point, this.nodes[i].radius );
			//this.nodes[i]
		}

		pixelmapToCanvas( this.pixelmap );

	}

	grow_tentacles() {

		let last_index = -10;
		let node_distance = this.nodes.length;
		let pre_distance = Math.floor( this.nodes[0].radius * 1.57 / this.cast_rate );
		let post_distance = Math.floor( this.nodes[this.nodes.length-1].radius * 1.57 / this.cast_rate );

		let total_distance = pre_distance + node_distance + post_distance;

		for (var index = 0; index < total_distance; index++) {
			
			let chance = 1;
			//chance *= this.allele(7);

			let minimum_interval = (index - last_index) * this.cast_rate / this.allele(8);
			if ( minimum_interval < 0 ) minimum_interval = 0
			chance *= 1 - 0.5 ** minimum_interval;

			let distance_from_start = Math.cos( this.allele(9) * 3.1415 );
			if ( distance_from_start > 0 ) {
				chance *= Math.sin( this.allele(9) ) + distance_from_start * (index / total_distance);
			} else {
				chance *= Math.sin( this.allele(9) ) - distance_from_start * (index / total_distance);
			}
			
			if ( chance > 0.5 ) {

				// what node is

				let node_index = index - pre_distance;
				let rotation = 0;
				if ( index < pre_distance ) {

					node_index = 0;
					rotation = 1 - index / pre_distance;
					//console.log('1rotation:' +rotation+ '|node:' + node_index);

				} else if ( index >= pre_distance + node_distance ){

					node_index = node_distance -1;
					rotation = 0 - (index - pre_distance - node_distance) / post_distance;

					//console.log('3rotation:' +rotation+ '|node:' + node_index);

				} else {
					//console.log('2rotation:0|node:' + node_index);
				}

				//let acc = 0.0035 * ( 0.5 - Math.random() );
				let vel = 2 * this.allele(14) + this.allele(1,1);
				let acc = 2 * this.allele(15) - 0.001 * this.allele(1,3);

				let instructions = {
					role : 'tentacle',
					offset : 1,
					rotation : rotation,

					vel : vel,
					acc : acc,
					jrk : acc * -0.005,

					initial_radius : this.allele(10),
					vel_r : 2 * this.allele(11),
					acc_r : 2 * this.allele(12),
				}
				//console.log('growing');
				this.grow_lobus( this.nodes[node_index], instructions );

				last_index = index;

			}
		}

	}

	grow_body() {
		
	}

	grow_details(){

		let last_index = -10;
		let node_distance = this.nodes.length;
		if ( node_distance == 0 ) return;

		let pre_distance = Math.floor( this.nodes[0].radius * 1.57 / this.cast_rate );
		let post_distance = Math.floor( this.nodes[this.nodes.length-1].radius * 1.57 / this.cast_rate );

		let total_distance = pre_distance + node_distance + post_distance;

		for (var index = 0; index < total_distance; index++) {
			
			let chance = 1;
			chance *= this.allele(21);

			let minimum_interval = (index - last_index) * this.cast_rate / this.allele(22);
			if ( minimum_interval < 0 ) minimum_interval = 0
			chance *= 1 - 0.5 ** minimum_interval;

			let distance_from_start = Math.cos( this.allele(23) * 3.1415 );
			if ( distance_from_start > 0 ) {
				chance *= Math.sin( this.allele(23) ) + distance_from_start * (index / total_distance);
			} else {
				chance *= Math.sin( this.allele(23) ) - distance_from_start * (index / total_distance);
			}
			
			if ( chance > 0.5 ) {

				// what node is

				let node_index = index - pre_distance;
				let rotation = 0;
				let is_not_end = 1;
				if ( index < pre_distance ) {

					node_index = 0;
					is_not_end = 0;
					rotation = 1 - index / pre_distance;
					//console.log('1rotation:' +rotation+ '|node:' + node_index);

				} else if ( index >= pre_distance + node_distance ){

					node_index = node_distance -1;
					is_not_end = 0;
					rotation = 0 - (index - pre_distance - node_distance) / post_distance;

					//console.log('3rotation:' +rotation+ '|node:' + node_index);

				} else {
					//console.log('2rotation:0|node:' + node_index);
				}

				//let acc = 0.0035 * ( 0.5 - Math.random() );
				let acc = 0.002 - 0.002 * this.allele(1,3);

				let instructions = {
					role : 'detail',
					offset : 1,
					rotation : rotation,

					max_length : this.allele(27),
					max_radius : 15,
					min_radius : 3,

					vel : this.allele(28) * ( 0.5 + this.nodes[node_index].vel + is_not_end * this.nodes[node_index].vel_r / 3.1415 ),
					//vel : 0.5,
					acc : acc,
					jrk : acc * -0.002,

					initial_radius : this.allele(24),
					vel_r : this.allele(25),
					acc_r : this.allele(26),
				}

				this.grow_lobus( this.nodes[node_index], instructions );

				last_index = index;

			}
		}

	}

	grow_eyes() {
		
	}

	grow_lobus( node = this.nodes[ Math.floor(0.5 * this.nodes.length) ], instructions = false ) {


		if ( instructions ) {
			instructions.initial_point = node.point;
		} else {
			instructions = node;
		}

		instructions.creature = this.creature;

		let extension = new Lobus( this.pixelmap, instructions );
		extension.base = node;

		extension.cast();
		if( extension.role != 'detail' ) extension.grow_details();

		this.extensions.push( extension );
	}

	cast_circle( point, radius ) {

		let valid = true;
		valid = valid && this.cast_pixel( point[0] + radius, point[1] + radius );
		valid = valid && this.cast_pixel( point[0] + radius, point[1] - radius );
		valid = valid && this.cast_pixel( point[0] - radius, point[1] - radius );
		valid = valid && this.cast_pixel( point[0] - radius, point[1] + radius );

		this.within_pixelmap = valid;
	}

	draw_circle( point, radius ) {

		for (var i_radius = 0; i_radius < radius; i_radius++) {

			let _x = i_radius - 1;
	        let _y = 0;
	        let dx = 1;
	        let dy = 1;
	        let err = dx - i_radius*2;
	        
	        let radius_ratio = i_radius/length;

	        let i_color = Math.round( ( radius - i_radius ) /2 );
	        i_color = i_color > 9 ? 9 : i_color;
	        
	        while ( _x >= _y ) {

	        	//console.log( '_x=' + _x + '|_y=' + _y );
	            
	            this.draw_pixel( point[0] + _x, point[1] + _y, window.colors[i_color] )
	            this.draw_pixel( point[0] + _y, point[1] + _x, window.colors[i_color] )
	            this.draw_pixel( point[0] - _y, point[1] + _x, window.colors[i_color] )
	            this.draw_pixel( point[0] - _x, point[1] + _y, window.colors[i_color] )
	            this.draw_pixel( point[0] - _x, point[1] - _y, window.colors[i_color] )
	            this.draw_pixel( point[0] - _y, point[1] - _x, window.colors[i_color] )
	            this.draw_pixel( point[0] + _y, point[1] - _x, window.colors[i_color] )
	            this.draw_pixel( point[0] + _x, point[1] - _y, window.colors[i_color] )
	            
	            if ( err <= 0 ) {
	                _y += 1;
	                err += dy;
	                dy += 2;
	            }
	            if ( err > 0 ) {
	                _x -= 1;
	                dx += 2;
	                err += dx - i_radius*2;
	            }
	        }
			
		}
	}

	cast_pixel( x, y ) {
		if ( x < 0 && this.role != 'body' ) return false;
		return ( /* x > 0 mirror */ true && y > 0 && x+1 < this.pixelmap.width && y+1 < this.pixelmap.height );
	}

	draw_pixel( x, y, color ) {
		//console.log('x:' + x + '|y:' + y );
		if ( x < 0 ) return;

		x = Math.round(x);
		y = Math.round(y);

		if ( this.pixelmap[x][y][3] > color[3] ) return;
		if ( !this.pixelmap.set( x, y, color) ) this.within_pixelmap = false;
	}

	
}

class Backbone extends Lobus {

	max_length = 500;
	max_radius = 150;
	min_radius = 5;

	role = 'body';

	constructor( pixelmap, instructions = false ) {
		super(pixelmap, instructions);

		this.initial_point = point( this.allele(2), this.allele(1,2) * pixelmap.height + this.allele(3) );
		this.vel = instructions.vel || 0;
		this.acc = instructions.acc || 0;
		this.jrk = instructions.jrk || 0;
		this.initial_radius = this.allele(3);
		this.vel_r = this.allele(4);
		this.acc_r = this.allele(5);
	}

}

window.countester = 0;