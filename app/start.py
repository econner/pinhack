import tornado.ioloop
import tornado.web
import options
import redis
from tornadio2.server import SocketServer


class MainHandler(tornado.web.RequestHandler):
    def get(self):
        r = redis.StrictRedis(host='localhost', port=6379, db=0)
        r.set('foo', 'bar')
        self.write("Hello world!  Redis said: %s" % r.get('foo'))

application = tornado.web.Application([
    (r"/", MainHandler),
    (r'/static/(.*)', tornado.web.StaticFileHandler, {'path': 'static/'}),
])

if __name__ == "__main__":
    application.listen(options.cli_args.port)
    socketio_server = SocketServer(application)
