console.log('imported canvas.js');

function pixelmapToCanvas(pixelmap, canvas = document.querySelector("canvas")) {

    //console.log(pixelmap);

    // mirror
    let mirrored = [];
    let width = pixelmap.length;
    let height = pixelmap[0].length;
    width2 = width * 2 - 1;
    height2 = height;

    for (var x = 0; x < height2; x++) {

        mirrored[x] = [];
        for (var y = 0; y < width2; y++) {

            if ( x < width ) {
                mirrored[x][y] = pixelmap[ width - x - 1 ][y];
            } else {
                mirrored[x][y] = pixelmap[ x - width + 1][y];
            }
        }
    }

    pixelmap = mirrored;

    canvas = canvas.getContext("2d");

    let h = canvas.canvas.height = height2;
    let w = canvas.canvas.width = width2;

    let imgData = canvas.getImageData(0, 0, w, h);
    let data = imgData.data;  // the array of RGBA values







    for(var x = 0; x < height2; x++) {
        for(var y = 0; y < width2; y++) {
            var s = 4 * x * w + 4 * y;  // calculate the index in the array
            //console.log(y);
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