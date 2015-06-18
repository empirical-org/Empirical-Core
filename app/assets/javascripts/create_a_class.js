$(document).ready(function () {
	$('.generate-code').click(function(){
		$.ajax({
			url: '/teachers/classrooms/regenerate_code',
			success: function(data, status, jqXHR) {
				$('.class-code').val(data.code);
			}
		});
	});
});
