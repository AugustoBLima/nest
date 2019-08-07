console.log('imported ga.js');

function newPixelmap( width = 400, height = width, rgb = true, random = false ) {

	var pixelmap = [];
	for (var w = 0; w < width; w++) {
		pixelmap[w] = [];
		for (var h = 0; h < height; h++) {
			let n = random ? Math.random() * 255 : 220;
			pixelmap[w][h] = rgb ? [n, n, n] : n;
		}
	}
	pixelmap.rgb = rgb;
	pixelmap.width = width;
	pixelmap.height = height;

	pixelmap.set = function(x, y, value) {
		if ( x < 0 || y < 0 || x+1 >= this.width || y+1 >= this.height ) {
			//console.log(x, y);
			return errr('pixelmap boundary exceeded');
		}
		this[ Math.round(x) ][ Math.round(y) ] = Math.round( value );
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