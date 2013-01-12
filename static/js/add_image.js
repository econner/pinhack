$(function() {
     $('#add-image-container').load('/static/imagePicker.html');
});

function formSubmit()
{
	url = document.getElementById("url").value;
	link = '/image/?url=' + url;
	$("#images").html("");
	$.getJSON(link, function(data) {
		$.each(data, function(i,item){
			$("<img/>").attr("src", item).attr('class', 'selectable-image').appendTo("#images");
		});
		$(".selectable-image").click(function(event) {
			$(".selected-image").removeClass('selected-image');
			$(this).addClass('selected-image');
		});
		$('#select-button').show();
		$("#select-button").unbind('click');
		$("#select-button").click(function() {
			var image_url = $('.selected-image').attr('src');
			$.ajax({
		  		url: "/add_item/",
		  		type: 'PUT',
		  		data: {board_id: boardId, url: url,
		  				image_url: image_url, tags: [''], pos_x: 100, pos_y: 200,
		  				scale: 1, locked: true
		  		}}).done(function() {
		  			$("#add-image-modal").trigger('reveal:close');
		  		});
		});
	});
}
