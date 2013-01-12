from redis_connection import redis_conn as r
import tornado.web
import uuid

from models import Item, Board


class MainHandler(tornado.web.RequestHandler):
  def get(self):
    b = Board(id=uuid.uuid4(), read_only=uuid.uuid4())
    b.save()
    print 'created a board!!!'
    self.redirect('/'+str(b.id))

class BoardHandler(tornado.web.RequestHandler):
  def get(self, board_id):
    board = Board.get(board_id)
    if not board:
      raise tornado.web.HTTPError(404)
    self.render('index.html', board=board)
