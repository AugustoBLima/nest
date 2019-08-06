console.log('imported canvas.js');

function pixelmapToCanvas(pixelmap, canvas = document.querySelector("canvas")) {

    canvas = canvas.getContext("2d");

    let height = pixelmap.length;
    let width = pixelmap[0].length;

    let h = canvas.canvas.height = height;
    let w = canvas.canvas.width = width;

    let imgData = canvas.getImageData(0, 0, w, h);
    let data = imgData.data;  // the array of RGBA values

    for(var i = 0; i < height; i++) {
        for(var j = 0; j < width; j++) {
            var s = 4 * i * w + 4 * j;  // calculate the index in the array
            var x = pixelmap[i][j];  // the RGB values
            if ( !Array.isArray(x) ) x = [x,x,x];
            data[s] = x[0];
            data[s + 1] = x[1];
            data[s + 2] = x[2];
            data[s + 3] = 255;  // fully opaque
        }
    }

    canvas.putImageData(imgData, 0, 0);

}