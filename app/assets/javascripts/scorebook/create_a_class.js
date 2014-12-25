

$(document).ready(function () {
	$('.generate-code').click(function(){
		console.log('clicked on generate-code');
		$.ajax({
			url: '/teachers/classrooms/regenerate_code',
			success: function(data, status, jqXHR) {
				console.log('success regenerating code!');
				console.log(data);
				$('.class-code').val(data.code);
			},
			error: function () {
				console.log('error regenerating code');
			}
		});
	  
	});

});

