/**
 * Display a list of connected users.
 */
var UserDisplay = (function() {

	var current_users = Array();

	var renderUserDisplay = function() {
		$('#user_bar').html();
		var user_display = $('<ul></ul>');
		$.each(current_users, function(idx, val) {
			user_display.append('<li>' + val + '</li>');
		});
		$('#user_bar').append(user_display);
	};

	var addUser = function(user_id) {
		if(!(user_id in current_users)) {
			current_users.push(user_id);
			renderUserDisplay();
		}
	};

	/* Public interface */
	return {
		addUser: addUser
	};
})();
