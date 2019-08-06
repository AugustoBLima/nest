console.log('starting main.js');






var pixelmap = newPixelmap( 500, 500, false, false );

pixelmapToCanvas(pixelmap);


var bixo = new Lobus();

pixelmapToCanvas( bixo.cast( pixelmap ) );



