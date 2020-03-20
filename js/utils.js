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

// 18 rows
var palette = [["#5d0912","#6f0b15","#820d19","#950f1c","#a71120","#ba1223","#cc1427","#df162a","#e92034","#eb3345","#ed4556","#ee5867","#f06a78","#f27d89","#f4909a","#f6a2ab","#f8b5bb","#f9c7cc","#fbdadd"],["#5d1209","#6f150b","#82190d","#951c0f","#a72011","#ba2312","#cc2714","#df2a16","#e93420","#eb4533","#ed5645","#ee6758","#f0786a","#f2897d","#f49a90","#f6aba2","#f8bbb5","#f9ccc7","#fbddda"],["#5d1f09","#6f260b","#822c0d","#95320f","#a73911","#ba3f12","#cc4514","#df4c16","#e95620","#eb6433","#ed7245","#ee8058","#f08e6a","#f29c7d","#f4aa90","#f6b8a2","#f8c7b5","#f9d5c7","#fbe3da"],["#5d3609","#6f410b","#824b0d","#95560f","#a76111","#ba6c12","#cc7614","#df8116","#e98b20","#eb9533","#ed9f45","#eea858","#f0b26a","#f2bc7d","#f4c590","#f6cfa2","#f8d8b5","#f9e2c7","#fbecda"],["#5d4109","#6f4e0b","#825b0d","#95680f","#a77511","#ba8212","#cc8f14","#df9c16","#e9a620","#ebad33","#edb545","#eebc58","#f0c46a","#f2cb7d","#f4d390","#f6daa2","#f8e1b5","#f9e9c7","#fbf0da"],["#5d4c09","#6f5b0b","#826b0d","#957a0f","#a78911","#ba9812","#cca714","#dfb716","#e9c120","#ebc633","#edcb45","#eed058","#f0d66a","#f2db7d","#f4e090","#f6e5a2","#f8eab5","#f9efc7","#fbf5da"],["#475d09","#556f0b","#63820d","#71950f","#7fa711","#8dba12","#9bcc14","#a9df16","#b3e920","#baeb33","#c0ed45","#c6ee58","#cdf06a","#d3f27d","#d9f490","#e0f6a2","#e6f8b5","#ecf9c7","#f2fbda"],["#2d5d09","#376f0b","#40820d","#49950f","#52a711","#5bba12","#64cc14","#6ddf16","#77e920","#83eb33","#8eed45","#99ee58","#a4f06a","#b0f27d","#bbf490","#c6f6a2","#d2f8b5","#ddf9c7","#e8fbda"],["#095d22","#0b6f29","#0d8230","#0f9537","#11a73e","#12ba45","#14cc4b","#16df52","#20e95c","#33eb6a","#45ed78","#58ee85","#6af093","#7df2a0","#90f4ae","#a2f6bb","#b5f8c9","#c7f9d6","#dafbe4"],["#095d57","#0b6f69","#0d827a","#0f958c","#11a79d","#12baae","#14ccc0","#16dfd1","#20e9dc","#33ebdf","#45ede1","#58eee4","#6af0e7","#7df2ea","#90f4ed","#a2f6f0","#b5f8f3","#c7f9f6","#dafbf9"],["#09565d","#0b676f","#0d7882","#0f8995","#119ba7","#12acba","#14bdcc","#16cedf","#20d8e9","#33dbeb","#45dfed","#58e2ee","#6ae5f0","#7de8f2","#90ecf4","#a2eff6","#b5f2f8","#c7f5f9","#daf9fb"],["#09495d","#0b586f","#0d6782","#0f7595","#1184a7","#1293ba","#14a1cc","#16b0df","#20bae9","#33c0eb","#45c6ed","#58cbee","#6ad1f0","#7dd7f2","#90ddf4","#a2e2f6","#b5e8f8","#c7eef9","#daf4fb"],["#09285d","#0b306f","#0d3882","#0f4095","#1148a7","#1250ba","#1458cc","#1660df","#206ae9","#3376eb","#4583ed","#588fee","#6a9cf0","#7da8f2","#90b4f4","#a2c1f6","#b5cdf8","#c7daf9","#dae6fb"],["#091a5d","#0b1f6f","#0d2482","#0f2995","#112fa7","#1234ba","#1439cc","#163edf","#2048e9","#3358eb","#4567ed","#5876ee","#6a85f0","#7d94f2","#90a4f4","#a2b3f6","#b5c2f8","#c7d1f9","#dae1fb"],["#090c5d","#0b0e6f","#0d1182","#0f1395","#1116a7","#1218ba","#141acc","#161ddf","#2027e9","#3339eb","#454bed","#585dee","#6a6ff0","#7d81f2","#9093f4","#a2a5f6","#b5b7f8","#c7c9f9","#dadbfb"],["#2b095d","#330b6f","#3c0d82","#440f95","#4d11a7","#5512ba","#5e14cc","#6616df","#7120e9","#7c33eb","#8845ed","#9458ee","#a06af0","#ac7df2","#b890f4","#c4a2f6","#d0b5f8","#dbc7f9","#e7dafb"],["#41095d","#4e0b6f","#5b0d82","#680f95","#7511a7","#8212ba","#8f14cc","#9c16df","#a620e9","#ad33eb","#b545ed","#bc58ee","#c46af0","#cb7df2","#d390f4","#daa2f6","#e1b5f8","#e9c7f9","#f0dafb"],["#57095d","#690b6f","#7a0d82","#8c0f95","#9d11a7","#ae12ba","#c014cc","#d116df","#dc20e9","#df33eb","#e145ed","#e458ee","#e76af0","#ea7df2","#ed90f4","#f0a2f6","#f3b5f8","#f6c7f9","#f9dafb"]];