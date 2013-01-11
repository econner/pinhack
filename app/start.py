import uuid
import tornado.ioloop
import tornado.web
import options
import redis
from tornadio2.server import SocketServer

from models import Item, Board

r = redis.StrictRedis(host='localhost', port=6379, db=0)
r.set('foo', 'bar')

class MainHandler(tornado.web.RequestHandler):
  def get(self):
    b = Board()
    b.id = uuid.uuid4()
    b.read_only = uuid.uuid4()
    r.set("b_" + str(b.id), str(b.to_json()))
    print 'created a board'
    self.redirect('/'+str(b.id))

application = tornado.web.Application([
  (r"/", MainHandler),
  (r'/static/(.*)', tornado.web.StaticFileHandler, {'path': 'static/'}),
])

if __name__ == "__main__":
  application.listen(options.cli_args.port)
  tornado.ioloop.IOLoop.instance().start()
