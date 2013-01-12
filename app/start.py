import tornado.ioloop
import tornado.web
import options

from handlers import main_handler, api_handler

application = tornado.web.Application([
  (r"/", main_handler.MainHandler),
  (r'/static/(.*)', tornado.web.StaticFileHandler, {'path': 'static/'}),
  (r'/add_item/', api_handler.AddItemHandler),
])

if __name__ == "__main__":
  application.listen(options.cli_args.port)
  tornado.ioloop.IOLoop.instance().start()
