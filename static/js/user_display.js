/**
 * Display a list of connected users.
 */
var UserDisplay = (function() {

	var renderUserDisplay = function(users_connected) {
		$('#user_bar').html("");
		var user_display = $('<ul></ul>');
		$.each(users_connected, function(idx, val) {
			user_display.append('<li>' + val + '</li>');
		});
		$('#user_bar').append(user_display);
	};

	var render = function(users_connected) {
		console.info(users_connected);
		renderUserDisplay(users_connected);
	};

	/* Public interface */
	return {
		render: render
	};
})();