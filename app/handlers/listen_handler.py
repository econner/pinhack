import json
import string
import random
from collections import defaultdict
from tornado import websocket

from models import Board, Item

sockets = defaultdict(list)
users = defaultdict(list)

socket_to_board_id = {}
socket_to_user_id = {}


class EchoWebSocket(websocket.WebSocketHandler):

    def _generate_user_id(self):
        while True:
            str_chars = string.lowercase + string.uppercase
            user_id = ''.join([random.choice(str_chars) for _ in xrange(8)])
            if user_id not in socket_to_user_id.values():
                return user_id

    def _broadcast_user_display(self, board_id):
        for socket in sockets[board_id]:
            socket.write_message(json.dumps({
                'users_connected': users[board_id],
                'current_user': socket_to_user_id[socket]
            }))

    def _update_user(self, board_id, new_user_id):
        old_user_id = socket_to_user_id.get(self)
        idx = users[board_id].index(old_user_id)
        users[board_id].remove(old_user_id)
        users[board_id].insert(idx, new_user_id)
        socket_to_user_id[self] = new_user_id

    def _update_board_name(self, board_id, name):
        board = Board.get(board_id)
        board.name = name[:16]
        board.save()
        return board.name

    def _broadcast_board_name_update(self, board_id, name):
        self.broadcast(
            board_id, {
                'update_type': 'board_name_update',
                'name': name,
            }, write_to_self=False)

    def open(self, board_id):
        user_id = self._generate_user_id()

        sockets[board_id].append(self)
        socket_to_board_id[self] = board_id
        socket_to_user_id[self] = user_id
        users[board_id].append(user_id)

        board = Board.get(board_id)
        if board:
            broadcastData = json.dumps({
                'board': json.loads(board.to_json())
            })
            self.write_message(broadcastData)
            self._broadcast_user_display(board_id)

    def on_message(self, message):
        data = json.loads(message)
        if data["update_type"] == "draw":
          board_id = data["board_id"]
          broadcastData = data
          self.broadcast(board_id, broadcastData, write_to_self=False)
          return
        message_type = data.get('message_type')
        board_id = data["board_id"]

        if message_type and message_type == 'user_update':
            self._update_user(board_id, data['username'])
            self._broadcast_user_display(board_id)
        elif message_type and message_type == 'board_name_update':
            name = self._update_board_name(board_id, data['name'])
            self._broadcast_board_name_update(board_id, name)
        else:
            board = Board.get(board_id)
            item = Item(**data["item"])
            board.updateItem(item)
            board.save()

            broadcastData = {
                "update_type": "pos_change",
                "item": json.loads(item.to_json())
            }
            self.broadcast(board_id, broadcastData, write_to_self=False)

    def on_close(self):
        board_id = socket_to_board_id.get(self)
        user_id = socket_to_user_id.get(self)
        users[board_id].remove(user_id)
        sockets[board_id].remove(self)
        self._broadcast_user_display(board_id)
        del socket_to_board_id[self]
        del socket_to_user_id[self]

    def broadcast(self, board_id, message, write_to_self=True):
        for socket in sockets[board_id]:
            if socket is not self or write_to_self:
                socket.write_message(message)
