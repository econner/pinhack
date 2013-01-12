import tornado.ioloop
import tornado.httpserver
import tornado.web
import options
from handlers import listen_handler
from handlers import main_handler

application = tornado.web.Application([
  (r'/ws', listen_handler.EchoWebSocket),
  (r"/", main_handler.MainHandler),
  (r'/static/(.*)', tornado.web.StaticFileHandler, {'path': 'static/'}),
])

if __name__ == "__main__":
  http_server = tornado.httpserver.HTTPServer(application)
  application.listen(options.cli_args.port)
  tornado.ioloop.IOLoop.instance().start()
