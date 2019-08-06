console.log('imported ga.js');

function newPixelmap( width = 400, height = width, rgb = true, random = false ) {

	console.log( 'width:' + width + '|height:' + height + '|rgb:' + rgb + '|random:' + random )

	var pixelmap = [];
	for (var h = 0; h < height; h++) {
		pixelmap[h] = [];
		for (var w = 0; w < width; w++) {
			let n = random ? Math.random() * 255 : 250;
			pixelmap[h][w] = rgb ? [n, n, n] : n;
		}
	}
	pixelmap.rgb = rgb;
	pixelmap.width = width;
	pixelmap.height = height;

	pixelmap.set = function(x, y, value) {
		if ( x < 0 || y < 0 || x+1 >= this.width || y+1 >= this.height ) return false; //errr('pixelmap boundary exceeded');
		this[ Math.round(x) ][ Math.round(y) ] = Math.round( value );
		return true;
	}

	return pixelmap;
}