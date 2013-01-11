import tornado.ioloop
import tornado.web
import options


class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.write("Hello world!!")

application = tornado.web.Application([
    (r"/", MainHandler),
])

if __name__ == "__main__":
    application.listen(options.cli_args.port)
    tornado.ioloop.IOLoop.instance().start()
