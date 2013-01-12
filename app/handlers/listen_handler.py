import json
from tornado import websocket

from models import Board

class EchoWebSocket(websocket.WebSocketHandler):
  def open(self, board_id):
    board = Board.get(board_id)
    self.write_message(json.dumps({'board': json.loads(board.to_json())}))

  def on_message(self, message):
    print 'message received %s' % message

  def on_close(self):
    print "WebSocket closed"
