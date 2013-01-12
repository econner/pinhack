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

  def open(self, board_id):
    user_id = self._generate_user_id()

    sockets[board_id].append(self)
    socket_to_board_id[self] = board_id
    socket_to_user_id[self] = user_id
    users[board_id].append(user_id)

    print "WebSocket opened"
    board = Board.get(board_id)
    broadcastData = json.dumps({
        'board': json.loads(board.to_json())
    })
    if board:
        self.write_message(broadcastData)
        self.broad_cast(board_id, json.dumps({
            'users_connected': users[board_id]
        }))
    #self.write_message(json.dumps({'board': json.loads(board.to_json()), 'user_id': user_id}))
    #self.write_message(broadcastData)


  def on_message(self, message):
    data = json.loads(message)
    board_id = data["board_id"]
    board = Board.get(board_id)
    item = Item(**data["item"])
    board.updateItem(item)
    board.save()

    broadcastData = {
        "update_type": "pos_change",
        "item": json.loads(item.to_json())
    }
    self.broad_cast(board_id, broadcastData)
    #for socket in sockets[board_id]:
       #socket.write_message(broadcastData)

  def on_close(self):
    print "WebSocket closed"
    board_id = socket_to_board_id.get(self)
    user_id = socket_to_user_id.get(self)
    users[board_id].remove(user_id)
    sockets[board_id].remove(self)
    self.broad_cast(board_id, json.dumps({
        'users_connected': users[board_id]
    }))
    del socket_to_board_id[self]
    del socket_to_user_id[self]

  def broad_cast(self, board_id, message):
    print sockets[board_id]
    for socket in sockets[board_id]:
    	socket.write_message(message)
