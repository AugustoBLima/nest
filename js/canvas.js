console.log('imported canvas.js');

function pixelmapToCanvas(pixelmap, canvas = document.querySelector("canvas")) {

    canvas = canvas.getContext("2d");

    let width = pixelmap.length;
    let height = pixelmap[0].length;

    let h = canvas.canvas.height = height;
    let w = canvas.canvas.width = width;

    let imgData = canvas.getImageData(0, 0, w, h);
    let data = imgData.data;  // the array of RGBA values

    for(var x = 0; x < height; x++) {
        for(var y = 0; y < width; y++) {
            var s = 4 * x * w + 4 * y;  // calculate the index in the array
            var pixel = pixelmap[y][x];  // the RGB values
            if ( !Array.isArray(pixel) ) pixel = [pixel,pixel,pixel];
            data[s] = pixel[0];
            data[s + 1] = pixel[1];
            data[s + 2] = pixel[2];
            data[s + 3] = 255;  // fully opaque
        }
    }

    canvas.putImageData(imgData, 0, 0);

}