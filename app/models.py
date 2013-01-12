import datetime
from dictshield.document import Document, EmbeddedDocument
from dictshield.fields import UUIDField, StringField, FloatField, BooleanField
from dictshield.fields.compound import ListField, EmbeddedDocumentField

from redis_connection import redis_conn as r
import json

class Item(EmbeddedDocument):
  id        = UUIDField    (auto_fill  = True)
  url       = StringField  (max_length = 2200)
  image_url = StringField  (max_length = 2200)
  pos_x     = FloatField   ()
  pos_y     = FloatField   ()
  scale     = FloatField   ()
  tags      = ListField    (StringField())
  locked    = BooleanField (default = True)

class Board(Document):
  board_id  = StringField  (max_length = 1200)
  id          = UUIDField (auto_fill = True)
  name      = StringField (max_length = 32, default="Pinboard")
  read_only   = UUIDField (auto_fill = True)
  items       = ListField (EmbeddedDocumentField(Item))

  def save(self):
    r.set("b_" + str(self.board_id), str(self.to_json()))

  def updateItem(self, item):
    updatee = item
    for i in range(len(self.items)):
      if updatee.id == self.items[i].id:
        self.items[i] = updatee

  @classmethod
  def get(cls, board_id):
    b_str = r.get("b_%s" % board_id)
    if not b_str:
      return None
    b_json = json.loads(b_str)
    return Board(**b_json)

