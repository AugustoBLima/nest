console.log('starting main.js');






var bixo = new Lobus();

pixelmapToCanvas( bixo.cast() );

pixelmapToCanvas(bixo.pixelmap);

bixo.pixelmap = bixo.pixelmap.mirror()

pixelmapToCanvas(bixo.pixelmap);








