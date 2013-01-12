import datetime
from dictshield.document import Document, EmbeddedDocument
from dictshield.fields import UUIDField, StringField, FloatField, BooleanField
from dictshield.fields.compound import ListField, EmbeddedDocumentField

from redis_connection import redis_conn as r
import json

class Item(EmbeddedDocument):
  id     = UUIDField    (auto_fill  = True)
  url    = StringField  (max_length = 300)
  pos_x  = FloatField   ()
  pos_y  = FloatField   ()
  scale  = FloatField   ()
  tags   = ListField    (StringField())
  locked = BooleanField (default=True)

class Board(Document):
  id          = UUIDField (auto_fill = True)
  read_only   = UUIDField (auto_fill = True)
  items       = ListField (EmbeddedDocumentField(Item))

  def save(self):
    r.set("b_" + str(self.id), str(self.to_json()))

  @classmethod
  def get(cls, board_id):
    b_str = r.get("b_%s" % board_id)
    b_json = json.loads(b_str)
    print str(b_json)
    return Board(**b_json)

