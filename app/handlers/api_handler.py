from redis_connection import redis_conn as r
import tornado.web
from models import Item, Board
import uuid
import json

class AddItemHandler(tornado.web.RequestHandler):
  def put(self, id = None, *args, **kwargs):
    board_id  = self.get_argument('board_id')
    url       = self.get_argument('url')
    image_url = self.get_argument('image_url')
    tags      = self.get_argument('tags')
    pos_x     = self.get_argument('pos_x')
    pos_y     = self.get_argument('pos_y')
    scale     = self.get_argument('scale')
    locked    = self.get_argument('locked')
    item = Item(id=uuid.uuid4(), url=url, image_url=image_url, tags=tags,
                pos_x=pos_x, pos_y=pos_y, scale=scale, locked=locked)
    b = Board.get_from_db(board_id)
    b.items.append(item)
    b.save()
  def get(self):
    self.write("Write only, bud")
    
class RemoveItemHandler(tornado.web.RequestHandler):
  def put(self, id = None, *args, **kwargs):
    board_id = self.get_argument('board_id')
    item_id = self.get_argument('id')
    b = Board.get_from_db(board_id)
    for item in b.items:
        if item_id == item.id:
            b.items.remove(item)
    b.save()
  def get(self):
    self.write("Pop chips.")
