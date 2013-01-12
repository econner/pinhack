import json
from collections import defaultdict
from tornado import websocket

from models import Board

sockets = defaultdict(list)

socket_to_board_id = {}


class EchoWebSocket(websocket.WebSocketHandler):

  def open(self, board_id):
    sockets[board_id].append(self)
    socket_to_board_id[self] = board_id
    print "WebSocket opened"
    board = Board.get(board_id)
    if board:
        self.write_message(json.dumps({'board': json.loads(board.to_json())}))

  def on_message(self, message):
    # TODO: deserialize the message, get the board id, and process msg
    #       accordingly
    board_id = message
    for socket in sockets[board_id]:
        socket.write_message("This is a TEST: %s" % message)

  def on_close(self):
    print "WebSocket closed"
    board_id = socket_to_board_id.get(self)
    sockets[board_id].remove(self)
