var lock = true;
var inDirection;
var outDirection;

function slideShow(elems, buttons, ind=0){
	this.elems = elems;
	this.buttons = buttons;
	this.ind = ind;
	this.indActive = 0;

	this.showSlide = function(n){
		if(lock && this.indActive != n){
			lock = false;

			this.animateIt(this.elems, this.indActive, n, 250);
			$(buttons[this.indActive]).html("radio_button_unchecked");
			$(buttons[n]).html("radio_button_checked");
			this.indActive = n;
		}
	};

	this.animateIt = function(arr, ind, n, speed){
		if(ind < n){
			inDirection = "right";
			outDirection = "left";
		}
		else{
			outDirection = "right";
			inDirection = "left";
		}

		$(arr[ind]).hide("slide",{direction: outDirection, easing: "easeOutQuad"},speed,function(){
			$(arr[n]).show("slide",{direction: inDirection, easing: "easeInQuad"},speed,function(){
				lock = true;})
		});
	};

	this.nextSlide = function(){
		if(this.indActive+1 >= this.elems.length){
			return;
		}

		this.showSlide(this.indActive+1);
	};

	this.previousSlide = function(){
		if(this.indActive == 0){
			return;
		}

		this.showSlide(this.indActive-1);
	};
}
