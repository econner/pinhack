import tornado.web
import uuid
import options
from models import Board


class MainHandler(tornado.web.RequestHandler):
    def get(self):
        board_id = uuid.uuid4().hex[:8]
        b = Board(id=uuid.uuid4(), board_id=board_id, read_only=uuid.uuid4())
        b.save()
        self.redirect('/%s' % str(b.board_id))


class BoardHandler(tornado.web.RequestHandler):
    def get(self, board_id):
        board = Board.get(board_id)
        if not board:
            raise tornado.web.HTTPError(404)
        self.render('index.html', board=board, debug=options.cli_args.debug)
