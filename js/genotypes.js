
console.log('imported creature.class.js');


class Genotypes {

	constructor() {

		this.pixelmap = newPixelmap( 501, 1001, false, false );


		this.backbone = new Backbone( this.pixelmap, {
			initial_point : this.initial_point
		});

		this.backbone.cast();
		this.backbone.draw();

		//pixelmapToCanvas(this.pixelmap);

	}

}