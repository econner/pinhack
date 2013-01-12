from redis_connection import redis_conn as r
import tornado.web
import uuid

from models import Item, Board


class MainHandler(tornado.web.RequestHandler):
  def get(self):
    b = Board()
    b.id = uuid.uuid4()
    b.read_only = uuid.uuid4()
    r.set("b_" + str(b.id), str(b.to_json()))
    print 'created a board'
    self.redirect('/'+str(b.id))

class BoardHandler(tornado.web.RequestHandler):
  def get(self):
    self.render('../../static/index.html')
