function sub(id){
	var currVal = parseInt($("#opt" + id).val());
	if(currVal > 0){
		$("#opt" + id).val(currVal - 1);
	}
	var opts = $(".price_option > .price");
	var sum = 0;
	for(i = 0; i < opts.length; i++){
		var num = parseInt($("#opt" + i).val());
		var priceText = opts[i].textContent;
		var price = parseFloat(priceText.substring(0, priceText.length - 1));
		sum = sum + (num*price); 
	}
	$("#curr_price").html(sum + "&euro;");
}

function add(id){
	var currVal = parseInt($("#opt" +id).val());
	$("#opt" + id).val(currVal + 1);
	var opts = $(".price_option > .price");
	var sum = 0;
	for(i = 0; i < opts.length; i++){
		var num = parseInt($("#opt" + i).val());
		var priceText = opts[i].textContent;
		var price = parseFloat(priceText.substring(0, priceText.length - 1));
		sum = sum + (num*price); 
	}
	$("#curr_price").html(sum + "&euro;");
}

function changeHours(){
	var newHours = '<option disabled selected>-- select hour --</option>';
	var lang = $('#lang').val();
	for(i = 0; i < hours[lang].length; i++){
	        newHours = newHours + '<option>' + hours[lang][i] + '</option>';
	}
	$('#hours').html(newHours);
}

function book(id){
	var valid = true;
	if($("#first_name").val().length == 0){
		$("#first_name").addClass("invalid");
		valid = false;
	}
	if($("#last_name").val().length == 0){
		$("#last_name").addClass("invalid");
		valid = false;
	}
	if($("#email").val().length == 0){
		$("#email").addClass("invalid");
		valid = false;
	}
	if($("#phone").val().length == 0){
		$("#phone").addClass("invalid");
		valid = false;
	}
	if($("#date").val().length == 0){
		$("#date").addClass("invalid");
		valid = false;
	}
	if(Object.getOwnPropertyNames(hours).length != 0 && $("#hours").val() == null){
		valid = false;
	}
	if(valid){
		var opts = $(".price_option");
		var quantNum = 0;
		var quantStr = '';
		for(i = 0; i < opts.length; i++){
			var num = parseInt($("#opt" + i).val());
			quantNum = quantNum + num;
			quantStr = quantStr + num;
			if(i < opts.length - 1){
				quantStr = quantStr + ';';
			}
		}
		if(quantNum > 0){
			var firstName = $("#first_name").val();
			var lastName = $("#last_name").val();
			var email = $("#email").val();
			var phone = $("#phone").val();
			var date = $("#date").val();
			$.post("/book", {id: id, firstName: firstName, lastName: lastName, email: email, phone, phone, date: date, qt: quantStr, info: ''}).done(function(){
					alert("Success!");
					console.log("success");
			});
		}
		else{
			$('.change_price > input').addClass('invalid');
		}
	}
	else{
		$("#form_message").css('display','block');
	}
}
