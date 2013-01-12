import json
from collections import defaultdict
from tornado import websocket

from models import Board, Item

sockets = defaultdict(list)

socket_to_board_id = {}


class EchoWebSocket(websocket.WebSocketHandler):

  def open(self, board_id):
    sockets[board_id].append(self)
    socket_to_board_id[self] = board_id
    board = Board.get(board_id)
    self.write_message(json.dumps({'board': json.loads(board.to_json())}))
    print "WebSocket opened"

  def on_message(self, message):
    data = json.loads(message)
    board_id = data["board_id"]
    board = Board.get(board_id)
    item = Item(**data["item"])
    board.updateItem(item)
    board.save()
    
    #broadcastData = {"update_type": "pos_change", "item": json.loads(item.to_json())}
    for socket in sockets[board_id]:
        socket.write_message(item.to_json())

  def on_close(self):
    print "WebSocket closed"
    board_id = socket_to_board_id.get(self)
    sockets[board_id].remove(self)
