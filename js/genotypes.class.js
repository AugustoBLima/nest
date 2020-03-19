
console.log('imported creature.class.js');


class Genotype {

	_sequence = [];
	linked_creatures = [];

	set sequence(s) {
		this._sequence = s;
		this.propagate();
	}
	get sequence() {
		return this._sequence;
	}

	constructor() {

		this.load_json();

		//pixelmapToCanvas(this.pixelmap);

	}

	load_json( name = 'default' ) {

		let caller = this;

		$.ajax({
			parent: this,
		    url: 'genotypes/' + name + '.json',
		    success: function(result){
		        console.log( result );
		        caller.sequence = result;
		    },
		    error: function(result){
		        $.ajax({
				    url: 'genotypes/default.json',
				    success: function(result){
				        caller.sequence = result;
				    }
				});
		    }
		});
	}

	propagate() {
		this.linked_creatures
		for (var i = 0; i < this.linked_creatures.length; i++) {
			this.linked_creatures[i].init();
		}
	}

}