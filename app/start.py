import tornado.ioloop
import tornado.web
import options

from handlers import main_handler
from handlers import imageHandler

application = tornado.web.Application([
  (r"/", main_handler.MainHandler),
  (r"/image/", imageHandler.ImageHandler),
  (r'/static/(.*)', tornado.web.StaticFileHandler, {'path': 'static/'}),
])

if __name__ == "__main__":
  application.listen(options.cli_args.port)
  tornado.ioloop.IOLoop.instance().start()
