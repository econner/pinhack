import tornado.ioloop
import tornado.httpserver
import tornado.web
import options
from handlers import main_handler, api_handler, listen_handler
from handlers import imageHandler


class Application(tornado.web.Application):
    def __init__(self):
        url_handlers = [
            (r'/ws/(.*\-.*)', listen_handler.EchoWebSocket),
            (r"/", main_handler.MainHandler),
            (r'/static/(.*)', tornado.web.StaticFileHandler, {'path': 'static/'}),
            (r'/add_item/', api_handler.AddItemHandler),
            (r"/image/", imageHandler.ImageHandler),
            (r'/(.*\-.*)', main_handler.BoardHandler),
        ]
        tornado.web.Application.__init__(self,
                                         url_handlers,
                                         autoescape=None,
                                         **options.tornado_settings)

if __name__ == "__main__":
    http_server = tornado.httpserver.HTTPServer(Application())
    http_server.listen(options.cli_args.port)
    tornado.ioloop.IOLoop.instance().start()
