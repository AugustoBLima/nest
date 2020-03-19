console.log('imported utils.js');

function newPixelmap( width = 400, height = width, rgb = true, random = true ) {

	var pixelmap = [];
	for (var w = 0; w < width; w++) {
		pixelmap[w] = [];
		for (var h = 0; h < height; h++) {
			let n = 236;
			if ( random ) {
				n = Math.random() * 255;
			}	else if( w % 10 == 0 || h % 10 == 0 ) {
				n = 220;
			}
			pixelmap[w][h] = rgb ? [n, n, n, 0] : n;
		}
	}
	pixelmap.rgb = rgb;
	pixelmap.width = width;
	pixelmap.height = height;

	pixelmap.set = function(x, y, value) {
		if ( y < 0 || x+1 >= this.width || y+1 >= this.height ) {
			//console.log(x, y);
			return; //console.log('pixelmap boundary exceeded');
		}
		//this[ Math.round(x) ][ Math.round(y) ] = value;
		this[ x ][ y ] = value;
		return true;
	}

	pixelmap.mirror = function(){

		let mirrored = [];

		for (var x = 0; x < this.width; x++) mirrored[x] = this[ this.width - x - 1 ];

		mirrored = mirrored.concat( this );

		return mirrored;
	}

	return pixelmap;
}



function point (_x, _y = _x) {
	return [ Math.round(_x), Math.round(_y) ];
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

function attenuate( value, power = 2, numeric = 10 ) {
	return ( value ** power ) / ( (numeric - 1) ** (power - 1) );
}