/**
 * Display a list of connected users.
 */
var UserDisplay = (function() {

	var saveCurrentUser = function() {
		var cur_user = $('.current-user');
		var data = {
			'message_type': 'user_update',
			'username': cur_user.text(),
			'board_id': boardId
		};
		socket.send(JSON.stringify(data));
	};

	var renderUserDisplay = function(users_connected, current_user) {
		$('#user_list').html("");
		var user_display = $('<ul></ul>');
		$.each(users_connected, function(idx, val) {
			var cur_user = $('<li>' + val + '</li>');
			if(val == current_user) {
				cur_user.addClass('current-user');
				cur_user.attr("contenteditable", "true");
				cur_user.bind("blur", saveCurrentUser);
			}
			user_display.append(cur_user);
		});
		$('#user_list').append(user_display);
	};

	var render = function(data) {
		renderUserDisplay(data['users_connected'], data['current_user']);

	};

	/* Public interface */
	return {
		render: render
	};
})();
