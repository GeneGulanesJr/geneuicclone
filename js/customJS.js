$(document).ready(function(){

	$('.button-collapse').sideNav({
		menuWidth: 300, // Default is 300
		edge: 'left', // Choose the horizontal origin
		closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
		draggable: true, // Choose whether you can drag to open on touch screens
		onOpen: function(el){ /* Do stuff*/ },
		onClose: function(el){ /* Do stuff*/ }
	});

	$('select').material_select();
	// $('select').select2();

	$('.tooltipped').tooltip({delay: 50});

	$('.modal').modal();

	$('.datepicker').pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 150, // Creates a dropdown of 15 years to control year,
    today: 'Today',
    clear: 'Clear',
    close: 'Ok',
    closeOnSelect: false // Close upon selecting a date,
  	});

	// $(function(){
	$('.stepper').activateStepper();
	// });

	$('.chips').material_chip();

});

function submit_grades(){
	var tbl = document.getElementById('tbl_grades');
	var inputs = tbl.getElementsByTagName('input');
	var valid = true;
	for(var index = 0; index < inputs.length; index++){
		if(inputs[index].getAttribute("type") == 'text'){
			var grade = inputs[index].value;
			if(grade != ""){
				inputs[index].value = (!isNaN(grade)) ? parseFloat(grade) : grade.toUpperCase().trim();

				if(!isValidGrade(inputs[index].value) ){
					inputs[index].focus();
					valid = false;
					break;
				}
				
			}
		}
	}

	if(valid) document.getElementById('form').submit();
};

function isValidGrade(grade){
	if(isNaN(grade) && (grade.toUpperCase() != 'DRP' && grade.toUpperCase() != 'NA' && grade.toUpperCase() != 'OD' && grade.toUpperCase() != 'INP' && grade.toUpperCase() != 'INC')){
		alert("Please enter a valid number.");
		return false;
	}
	else if(grade > 100){
		alert("Grade must not be greater than 100.");
		return false;
	}
	else if(grade < 40 && grade > 2.1){
		alert("Please enter a valid grade.");
		return false;
	}
	
	return true;
};






